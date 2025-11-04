import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // AppBot API Configuration
  appBotApiBaseUrl: process.env.APPBOT_API_BASE_URL || 'https://api.appbot.example.com',
  appBotApiKey: process.env.APPBOT_API_KEY || '',
  appBotApiVersion: process.env.APPBOT_API_VERSION || 'v1',
  
  // Server Configuration
  serverName: process.env.MCP_SERVER_NAME || 'appbot-mcp-server',
  serverVersion: process.env.MCP_SERVER_VERSION || '1.0.0',
  
  // Rate limiting
  rateLimitRequestsPerMinute: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '60', 10),
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required configuration
if (!config.appBotApiKey) {
  throw new Error('APPBOT_API_KEY environment variable is required');
}

if (!config.appBotApiBaseUrl) {
  throw new Error('APPBOT_API_BASE_URL environment variable is required');
}