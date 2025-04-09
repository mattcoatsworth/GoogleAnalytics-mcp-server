import { getAnalyticsClient, getDefaultPropertyId } from '../auth.js';

    export const audiencesResource = {
      template: "ga://audiences/{propertyId}/{audienceId}",
      list: {
        template: "ga://audiences/{propertyId}",
        handler: async (uri, { propertyId }) => {
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

            const response = await analyticsData.properties.audiences.list({
              parent: resolvedPropertyId
            });

            if (!response.data.audiences || response.data.audiences.length === 0) {
              return {
                contents: [{
                  uri: uri.href,
                  text: `No audiences found for property: ${resolvedPropertyId}`
                }]
              };
            }

            const audiencesList = response.data.audiences.map(audience => {
              return `- ${audience.displayName} (${audience.name.split('/').pop()})
  Description: ${audience.description || 'No description'}
  Created: ${audience.createTime}`;
            }).join('\n\n');

            return {
              contents: [{
                uri: uri.href,
                text: `Google Analytics Audiences for ${resolvedPropertyId}:
                
${audiencesList}`
              }],
              links: response.data.audiences.map(audience => {
                const audienceId = audience.name.split('/').pop();
                const propertyIdPart = resolvedPropertyId.replace('properties/', '');
                return {
                  uri: `ga://audiences/${propertyIdPart}/${audienceId}`,
                  title: audience.displayName
                };
              })
            };
          } catch (error) {
            console.error('Error fetching audiences:', error);
            return {
              contents: [{
                uri: uri.href,
                text: `Error fetching audiences: ${error.message}`
              }]
            };
          }
        }
      },
      handler: async (uri, { propertyId, audienceId }) => {
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

          const audienceName = `${resolvedPropertyId}/audiences/${audienceId}`;
          
          const response = await analyticsData.properties.audiences.get({
            name: audienceName
          });

          const audience = response.data;
          
          // Format filter clauses if they exist
          let filterDescription = 'None';
          if (audience.filterClauses && audience.filterClauses.length > 0) {
            filterDescription = JSON.stringify(audience.filterClauses, null, 2);
          }

          return {
            contents: [{
              uri: uri.href,
              text: `Audience Details: ${audience.displayName}
              
ID: ${audience.name}
Description: ${audience.description || 'No description'}
Created: ${audience.createTime}
Updated: ${audience.updateTime}
Membership Duration: ${audience.membershipDurationDays || 'Not specified'} days

Filter Clauses:
${filterDescription}`
            }]
          };
        } catch (error) {
          console.error('Error fetching audience details:', error);
          return {
            contents: [{
              uri: uri.href,
              text: `Error fetching audience details: ${error.message}`
            }]
          };
        }
      }
    };
