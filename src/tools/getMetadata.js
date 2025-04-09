import { z } from 'zod';
    import { getAnalyticsClient } from '../auth.js';
    import { formatMetadataResponse } from '../utils/formatters.js';

    export const getMetadata = {
      schema: {
        name: z.string().optional().describe("Metadata resource name (default: 'analyticsData:metadata')")
      },
      handler: async (params) => {
        try {
          const analyticsData = await getAnalyticsClient();
          const name = params.name || 'analyticsData:metadata';

          const response = await analyticsData.properties.getMetadata({
            name
          });

          const formattedResponse = formatMetadataResponse(response.data);

          return {
            content: [{ type: "text", text: formattedResponse }]
          };
        } catch (error) {
          console.error('Error getting metadata:', error);
          return {
            content: [{ type: "text", text: `Error getting metadata: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Get Google Analytics metadata including dimensions and metrics definitions"
    };
