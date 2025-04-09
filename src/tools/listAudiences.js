import { z } from 'zod';
    import { getAnalyticsClient, getDefaultPropertyId } from '../auth.js';

    export const listAudiences = {
      schema: {
        propertyId: z.string().optional().describe("Google Analytics property ID (format: properties/123456789)"),
        pageSize: z.number().optional().describe("Maximum number of audiences to return"),
        pageToken: z.string().optional().describe("Page token for pagination")
      },
      handler: async (params) => {
        try {
          const analyticsData = await getAnalyticsClient();
          const propertyId = params.propertyId || getDefaultPropertyId();
          
          if (!propertyId) {
            return {
              content: [{ type: "text", text: "Error: No property ID provided and no default property ID set" }],
              isError: true
            };
          }

          const response = await analyticsData.properties.audiences.list({
            parent: propertyId,
            pageSize: params.pageSize,
            pageToken: params.pageToken
          });

          return {
            content: [{ 
              type: "text", 
              text: `Audiences:\n${JSON.stringify(response.data, null, 2)}` 
            }]
          };
        } catch (error) {
          console.error('Error listing audiences:', error);
          return {
            content: [{ type: "text", text: `Error listing audiences: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "List audiences in a Google Analytics property"
    };
