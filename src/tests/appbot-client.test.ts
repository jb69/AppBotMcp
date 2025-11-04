import { AppBotClient } from '../appbot-client.js';

// Mock configuration for testing
jest.mock('../config.js', () => ({
  config: {
    appBotApiBaseUrl: 'https://api.test.com',
    appBotApiKey: 'test-key',
    appBotApiVersion: 'v1',
    serverName: 'test-server',
    serverVersion: '1.0.0',
  }
}));

// Mock axios
jest.mock('axios');

describe('AppBotClient', () => {
  let client: AppBotClient;

  beforeEach(() => {
    client = new AppBotClient();
  });

  describe('getAppInfo', () => {
    it('should return app information for valid app ID', async () => {
      const mockAppInfo = {
        id: 'test-app',
        name: 'Test App',
        description: 'A test app',
        category: 'Productivity',
        developer: 'Test Developer',
        version: '1.0.0',
        rating: 4.5,
        reviewCount: 100,
        downloadCount: 1000,
        price: 0,
        currency: 'USD',
        screenshots: [],
        icon: 'https://example.com/icon.png',
        releaseDate: '2024-01-01',
        lastUpdated: '2024-01-01',
        size: 50000000,
        platforms: ['iOS', 'Android']
      };

      // Mock axios response
      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockAppInfo }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      });

      client = new AppBotClient();
      const result = await client.getAppInfo('test-app');
      
      expect(result).toEqual(mockAppInfo);
    });

    it('should throw error for invalid app ID', async () => {
      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('App not found')),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      });

      client = new AppBotClient();
      
      await expect(client.getAppInfo('invalid-app')).rejects.toThrow('Failed to get app info');
    });
  });

  describe('searchApps', () => {
    it('should return search results', async () => {
      const mockSearchResult = {
        apps: [
          {
            id: 'app1',
            name: 'App 1',
            description: 'First app',
            category: 'Games',
            developer: 'Dev 1',
            version: '1.0.0',
            rating: 4.0,
            reviewCount: 50,
            downloadCount: 500,
            price: 0,
            currency: 'USD',
            screenshots: [],
            icon: 'https://example.com/icon1.png',
            releaseDate: '2024-01-01',
            lastUpdated: '2024-01-01',
            size: 30000000,
            platforms: ['iOS']
          }
        ],
        total: 1,
        hasMore: false
      };

      const mockAxios = require('axios');
      mockAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockSearchResult }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      });

      client = new AppBotClient();
      const result = await client.searchApps('game');
      
      expect(result).toEqual(mockSearchResult);
    });
  });
});