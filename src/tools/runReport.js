import { z } from 'zod';
    import { getAnalyticsClient, getDefaultPropertyId } from '../auth.js';
    import { formatReportResponse } from '../utils/formatters.js';

    export const runReport = {
      schema: {
        propertyId: z.string().optional().describe("Google Analytics property ID (format: properties/123456789)"),
        dateRanges: z.array(z.object({
          startDate: z.string().describe("Start date in YYYY-MM-DD format"),
          endDate: z.string().describe("End date in YYYY-MM-DD format")
        })).describe("Date ranges for the query"),
        dimensions: z.array(z.object({
          name: z.string().describe("Dimension name (e.g., 'country', 'deviceCategory')")
        })).optional().describe("Dimensions to include in the report"),
        metrics: z.array(z.object({
          name: z.string().describe("Metric name (e.g., 'activeUsers', 'sessions')")
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
            dateRanges: params.dateRanges,
            dimensions: params.dimensions || [],
            metrics: params.metrics,
            limit: params.limit,
            offset: params.offset,
            orderBys: params.orderBys,
            dimensionFilter: params.dimensionFilter,
            metricFilter: params.metricFilter,
            keepEmptyRows: params.keepEmptyRows
          };

          const response = await analyticsData.properties.runReport(request);
          const formattedResponse = formatReportResponse(response.data);

          return {
            content: [{ type: "text", text: formattedResponse }]
          };
        } catch (error) {
          console.error('Error running report:', error);
          return {
            content: [{ type: "text", text: `Error running report: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Run a report on Google Analytics data"
    };
