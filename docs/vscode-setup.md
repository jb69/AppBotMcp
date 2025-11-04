# VS Code Development Guide for AppBot MCP Server

This guide covers setting up and developing the AppBot MCP Server in Visual Studio Code.

## Quick Setup

### 1. Open Project

```bash
# Option 1: Open folder
code /path/to/AppBotMcp

# Option 2: Open workspace file (recommended)
code appbot-mcp.code-workspace
```

### 2. Install Dependencies

VS Code will show a notification to install dependencies, or run manually:

```bash
npm install
```

### 3. Build Project

Use VS Code Command Palette (`Cmd+Shift+P`):

- Type "Tasks: Run Task"
- Select "AppBot - Build"

Or use terminal:

```bash
npm run build
```

## Development Workflow

### Available Commands (Command Palette)

Access via `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux):

#### Build & Development

- **Tasks: Run Task → AppBot - Build**: Compile TypeScript
- **Tasks: Run Task → AppBot - Dev**: Development mode with hot reload
- **Tasks: Run Task → AppBot - Clean**: Clean build artifacts

#### Testing

- **Tasks: Run Task → AppBot - Test**: Run Jest test suite
- **Tasks: Run Task → AppBot - Test Watch**: Run tests in watch mode
- **Tasks: Run Task → AppBot MCP - Test Connection**: Test MCP protocol

#### Health & Setup

- **Tasks: Run Task → AppBot - Health Check**: Test API connectivity
- **Tasks: Run Task → AppBot - Setup**: Run automated setup

### Debugging MCP Server

#### Method 1: Use Debug Configuration

1. Set breakpoints in TypeScript files
2. Press `F5` or use "Run and Debug" panel
3. Select "Debug MCP Server (stdio)"
4. Server will start and wait for MCP client connections

#### Method 2: Manual Testing

Test MCP protocol manually:

```bash
# Test tools list
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Test tool call
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "get_app_info", "arguments": {"appId": "test-app"}}}' | node dist/index.js
```

## File Structure

```
.vscode/
├── settings.json           # Editor settings and JSON schemas
├── tasks.json             # Build, test, and development tasks
└── mcp-config.json        # MCP server configuration template

src/
├── index.ts              # Main MCP server implementation
├── appbot-client.ts      # AppBot API client
├── config.ts            # Configuration management
├── logger.ts            # Logging utilities
└── tests/               # Jest test files

examples/
├── README.md            # Usage examples and setup guides
└── claude_desktop_config.json  # Claude Desktop configuration

appbot-mcp.code-workspace  # VS Code workspace configuration
```

## Configuration Files

### `.vscode/settings.json`

- TypeScript import preferences
- Auto-formatting on save
- File exclusions for performance
- JSON schema validation for MCP configs

### `.vscode/tasks.json`

- Pre-configured build and test tasks
- MCP protocol testing task
- Health check and setup tasks

### `.vscode/mcp-config.json`

- Template MCP server configuration
- Shows environment variable setup
- Ready to copy to Claude Desktop

### `appbot-mcp.code-workspace`

- VS Code workspace configuration
- Combines settings, tasks, and debug configs
- Extension recommendations

## Tips & Tricks

### 1. Fast Development Cycle

1. Open integrated terminal (`Ctrl+` `)
2. Run `npm run dev` for hot reload
3. Make changes to TypeScript files
4. Server automatically rebuilds and restarts

### 2. MCP Protocol Testing

Use the "AppBot MCP - Test Connection" task to quickly verify:

- Server starts correctly
- Responds to MCP protocol messages
- Tools are properly registered

### 3. API Debugging

Enable debug logging in `.env`:

```
LOG_LEVEL=debug
```

### 4. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your AppBot API credentials
```

## Integration with Claude Desktop

After development, integrate with Claude Desktop:

1. Build the project: `npm run build`
2. Copy configuration from `.vscode/mcp-config.json`
3. Update paths to absolute paths
4. Add to Claude Desktop configuration file

See `examples/README.md` for complete Claude Desktop setup instructions.

## Troubleshooting

### Common Issues

1. **Build errors**: Check TypeScript version and dependencies
2. **MCP protocol errors**: Verify JSON-RPC message format
3. **API errors**: Check `.env` configuration and API credentials
4. **VS Code IntelliSense issues**: Reload window (`Cmd+R`)

### Debug Logs

Enable verbose logging:

```json
// In .env
LOG_LEVEL=debug

// Or in VS Code task
"env": {
  "LOG_LEVEL": "debug"
}
```
