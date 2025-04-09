import { getAnalyticsClient } from '../auth.js';

    export const dimensionsResource = {
      template: "ga://dimensions/{category}",
      list: {
        template: "ga://dimensions",
        handler: async (uri) => {
          try {
            const analyticsData = await getAnalyticsClient();
            
            const response = await analyticsData.properties.getMetadata({
              name: 'analyticsData:metadata'
            });

            // Group dimensions by category
            const dimensionsByCategory = {};
            response.data.dimensions.forEach(dimension => {
              const category = dimension.category || 'Uncategorized';
              if (!dimensionsByCategory[category]) {
                dimensionsByCategory[category] = [];
              }
              dimensionsByCategory[category].push(dimension.apiName);
            });

            // Create list of categories
            const categories = Object.keys(dimensionsByCategory).sort();
            
            return {
              contents: [{
                uri: uri.href,
                text: `Google Analytics Dimension Categories:
                
${categories.map(category => `- ${category}`).join('\n')}
                
Access a specific category using: ga://dimensions/{category}`
              }],
              links: categories.map(category => ({
                uri: `ga://dimensions/${encodeURIComponent(category)}`,
                title: category
              }))
            };
          } catch (error) {
            console.error('Error fetching dimensions:', error);
            return {
              contents: [{
                uri: uri.href,
                text: `Error fetching dimensions: ${error.message}`
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

          // Filter dimensions by category
          const decodedCategory = decodeURIComponent(category);
          const dimensions = response.data.dimensions.filter(
            dimension => (dimension.category || 'Uncategorized') === decodedCategory
          );

          if (dimensions.length === 0) {
            return {
              contents: [{
                uri: uri.href,
                text: `No dimensions found in category: ${decodedCategory}`
              }]
            };
          }

          // Format dimension information
          const dimensionInfo = dimensions.map(dimension => {
            return `- ${dimension.apiName}: ${dimension.uiName}
  Description: ${dimension.description || 'No description available'}
  Custom: ${dimension.customDefinition ? 'Yes' : 'No'}
  Deprecated: ${dimension.deprecated ? 'Yes' : 'No'}`;
          }).join('\n\n');

          return {
            contents: [{
              uri: uri.href,
              text: `Google Analytics Dimensions in category "${decodedCategory}":
              
${dimensionInfo}`
            }]
          };
        } catch (error) {
          console.error('Error fetching dimensions by category:', error);
          return {
            contents: [{
              uri: uri.href,
              text: `Error fetching dimensions by category: ${error.message}`
            }]
          };
        }
      }
    };
