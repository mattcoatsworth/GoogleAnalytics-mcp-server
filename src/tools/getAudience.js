import { z } from 'zod';
    import { getAnalyticsClient } from '../auth.js';

    export const getAudience = {
      schema: {
        name: z.string().describe("Audience resource name (format: properties/123456789/audiences/abcdef)")
      },
      handler: async (params) => {
        try {
          const analyticsData = await getAnalyticsClient();

          const response = await analyticsData.properties.audiences.get({
            name: params.name
          });

          return {
            content: [{ 
              type: "text", 
              text: `Audience details:\n${JSON.stringify(response.data, null, 2)}` 
            }]
          };
        } catch (error) {
          console.error('Error getting audience:', error);
          return {
            content: [{ type: "text", text: `Error getting audience: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Get details of a specific audience in Google Analytics"
    };
