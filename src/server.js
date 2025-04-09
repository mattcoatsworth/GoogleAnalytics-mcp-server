import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
    import { analyticsTools } from './tools/index.js';
    import { analyticsResources } from './resources/index.js';

    // Create an MCP server for Google Analytics Data API
    const server = new McpServer({
      name: "Google Analytics Data API",
      version: "1.0.0",
      description: "MCP Server for interacting with Google Analytics Data API v1"
    });

    // Register all tools
    Object.entries(analyticsTools).forEach(([name, tool]) => {
      server.tool(
        name,
        tool.schema,
        tool.handler,
        { description: tool.description }
      );
    });

    // Register all resources
    Object.entries(analyticsResources).forEach(([name, resource]) => {
      server.resource(
        name,
        new ResourceTemplate(resource.template, { list: resource.list }),
        resource.handler
      );
    });

    export { server };
