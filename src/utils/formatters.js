/**
     * Formats a standard report response into a readable text format
     * @param {Object} data - The report response data
     * @returns {string} Formatted report text
     */
    export function formatReportResponse(data) {
      if (!data || !data.rows || data.rows.length === 0) {
        return "No data available for this report.";
      }

      // Extract dimension and metric headers
      const dimensionHeaders = data.dimensionHeaders || [];
      const metricHeaders = data.metricHeaders || [];
      
      // Create header row
      const headers = [
        ...dimensionHeaders.map(d => d.name),
        ...metricHeaders.map(m => m.name)
      ];
      
      // Format rows
      const rows = data.rows.map(row => {
        const dimensionValues = row.dimensionValues?.map(d => d.value) || [];
        const metricValues = row.metricValues?.map(m => m.value) || [];
        return [...dimensionValues, ...metricValues];
      });
      
      // Calculate column widths
      const columnWidths = headers.map((header, index) => {
        const values = [header, ...rows.map(row => row[index] || '')];
        return Math.max(...values.map(v => String(v).length)) + 2;
      });
      
      // Create header row
      const headerRow = headers.map((header, index) => 
        header.padEnd(columnWidths[index])
      ).join('');
      
      // Create separator row
      const separatorRow = columnWidths.map(width => 
        '-'.repeat(width)
      ).join('');
      
      // Create data rows
      const dataRows = rows.map(row => 
        row.map((value, index) => 
          String(value).padEnd(columnWidths[index])
        ).join('')
      );
      
      // Combine all rows
      return [
        `Total rows: ${data.rowCount}`,
        '',
        headerRow,
        separatorRow,
        ...dataRows
      ].join('\n');
    }

    /**
     * Formats a batch report response into a readable text format
     * @param {Object} data - The batch report response data
     * @returns {string} Formatted batch report text
     */
    export function formatBatchReportResponse(data) {
      if (!data || !data.reports || data.reports.length === 0) {
        return "No data available for these reports.";
      }
      
      // Format each report
      const formattedReports = data.reports.map((report, index) => {
        return `Report #${index + 1}:\n${formatReportResponse(report)}`;
      });
      
      // Combine all reports
      return formattedReports.join('\n\n' + '-'.repeat(40) + '\n\n');
    }

    /**
     * Formats a pivot report response into a readable text format
     * @param {Object} data - The pivot report response data
     * @returns {string} Formatted pivot report text
     */
    export function formatPivotReportResponse(data) {
      if (!data || !data.rows || data.rows.length === 0) {
        return "No data available for this pivot report.";
      }
      
      // This is a simplified formatter for pivot reports
      // A complete implementation would handle the pivot structure more elegantly
      
      // Extract dimension and metric headers
      const dimensionHeaders = data.dimensionHeaders || [];
      const metricHeaders = data.metricHeaders || [];
      
      // Create a text representation
      let result = `Pivot Report (${data.rowCount} rows)\n\n`;
      
      // Add dimension headers
      result += "Dimensions:\n";
      dimensionHeaders.forEach(header => {
        result += `- ${header.name}\n`;
      });
      
      // Add metric headers
      result += "\nMetrics:\n";
      metricHeaders.forEach(header => {
        result += `- ${header.name}\n`;
      });
      
      // Add pivot data (simplified)
      result += "\nData (first 10 rows):\n";
      
      const maxRows = Math.min(data.rows.length, 10);
      for (let i = 0; i < maxRows; i++) {
        const row = data.rows[i];
        
        // Add dimension values
        result += "\nRow " + (i + 1) + ":\n";
        result += "  Dimensions: ";
        if (row.dimensionValues) {
          result += row.dimensionValues.map(d => d.value).join(", ");
        }
        
        // Add metric values
        result += "\n  Metrics: ";
        if (row.metricValues) {
          result += row.metricValues.map(m => m.value).join(", ");
        }
        
        // Add pivot data if available
        if (row.pivotValueRegions && row.pivotValueRegions.length > 0) {
          result += "\n  Pivot Values:";
          row.pivotValueRegions.forEach((region, regionIndex) => {
            result += `\n    Region ${regionIndex + 1}: `;
            if (region.values) {
              result += region.values.map(v => v.value).join(", ");
            }
          });
        }
      }
      
      return result;
    }

    /**
     * Formats a batch pivot report response into a readable text format
     * @param {Object} data - The batch pivot report response data
     * @returns {string} Formatted batch pivot report text
     */
    export function formatBatchPivotReportResponse(data) {
      if (!data || !data.pivotReports || data.pivotReports.length === 0) {
        return "No data available for these pivot reports.";
      }
      
      // Format each pivot report
      const formattedReports = data.pivotReports.map((report, index) => {
        return `Pivot Report #${index + 1}:\n${formatPivotReportResponse(report)}`;
      });
      
      // Combine all reports
      return formattedReports.join('\n\n' + '-'.repeat(40) + '\n\n');
    }

    /**
     * Formats metadata response into a readable text format
     * @param {Object} data - The metadata response data
     * @returns {string} Formatted metadata text
     */
    export function formatMetadataResponse(data) {
      if (!data) {
        return "No metadata available.";
      }
      
      let result = "Google Analytics Data API Metadata\n\n";
      
      // Add dimension categories
      const dimensionCategories = new Set();
      data.dimensions.forEach(dimension => {
        if (dimension.category) {
          dimensionCategories.add(dimension.category);
        }
      });
      
      result += "Dimension Categories:\n";
      Array.from(dimensionCategories).sort().forEach(category => {
        result += `- ${category}\n`;
      });
      
      // Add metric categories
      const metricCategories = new Set();
      data.metrics.forEach(metric => {
        if (metric.category) {
          metricCategories.add(metric.category);
        }
      });
      
      result += "\nMetric Categories:\n";
      Array.from(metricCategories).sort().forEach(category => {
        result += `- ${category}\n`;
      });
      
      // Add dimension count
      result += `\nTotal Dimensions: ${data.dimensions.length}`;
      
      // Add metric count
      result += `\nTotal Metrics: ${data.metrics.length}`;
      
      // Add sample dimensions
      result += "\n\nSample Dimensions (first 5):\n";
      data.dimensions.slice(0, 5).forEach(dimension => {
        result += `- ${dimension.apiName}: ${dimension.uiName}\n`;
        result += `  Category: ${dimension.category || 'Uncategorized'}\n`;
        if (dimension.description) {
          result += `  Description: ${dimension.description}\n`;
        }
        result += "\n";
      });
      
      // Add sample metrics
      result += "Sample Metrics (first 5):\n";
      data.metrics.slice(0, 5).forEach(metric => {
        result += `- ${metric.apiName}: ${metric.uiName}\n`;
        result += `  Category: ${metric.category || 'Uncategorized'}\n`;
        result += `  Type: ${metric.type || 'Unknown'}\n`;
        if (metric.description) {
          result += `  Description: ${metric.description}\n`;
        }
        result += "\n";
      });
      
      return result;
    }

    /**
     * Formats compatibility check results into a readable text format
     * @param {Array} results - Compatibility check results
     * @returns {string} Formatted compatibility results
     */
    export function formatCompatibilityResults(results) {
      if (!results || results.length === 0) {
        return "No compatibility results available.";
      }
      
      return results.map(result => result.message).join('\n');
    }
