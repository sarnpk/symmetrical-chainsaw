#!/bin/bash

# Deployment script for Netlify
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the reclaim-app directory?"
    exit 1
fi

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Make sure environment variables are set in Netlify."
fi

# Run build locally to check for errors
echo "🔨 Running build check..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to production
echo "🌐 Deploying to Netlify production..."
netlify deploy --prod

echo "✨ Deployment complete!"
echo "📊 Check your site at: https://app.netlify.com"
