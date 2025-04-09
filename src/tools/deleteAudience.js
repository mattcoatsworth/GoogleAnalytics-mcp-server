import { z } from 'zod';
    import { getAnalyticsClient } from '../auth.js';

    export const deleteAudience = {
      schema: {
        name: z.string().describe("Audience resource name (format: properties/123456789/audiences/abcdef)")
      },
      handler: async (params) => {
        try {
          const analyticsData = await getAnalyticsClient();

          await analyticsData.properties.audiences.delete({
            name: params.name
          });

          return {
            content: [{ 
              type: "text", 
              text: `Audience ${params.name} deleted successfully.` 
            }]
          };
        } catch (error) {
          console.error('Error deleting audience:', error);
          return {
            content: [{ type: "text", text: `Error deleting audience: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Delete an audience from Google Analytics"
    };
