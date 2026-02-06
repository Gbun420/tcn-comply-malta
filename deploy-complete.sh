#!/bin/bash

echo "🚀 Deploying Complete TCN Comply Malta Implementation"

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi

echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "🌐 Deploying to Vercel..."
npx vercel --prod --yes

if [ $? -eq 0 ]; then
    echo "✅ Complete deployment successful!"
    echo "🎉 TCN Comply Malta is now live with full features!"
    echo "📧 Contact: bundyglenn@gmail.com"
else
    echo "❌ Deployment failed"
    exit 1
fi
