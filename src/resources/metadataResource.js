import { getAnalyticsClient } from '../auth.js';
    import { formatMetadataResponse } from '../utils/formatters.js';

    export const metadataResource = {
      template: "ga://metadata",
      list: undefined,
      handler: async (uri) => {
        try {
          const analyticsData = await getAnalyticsClient();
          
          const response = await analyticsData.properties.getMetadata({
            name: 'analyticsData:metadata'
          });

          const formattedResponse = formatMetadataResponse(response.data);

          return {
            contents: [{
              uri: uri.href,
              text: formattedResponse
            }]
          };
        } catch (error) {
          console.error('Error fetching metadata:', error);
          return {
            contents: [{
              uri: uri.href,
              text: `Error fetching metadata: ${error.message}`
            }]
          };
        }
      }
    };
