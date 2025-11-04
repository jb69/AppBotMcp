#!/usr/bin/env node

import { AppBotClient } from '../src/appbot-client.js';
import { logger } from '../src/logger.js';

async function healthCheck() {
  try {
    logger.info('Starting AppBot MCP Server health check...');
    
    const client = new AppBotClient();
    const isHealthy = await client.healthCheck();
    
    if (isHealthy) {
      logger.info('✅ AppBot API connection is healthy');
      process.exit(0);
    } else {
      logger.error('❌ AppBot API connection failed');
      process.exit(1);
    }
  } catch (error) {
    logger.error('❌ Health check failed:', error);
    process.exit(1);
  }
}

healthCheck();