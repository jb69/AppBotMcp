#!/bin/bash

# AppBot MCP Server Setup Script

echo "🚀 Setting up AppBot MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your AppBot API credentials."
    echo ""
    echo "Required environment variables:"
    echo "  - APPBOT_API_BASE_URL: Your AppBot API base URL"
    echo "  - APPBOT_API_KEY: Your AppBot API key"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed, but setup is complete"
else
    echo "✅ All tests passed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your AppBot API credentials"
echo "  2. Start development server: npm run dev"
echo "  3. Or build and run: npm run build && npm start"
echo ""
echo "For Claude Desktop integration, add this to your configuration:"
echo '{'
echo '  "mcpServers": {'
echo '    "appbot": {'
echo '      "command": "node",'
echo "      \"args\": [\"$(pwd)/dist/index.js\"]"
echo '    }'
echo '  }'
echo '}'