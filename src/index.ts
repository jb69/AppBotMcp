import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { AppBotClient } from './appbot-client.js';
import { config } from './config.js';
import { logger } from './logger.js';

class AppBotMcpServer {
  private server: Server;
  private appBotClient: AppBotClient;

  constructor() {
    this.server = new Server(
      {
        name: config.serverName,
        version: config.serverVersion,
      }
    );

    this.appBotClient = new AppBotClient();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_app_info',
            description: 'Get information about a specific app from AppBot',
            inputSchema: {
              type: 'object',
              properties: {
                appId: {
                  type: 'string',
                  description: 'The unique identifier of the app',
                },
              },
              required: ['appId'],
            },
          },
          {
            name: 'search_apps',
            description: 'Search for apps in AppBot',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for apps',
                },
                category: {
                  type: 'string',
                  description: 'Optional category filter',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 10)',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_app_reviews',
            description: 'Get reviews for a specific app',
            inputSchema: {
              type: 'object',
              properties: {
                appId: {
                  type: 'string',
                  description: 'The unique identifier of the app',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of reviews to return (default: 10)',
                  default: 10,
                },
                rating: {
                  type: 'number',
                  description: 'Filter by rating (1-5 stars)',
                  minimum: 1,
                  maximum: 5,
                },
              },
              required: ['appId'],
            },
          },
          {
            name: 'get_app_analytics',
            description: 'Get analytics data for a specific app',
            inputSchema: {
              type: 'object',
              properties: {
                appId: {
                  type: 'string',
                  description: 'The unique identifier of the app',
                },
                startDate: {
                  type: 'string',
                  description: 'Start date for analytics (YYYY-MM-DD)',
                },
                endDate: {
                  type: 'string',
                  description: 'End date for analytics (YYYY-MM-DD)',
                },
                metrics: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  description: 'Specific metrics to retrieve (downloads, revenue, ratings, etc.)',
                },
              },
              required: ['appId'],
            },
          },
          {
            name: 'create_app_report',
            description: 'Create a comprehensive report for an app',
            inputSchema: {
              type: 'object',
              properties: {
                appId: {
                  type: 'string',
                  description: 'The unique identifier of the app',
                },
                reportType: {
                  type: 'string',
                  enum: ['summary', 'detailed', 'competitive'],
                  description: 'Type of report to generate',
                },
                includeReviews: {
                  type: 'boolean',
                  description: 'Whether to include reviews in the report',
                  default: true,
                },
                includeAnalytics: {
                  type: 'boolean',
                  description: 'Whether to include analytics in the report',
                  default: true,
                },
              },
              required: ['appId', 'reportType'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_app_info':
            return await this.handleGetAppInfo(args);
          case 'search_apps':
            return await this.handleSearchApps(args);
          case 'get_app_reviews':
            return await this.handleGetAppReviews(args);
          case 'get_app_analytics':
            return await this.handleGetAppAnalytics(args);
          case 'create_app_report':
            return await this.handleCreateAppReport(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        logger.error(`Error executing tool ${name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to execute tool: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  private async handleGetAppInfo(args: any) {
    const { appId } = args;
    const appInfo = await this.appBotClient.getAppInfo(appId);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(appInfo, null, 2),
        },
      ],
    };
  }

  private async handleSearchApps(args: any) {
    const { query, category, limit = 10 } = args;
    const searchResults = await this.appBotClient.searchApps(query, { category, limit });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(searchResults, null, 2),
        },
      ],
    };
  }

  private async handleGetAppReviews(args: any) {
    const { appId, limit = 10, rating } = args;
    const reviews = await this.appBotClient.getAppReviews(appId, { limit, rating });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(reviews, null, 2),
        },
      ],
    };
  }

  private async handleGetAppAnalytics(args: any) {
    const { appId, startDate, endDate, metrics } = args;
    const analytics = await this.appBotClient.getAppAnalytics(appId, {
      startDate,
      endDate,
      metrics,
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analytics, null, 2),
        },
      ],
    };
  }

  private async handleCreateAppReport(args: any) {
    const { appId, reportType, includeReviews = true, includeAnalytics = true } = args;
    const report = await this.appBotClient.createAppReport(appId, {
      reportType,
      includeReviews,
      includeAnalytics,
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(report, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info(`AppBot MCP Server running on stdio`);
  }
}

async function main() {
  const server = new AppBotMcpServer();
  await server.run();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}