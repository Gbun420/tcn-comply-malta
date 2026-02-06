#!/bin/bash

echo "🚀 Deploying TCN Comply Malta Development Version"

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --force

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

# Build project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel development environment..."
npx vercel --prod --yes

if [ $? -eq 0 ]; then
    echo "✅ Development deployment successful!"
    echo "📧 Contact: bundyglenn@gmail.com"
else
    echo "❌ Deployment failed"
    exit 1
fi
