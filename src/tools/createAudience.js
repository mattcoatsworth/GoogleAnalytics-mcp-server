import { z } from 'zod';
    import { getAnalyticsClient, getDefaultPropertyId } from '../auth.js';

    export const createAudience = {
      schema: {
        propertyId: z.string().optional().describe("Google Analytics property ID (format: properties/123456789)"),
        displayName: z.string().describe("Display name for the audience"),
        description: z.string().optional().describe("Description of the audience"),
        membershipDurationDays: z.number().optional().describe("Membership duration in days"),
        filterClauses: z.array(z.object({
          filterExpression: z.object({
            andGroup: z.object({
              expressions: z.array(z.object({
                filter: z.object({
                  fieldName: z.string().describe("Field name to filter on"),
                  stringFilter: z.object({
                    value: z.string().describe("String value to match"),
                    matchType: z.enum([
                      'EXACT', 
                      'BEGINS_WITH', 
                      'ENDS_WITH', 
                      'CONTAINS', 
                      'FULL_REGEXP', 
                      'PARTIAL_REGEXP'
                    ]).describe("Type of string match")
                  }).optional(),
                  inListFilter: z.object({
                    values: z.array(z.string()).describe("List of values to match")
                  }).optional(),
                  numericFilter: z.object({
                    operation: z.enum([
                      'EQUAL', 
                      'LESS_THAN', 
                      'LESS_THAN_OR_EQUAL', 
                      'GREATER_THAN', 
                      'GREATER_THAN_OR_EQUAL'
                    ]).describe("Numeric comparison operation"),
                    value: z.object({
                      int64Value: z.string().describe("Integer value for comparison")
                    }).optional(),
                    doubleValue: z.number().optional().describe("Double value for comparison")
                  }).optional(),
                  betweenFilter: z.object({
                    fromValue: z.object({
                      int64Value: z.string().optional(),
                      doubleValue: z.number().optional()
                    }).describe("Lower bound value"),
                    toValue: z.object({
                      int64Value: z.string().optional(),
                      doubleValue: z.number().optional()
                    }).describe("Upper bound value")
                  }).optional()
                }).describe("Filter definition")
              })).describe("List of filter expressions")
            }).describe("AND group of filter expressions")
          }).describe("Filter expression")
        })).describe("Filter clauses for the audience")
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

          const audience = {
            displayName: params.displayName,
            description: params.description,
            membershipDurationDays: params.membershipDurationDays,
            filterClauses: params.filterClauses
          };

          const response = await analyticsData.properties.audiences.create({
            parent: propertyId,
            audience
          });

          return {
            content: [{ 
              type: "text", 
              text: `Audience created successfully:\n${JSON.stringify(response.data, null, 2)}` 
            }]
          };
        } catch (error) {
          console.error('Error creating audience:', error);
          return {
            content: [{ type: "text", text: `Error creating audience: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Create a new audience in Google Analytics"
    };
