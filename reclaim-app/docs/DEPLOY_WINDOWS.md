# Windows Deployment Guide for Netlify

## Step 1: Install Netlify CLI

Open Command Prompt or PowerShell and run:

```cmd
npm install -g netlify-cli
```

## Step 2: Login to Netlify

```cmd
netlify login
```

This will open your browser to authenticate with Netlify.

## Step 3: Navigate to Your Project

```cmd
cd path\to\reclaim-app
```

## Step 4: Set Environment Variables in Netlify

Before deploying, you need to set your environment variables in Netlify:

### Option A: Via Netlify Dashboard (Recommended)
1. Go to https://app.netlify.com
2. Select your site (or create a new one)
3. Go to **Site settings** → **Environment variables**
4. Add these variables from your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=<from .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from .env.local>
SUPABASE_SERVICE_ROLE_KEY=<from .env.local>
GOOGLE_AI_API_KEY=<from .env.local>
GLADIA_API_KEY=<from .env.local>
NEXT_PUBLIC_V3_MOBILE=0
```

### Option B: Via CLI
```cmd
netlify env:set NEXT_PUBLIC_SUPABASE_URL "<value from .env.local>"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "<value from .env.local>"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "<value from .env.local>"
netlify env:set GOOGLE_AI_API_KEY "<value from .env.local>"
netlify env:set GLADIA_API_KEY "<value from .env.local>"
netlify env:set NEXT_PUBLIC_V3_MOBILE "0"
```

## Step 5: Deploy!

### Option A: Deploy from Git (Recommended)
1. Push your code to GitHub
2. In Netlify dashboard, link your repo
3. Set build settings:
   - Base directory: `reclaim-app`
   - Build command: `npm install && npm run build`
   - Publish directory: `.next`
4. Set environment variables (see Step 4)
5. Deploy!

### Option B: Manual Deploy
```cmd
netlify deploy --prod
```

## Step 6: Verify Deployment

1. Visit your Netlify URL
2. Check that all pages load correctly
3. Test the checkout flow
4. Verify environment variables are working

## Troubleshooting

### Build Fails
- Ensure Node.js 18+ is installed
- Check that all environment variables are set in Netlify
- Verify the build command works locally: `npm install && npm run build`

### Pages Not Loading
- Check the Netlify function logs
- Verify the publish directory is correct (`.next`)
- Ensure the `@netlify/plugin-nextjs` plugin is active

### API Routes Not Working
- Check that environment variables are set in Netlify
- Verify the API routes are properly configured
- Check Netlify function logs for errors
