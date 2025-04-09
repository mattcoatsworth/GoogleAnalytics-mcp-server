import { z } from 'zod';
    import { getAnalyticsClient, getDefaultPropertyId } from '../auth.js';
    import { formatBatchReportResponse } from '../utils/formatters.js';

    export const batchRunReports = {
      schema: {
        propertyId: z.string().optional().describe("Google Analytics property ID (format: properties/123456789)"),
        requests: z.array(z.object({
          dateRanges: z.array(z.object({
            startDate: z.string().describe("Start date in YYYY-MM-DD format"),
            endDate: z.string().describe("End date in YYYY-MM-DD format")
          })).describe("Date ranges for the query"),
          dimensions: z.array(z.object({
            name: z.string().describe("Dimension name")
          })).optional().describe("Dimensions to include in the report"),
          metrics: z.array(z.object({
            name: z.string().describe("Metric name")
          })).describe("Metrics to include in the report"),
          limit: z.number().optional().describe("Maximum number of rows to return"),
          offset: z.number().optional().describe("Number of rows to skip"),
          orderBys: z.array(z.object({
            dimension: z.object({ name: z.string() }).optional(),
            metric: z.object({ name: z.string() }).optional(),
            desc: z.boolean().optional()
          })).optional().describe("Order specifications for the rows"),
          dimensionFilter: z.any().optional().describe("Filter for dimensions"),
          metricFilter: z.any().optional().describe("Filter for metrics"),
          keepEmptyRows: z.boolean().optional().describe("Whether to keep empty rows")
        })).describe("Array of report requests to run in batch")
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

          const request = {
            property: propertyId,
            requests: params.requests
          };

          const response = await analyticsData.properties.batchRunReports(request);
          const formattedResponse = formatBatchReportResponse(response.data);

          return {
            content: [{ type: "text", text: formattedResponse }]
          };
        } catch (error) {
          console.error('Error running batch reports:', error);
          return {
            content: [{ type: "text", text: `Error running batch reports: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Run multiple reports in a single batch on Google Analytics data"
    };
