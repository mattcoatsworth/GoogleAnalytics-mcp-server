import { getAnalyticsClient, getDefaultPropertyId } from '../auth.js';
    import { formatReportResponse } from '../utils/formatters.js';

    export const reportResource = {
      template: "ga://report/{propertyId}/{reportType}/{dimensions}/{metrics}/{startDate}/{endDate}",
      list: undefined,
      handler: async (uri, { propertyId, reportType, dimensions, metrics, startDate, endDate }) => {
        try {
          const analyticsData = await getAnalyticsClient();
          const resolvedPropertyId = propertyId ? 
            `properties/${propertyId}` : 
            getDefaultPropertyId();
          
          if (!resolvedPropertyId) {
            return {
              contents: [{
                uri: uri.href,
                text: "Error: No property ID provided and no default property ID set"
              }]
            };
          }

          const dimensionsList = dimensions ? dimensions.split(',').map(d => ({ name: d })) : [];
          const metricsList = metrics ? metrics.split(',').map(m => ({ name: m })) : [];
          
          if (metricsList.length === 0) {
            return {
              contents: [{
                uri: uri.href,
                text: "Error: At least one metric must be specified"
              }]
            };
          }

          const dateRanges = [{
            startDate: startDate || '7daysAgo',
            endDate: endDate || 'today'
          }];

          let response;
          if (reportType === 'pivot') {
            // For pivot reports, we need to determine a dimension to pivot on
            // Here we'll use the first dimension as the pivot dimension if available
            const pivots = dimensionsList.length > 0 ? [{
              fieldNames: [dimensionsList[0].name],
              limit: 10
            }] : undefined;

            response = await analyticsData.properties.runPivotReport({
              property: resolvedPropertyId,
              dimensions: dimensionsList,
              metrics: metricsList,
              dateRanges,
              pivots
            });
          } else {
            // Default to standard report
            response = await analyticsData.properties.runReport({
              property: resolvedPropertyId,
              dimensions: dimensionsList,
              metrics: metricsList,
              dateRanges
            });
          }

          const formattedResponse = formatReportResponse(response.data);

          return {
            contents: [{
              uri: uri.href,
              text: formattedResponse
            }]
          };
        } catch (error) {
          console.error('Error generating report:', error);
          return {
            contents: [{
              uri: uri.href,
              text: `Error generating report: ${error.message}`
            }]
          };
        }
      }
    };
