# AppBot MCP Server Examples

This directory contains examples of how to use the AppBot MCP Server with various MCP clients and development environments.

## VS Code Development

### Quick Start

1. Open the project in VS Code: `code /path/to/AppBotMcp`
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Use VS Code tasks for development (accessible via `Cmd+Shift+P` → "Tasks: Run Task")

### Available VS Code Tasks

- **AppBot - Build**: Compile TypeScript (`npm run build`)
- **AppBot - Dev**: Development mode with hot reload (`npm run dev`)
- **AppBot - Test**: Run test suite (`npm test`)
- **AppBot - Test Watch**: Run tests in watch mode
- **AppBot - Health Check**: Test AppBot API connectivity
- **AppBot MCP - Test Connection**: Test MCP protocol communication
- **AppBot - Setup**: Run automated setup script
- **AppBot - Clean**: Clean build artifacts

### Testing MCP Protocol

Test the server responds to MCP protocol messages:

```bash
# Test tools/list method
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Test with specific tool call
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "get_app_info", "arguments": {"appId": "com.example.app"}}}' | node dist/index.js
```

### VS Code Configuration Files

The project includes optimized VS Code settings:

- `.vscode/settings.json`: TypeScript, formatting, and file associations
- `.vscode/tasks.json`: Build, test, and development tasks
- `.vscode/mcp-config.json`: MCP server configuration template

## Claude Desktop Configuration

### Configuration File Locations

#### macOS

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Windows

```
%APPDATA%/Claude/claude_desktop_config.json
```

#### Linux

```
~/.config/claude/claude_desktop_config.json
```

### Configuration Content

Copy the content from `claude_desktop_config.json` in this directory, or use this template:

```json
{
  "mcpServers": {
    "appbot": {
      "command": "node",
      "args": ["/absolute/path/to/AppBotMcp/dist/index.js"],
      "env": {
        "APPBOT_API_KEY": "your_actual_api_key_here",
        "APPBOT_API_BASE_URL": "https://api.appbot.com",
        "APPBOT_API_VERSION": "v1",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/AppBotMcp` with the actual absolute path to your project directory.

## Example Queries

Once configured, you can ask Claude to:

### Get App Information

"Get information about the app with ID 'com.example.myapp'"

### Search for Apps

"Search for productivity apps in the AppBot database"

### Get App Reviews

"Get the latest 5 reviews for app 'com.example.myapp' with 4+ star ratings"

### Get Analytics

"Get analytics data for app 'com.example.myapp' for the last 30 days including downloads and revenue metrics"

### Create Reports

"Create a detailed competitive report for app 'com.example.myapp' including reviews and analytics"

## Testing the Connection

You can test the MCP server directly using stdio:

```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

This should return a list of available tools if the server is working correctly.

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Make sure you've run `npm install` and `npm run build`
2. **API authentication errors**: Check your `APPBOT_API_KEY` in the environment variables
3. **Connection timeouts**: Verify your `APPBOT_API_BASE_URL` is correct and accessible

### Debugging

Enable debug logging by setting the environment variable:

```bash
LOG_LEVEL=debug
```

This will provide detailed information about API requests and responses.
