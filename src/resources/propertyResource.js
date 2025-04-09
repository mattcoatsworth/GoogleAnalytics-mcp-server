import { getAnalyticsClient, getDefaultPropertyId } from '../auth.js';

    export const propertyResource = {
      template: "ga://property/{propertyId}",
      list: undefined,
      handler: async (uri, { propertyId }) => {
        try {
          const analyticsData = await getAnalyticsClient();
          const resolvedPropertyId = propertyId || getDefaultPropertyId().replace('properties/', '');
          
          if (!resolvedPropertyId) {
            return {
              contents: [{
                uri: uri.href,
                text: "Error: No property ID provided and no default property ID set"
              }]
            };
          }

          // Get property information from the Admin API
          const admin = google.analyticsadmin({
            version: 'v1beta',
            auth: analyticsData.context._options.auth
          });

          const property = await admin.properties.get({
            name: `properties/${resolvedPropertyId}`
          });

          return {
            contents: [{
              uri: uri.href,
              text: `Google Analytics Property Information:
              
Property ID: ${property.data.name}
Display Name: ${property.data.displayName}
Time Zone: ${property.data.timeZone}
Currency: ${property.data.currencyCode}
Create Time: ${property.data.createTime}
Update Time: ${property.data.updateTime}
Service Level: ${property.data.serviceLevel}
Account: ${property.data.account}
`
            }]
          };
        } catch (error) {
          console.error('Error fetching property information:', error);
          return {
            contents: [{
              uri: uri.href,
              text: `Error fetching property information: ${error.message}`
            }]
          };
        }
      }
    };
