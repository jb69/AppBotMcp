import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from './config.js';
import { logger } from './logger.js';

export interface AppInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  developer: string;
  version: string;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  price: number;
  currency: string;
  screenshots: string[];
  icon: string;
  releaseDate: string;
  lastUpdated: string;
  size: number;
  platforms: string[];
}

export interface SearchOptions {
  category?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  apps: AppInfo[];
  total: number;
  hasMore: boolean;
}

export interface Review {
  id: string;
  appId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface ReviewOptions {
  limit?: number;
  rating?: number;
  sortBy?: 'date' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}

export interface AnalyticsData {
  appId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    downloads?: number;
    revenue?: number;
    ratings?: {
      average: number;
      total: number;
      distribution: { [key: number]: number };
    };
    users?: {
      active: number;
      new: number;
      retained: number;
    };
    crashes?: number;
    sessions?: {
      total: number;
      average: number;
    };
  };
}

export interface AnalyticsOptions {
  startDate?: string;
  endDate?: string;
  metrics?: string[];
}

export interface ReportOptions {
  reportType: 'summary' | 'detailed' | 'competitive';
  includeReviews?: boolean;
  includeAnalytics?: boolean;
}

export interface AppReport {
  appInfo: AppInfo;
  summary: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  reviews?: {
    recent: Review[];
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
    commonTopics: string[];
  };
  analytics?: AnalyticsData;
  competitive?: {
    competitors: AppInfo[];
    comparison: {
      rating: number;
      downloads: number;
      price: number;
    };
  };
  recommendations: string[];
}

export class AppBotClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;
  private version: string;

  constructor() {
    this.baseUrl = config.appBotApiBaseUrl;
    this.apiKey = config.appBotApiKey;
    this.version = config.appBotApiVersion;

    this.client = axios.create({
      baseURL: `${this.baseUrl}/${this.version}`,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': `${config.serverName}/${config.serverVersion}`,
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Making API request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`API response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          logger.error(`API error: ${error.response.status} ${error.response.statusText}`, error.response.data);
        } else if (error.request) {
          logger.error('Network error:', error.message);
        } else {
          logger.error('Request setup error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async getAppInfo(appId: string): Promise<AppInfo> {
    try {
      const response = await this.client.get<AppInfo>(`/apps/${appId}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get app info for ${appId}:`, error);
      throw new Error(`Failed to get app info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchApps(query: string, options: SearchOptions = {}): Promise<SearchResult> {
    try {
      const params: any = { q: query };
      if (options.category) params.category = options.category;
      if (options.limit) params.limit = options.limit;
      if (options.offset) params.offset = options.offset;

      const response = await this.client.get<SearchResult>('/apps/search', { params });
      return response.data;
    } catch (error) {
      logger.error(`Failed to search apps with query "${query}":`, error);
      throw new Error(`Failed to search apps: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAppReviews(appId: string, options: ReviewOptions = {}): Promise<Review[]> {
    try {
      const params: any = {};
      if (options.limit) params.limit = options.limit;
      if (options.rating) params.rating = options.rating;
      if (options.sortBy) params.sortBy = options.sortBy;
      if (options.sortOrder) params.sortOrder = options.sortOrder;

      const response = await this.client.get<Review[]>(`/apps/${appId}/reviews`, { params });
      return response.data;
    } catch (error) {
      logger.error(`Failed to get reviews for app ${appId}:`, error);
      throw new Error(`Failed to get app reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAppAnalytics(appId: string, options: AnalyticsOptions = {}): Promise<AnalyticsData> {
    try {
      const params: any = {};
      if (options.startDate) params.startDate = options.startDate;
      if (options.endDate) params.endDate = options.endDate;
      if (options.metrics) params.metrics = options.metrics.join(',');

      const response = await this.client.get<AnalyticsData>(`/apps/${appId}/analytics`, { params });
      return response.data;
    } catch (error) {
      logger.error(`Failed to get analytics for app ${appId}:`, error);
      throw new Error(`Failed to get app analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createAppReport(appId: string, options: ReportOptions): Promise<AppReport> {
    try {
      const response = await this.client.post<AppReport>(`/apps/${appId}/report`, options);
      return response.data;
    } catch (error) {
      logger.error(`Failed to create report for app ${appId}:`, error);
      throw new Error(`Failed to create app report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      logger.error('Health check failed:', error);
      return false;
    }
  }
}