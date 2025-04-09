import { z } from 'zod';
    import { getAnalyticsClient } from '../auth.js';

    export const updateAudience = {
      schema: {
        name: z.string().describe("Audience resource name (format: properties/123456789/audiences/abcdef)"),
        displayName: z.string().optional().describe("Display name for the audience"),
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
                  }).optional()
                }).describe("Filter definition")
              })).describe("List of filter expressions")
            }).describe("AND group of filter expressions")
          }).describe("Filter expression")
        })).optional().describe("Filter clauses for the audience"),
        updateMask: z.string().optional().describe("Comma-separated list of fields to update")
      },
      handler: async (params) => {
        try {
          const analyticsData = await getAnalyticsClient();

          const audience = {
            name: params.name
          };

          if (params.displayName) audience.displayName = params.displayName;
          if (params.description) audience.description = params.description;
          if (params.membershipDurationDays) audience.membershipDurationDays = params.membershipDurationDays;
          if (params.filterClauses) audience.filterClauses = params.filterClauses;

          const response = await analyticsData.properties.audiences.patch({
            name: params.name,
            updateMask: params.updateMask,
            requestBody: audience
          });

          return {
            content: [{ 
              type: "text", 
              text: `Audience updated successfully:\n${JSON.stringify(response.data, null, 2)}` 
            }]
          };
        } catch (error) {
          console.error('Error updating audience:', error);
          return {
            content: [{ type: "text", text: `Error updating audience: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Update an existing audience in Google Analytics"
    };
