import { getAnalyticsClient } from '../auth.js';

    export const metricsResource = {
      template: "ga://metrics/{category}",
      list: {
        template: "ga://metrics",
        handler: async (uri) => {
          try {
            const analyticsData = await getAnalyticsClient();
            
            const response = await analyticsData.properties.getMetadata({
              name: 'analyticsData:metadata'
            });

            // Group metrics by category
            const metricsByCategory = {};
            response.data.metrics.forEach(metric => {
              const category = metric.category || 'Uncategorized';
              if (!metricsByCategory[category]) {
                metricsByCategory[category] = [];
              }
              metricsByCategory[category].push(metric.apiName);
            });

            // Create list of categories
            const categories = Object.keys(metricsByCategory).sort();
            
            return {
              contents: [{
                uri: uri.href,
                text: `Google Analytics Metric Categories:
                
${categories.map(category => `- ${category}`).join('\n')}
                
Access a specific category using: ga://metrics/{category}`
              }],
              links: categories.map(category => ({
                uri: `ga://metrics/${encodeURIComponent(category)}`,
                title: category
              }))
            };
          } catch (error) {
            console.error('Error fetching metrics:', error);
            return {
              contents: [{
                uri: uri.href,
                text: `Error fetching metrics: ${error.message}`
              }]
            };
          }
        }
      },
      handler: async (uri, { category }) => {
        try {
          const analyticsData = await getAnalyticsClient();
          
          const response = await analyticsData.properties.getMetadata({
            name: 'analyticsData:metadata'
          });

          // Filter metrics by category
          const decodedCategory = decodeURIComponent(category);
          const metrics = response.data.metrics.filter(
            metric => (metric.category || 'Uncategorized') === decodedCategory
          );

          if (metrics.length === 0) {
            return {
              contents: [{
                uri: uri.href,
                text: `No metrics found in category: ${decodedCategory}`
              }]
            };
          }

          // Format metric information
          const metricInfo = metrics.map(metric => {
            return `- ${metric.apiName}: ${metric.uiName}
  Description: ${metric.description || 'No description available'}
  Type: ${metric.type || 'Unknown'}
  Expression: ${metric.expression || 'N/A'}
  Custom: ${metric.customDefinition ? 'Yes' : 'No'}
  Deprecated: ${metric.deprecated ? 'Yes' : 'No'}`;
          }).join('\n\n');

          return {
            contents: [{
              uri: uri.href,
              text: `Google Analytics Metrics in category "${decodedCategory}":
              
${metricInfo}`
            }]
          };
        } catch (error) {
          console.error('Error fetching metrics by category:', error);
          return {
            contents: [{
              uri: uri.href,
              text: `Error fetching metrics by category: ${error.message}`
            }]
          };
        }
      }
    };
