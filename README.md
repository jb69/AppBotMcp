# AppBot MCP Server

A Model Context Protocol (MCP) server that provides tools for interacting with AppBot APIs. This server enables AI assistants to retrieve app information, search for apps, get reviews, analyze app data, and generate comprehensive reports.

## Features

- **App Information Retrieval**: Get detailed information about specific apps including metadata, ratings, and statistics
- **App Search**: Search for apps with filters and pagination
- **Review Management**: Retrieve and analyze app reviews with sentiment analysis
- **Analytics Integration**: Access app performance metrics and analytics data
- **Report Generation**: Create comprehensive reports with competitive analysis

## Available Tools

### `get_app_info`
Retrieves detailed information about a specific app.

**Parameters:**
- `appId` (string, required): The unique identifier of the app

### `search_apps`
Searches for apps based on query and optional filters.

**Parameters:**
- `query` (string, required): Search query for apps
- `category` (string, optional): Category filter
- `limit` (number, optional): Maximum results to return (default: 10)

### `get_app_reviews`
Gets reviews for a specific app with optional filtering.

**Parameters:**
- `appId` (string, required): The unique identifier of the app
- `limit` (number, optional): Maximum reviews to return (default: 10)
- `rating` (number, optional): Filter by rating (1-5 stars)

### `get_app_analytics`
Retrieves analytics data for a specific app.

**Parameters:**
- `appId` (string, required): The unique identifier of the app
- `startDate` (string, optional): Start date for analytics (YYYY-MM-DD)
- `endDate` (string, optional): End date for analytics (YYYY-MM-DD)
- `metrics` (array, optional): Specific metrics to retrieve

### `create_app_report`
Creates a comprehensive report for an app.

**Parameters:**
- `appId` (string, required): The unique identifier of the app
- `reportType` (string, required): Type of report ('summary', 'detailed', 'competitive')
- `includeReviews` (boolean, optional): Include reviews in report (default: true)
- `includeAnalytics` (boolean, optional): Include analytics in report (default: true)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AppBotMcp
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` with your AppBot API credentials:
```
APPBOT_API_BASE_URL=https://api.appbot.com
APPBOT_API_KEY=your_api_key_here
APPBOT_API_VERSION=v1
```

## Development

### VS Code Setup (Recommended)
For the best development experience, see the [VS Code Setup Guide](docs/vscode-setup.md).

Quick start:
```bash
# Open in VS Code
code appbot-mcp.code-workspace

# Or open folder
code /path/to/AppBotMcp
```

Use VS Code Command Palette (`Cmd+Shift+P`) for tasks like "AppBot - Build", "AppBot - Dev", etc.

### Command Line Development

#### Build the project:
```bash
npm run build
```

#### Run in development mode:
```bash
npm run dev
```

#### Run with watch mode:
```bash
npm run watch
```

#### Run tests:
```bash
npm test
```

## Configuration

The server can be configured using environment variables:

- `APPBOT_API_BASE_URL`: Base URL for AppBot API
- `APPBOT_API_KEY`: API key for authentication
- `APPBOT_API_VERSION`: API version to use (default: v1)
- `MCP_SERVER_NAME`: Name of the MCP server
- `MCP_SERVER_VERSION`: Version of the MCP server
- `RATE_LIMIT_REQUESTS_PER_MINUTE`: Rate limiting (default: 60)
- `LOG_LEVEL`: Logging level (error, warn, info, debug)

## Usage with MCP Clients

This server implements the Model Context Protocol and can be used with any MCP-compatible client. The server communicates via stdio transport.

### VS Code Development Setup

#### 1. Open in VS Code
```bash
code /path/to/AppBotMcp
```

#### 2. Install Recommended Extensions
VS Code will prompt to install recommended extensions, or install manually:
- TypeScript and JavaScript Language Features
- Prettier - Code formatter
- JSON Language Features

#### 3. Development Tasks
Use `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) to access VS Code tasks:

- **AppBot - Build**: Compile TypeScript to JavaScript
- **AppBot - Dev**: Run in development mode with hot reload
- **AppBot - Test**: Run the test suite
- **AppBot - Test Watch**: Run tests in watch mode
- **AppBot - Health Check**: Test API connectivity
- **AppBot MCP - Test Connection**: Test MCP protocol communication

#### 4. Configuration Files
The project includes VS Code configuration:
- `.vscode/settings.json`: Editor and TypeScript settings
- `.vscode/tasks.json`: Build and test tasks
- `.vscode/mcp-config.json`: MCP server configuration template

#### 5. Testing the MCP Server
Run the MCP test task to verify the server responds to protocol messages:
```bash
# Via VS Code Command Palette
Tasks: Run Task → AppBot MCP - Test Connection

# Or directly in terminal
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

### Claude Desktop Integration

#### macOS Configuration
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

#### Windows Configuration  
Location: `%APPDATA%/Claude/claude_desktop_config.json`

#### Configuration Content
```json
{
  "mcpServers": {
    "appbot": {
      "command": "node",
      "args": ["/absolute/path/to/AppBotMcp/dist/index.js"],
      "env": {
        "APPBOT_API_KEY": "your_api_key_here",
        "APPBOT_API_BASE_URL": "https://api.appbot.com"
      }
    }
  }
}
```

### Other MCP Clients

The server can be used with any MCP client that supports stdio transport. Refer to your client's documentation for integration instructions.

## API Requirements

This server requires access to AppBot APIs with the following endpoints:

- `GET /apps/{id}` - Get app information
- `GET /apps/search` - Search apps
- `GET /apps/{id}/reviews` - Get app reviews
- `GET /apps/{id}/analytics` - Get app analytics
- `POST /apps/{id}/report` - Create app report
- `GET /health` - Health check

## Error Handling

The server includes comprehensive error handling and logging. All API errors are logged and appropriate error responses are returned to the MCP client.

## Rate Limiting

The client includes automatic rate limiting to respect API quotas. The default rate limit is 60 requests per minute and can be configured via environment variables.

## License

MIT

## Support

For issues and questions, please refer to the repository's issue tracker.