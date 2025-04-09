import { z } from 'zod';
    import { getAnalyticsClient } from '../auth.js';

    export const checkCompatibility = {
      schema: {
        dimensions: z.array(z.string()).optional().describe("Dimension names to check compatibility"),
        metrics: z.array(z.string()).optional().describe("Metric names to check compatibility"),
        compatibility: z.enum(['COMPATIBLE', 'INCOMPATIBLE']).optional().describe("Filter by compatibility status")
      },
      handler: async (params) => {
        try {
          const analyticsData = await getAnalyticsClient();
          
          // First get metadata to check compatibility
          const metadata = await analyticsData.properties.getMetadata({
            name: 'analyticsData:metadata'
          });
          
          const { dimensions, metrics } = metadata.data;
          
          let results = [];
          
          // Check dimension compatibility
          if (params.dimensions && params.dimensions.length > 0) {
            const dimensionResults = checkDimensionCompatibility(
              dimensions, 
              params.dimensions, 
              params.metrics || [], 
              params.compatibility
            );
            results = results.concat(dimensionResults);
          }
          
          // Check metric compatibility
          if (params.metrics && params.metrics.length > 0) {
            const metricResults = checkMetricCompatibility(
              metrics, 
              params.metrics, 
              params.dimensions || [], 
              params.compatibility
            );
            results = results.concat(metricResults);
          }
          
          return {
            content: [{ 
              type: "text", 
              text: formatCompatibilityResults(results)
            }]
          };
        } catch (error) {
          console.error('Error checking compatibility:', error);
          return {
            content: [{ type: "text", text: `Error checking compatibility: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Check compatibility between dimensions and metrics in Google Analytics"
    };
