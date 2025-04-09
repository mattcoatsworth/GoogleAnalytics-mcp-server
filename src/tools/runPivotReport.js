import { z } from 'zod';
    import { getAnalyticsClient, getDefaultPropertyId } from '../auth.js';
    import { formatPivotReportResponse } from '../utils/formatters.js';

    export const runPivotReport = {
      schema: {
        propertyId: z.string().optional().describe("Google Analytics property ID (format: properties/123456789)"),
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
        pivots: z.array(z.object({
          fieldNames: z.array(z.string()).describe("Names of dimensions to pivot"),
          limit: z.number().optional().describe("Maximum number of pivot rows"),
          offset: z.number().optional().describe("Number of pivot rows to skip"),
          orderBys: z.array(z.object({
            dimension: z.object({ name: z.string() }).optional(),
            metric: z.object({ name: z.string() }).optional(),
            desc: z.boolean().optional()
          })).optional().describe("Order specifications for the pivot rows")
        })).describe("Pivot specifications for the report"),
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
            pivots: params.pivots,
            limit: params.limit,
            offset: params.offset,
            orderBys: params.orderBys,
            dimensionFilter: params.dimensionFilter,
            metricFilter: params.metricFilter,
            keepEmptyRows: params.keepEmptyRows
          };

          const response = await analyticsData.properties.runPivotReport(request);
          const formattedResponse = formatPivotReportResponse(response.data);

          return {
            content: [{ type: "text", text: formattedResponse }]
          };
        } catch (error) {
          console.error('Error running pivot report:', error);
          return {
            content: [{ type: "text", text: `Error running pivot report: ${error.message}` }],
            isError: true
          };
        }
      },
      description: "Run a pivot report on Google Analytics data"
    };
