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
3. Go to **Site settings** â†’ **Environment variables**
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://gstiokcvqmxiaqzmtzmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGlva2N2cW14aWFxem10em12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODQ0ODYsImV4cCI6MjA3MDk2MDQ4Nn0.HuQueaqGWoU6Hn6Z51HUDspMOZek85aRWgZXxKfPSrM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGlva2N2cW14aWFxem10em12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4NDQ4NiwiZXhwIjoyMDcwOTYwNDg2fQ.pE3OAwQKCZjg8PGpLBPCeZpJC2kXC-du2XSGOa8CJ48
GOOGLE_AI_API_KEY=AIzaSyCuX8ubTgKKPer_PnJe1lUul3VTZRTaUsk
GLADIA_API_KEY=e913013e-ef90-4165-8e87-d944e4740c1f
NEXT_PUBLIC_V3_MOBILE=0
```

### Option B: Via CLI
```cmd
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://gstiokcvqmxiaqzmtzmv.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGlva2N2cW14aWFxem10em12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODQ0ODYsImV4cCI6MjA3MDk2MDQ4Nn0.HuQueaqGWoU6Hn6Z51HUDspMOZek85aRWgZXxKfPSrM"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdGlva2N2cW14aWFxem10em12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4NDQ4NiwiZXhwIjoyMDcwOTYwNDg2fQ.pE3OAwQKCZjg8PGpLBPCeZpJC2kXC-du2XSGOa8CJ48"
netlify env:set GOOGLE_AI_API_KEY "AIzaSyCuX8ubTgKKPer_PnJe1lUul3VTZRTaUsk"
netlify env:set GLADIA_API_KEY "e913013e-ef90-4165-8e87-d944e4740c1f"
netlify env:set NEXT_PUBLIC_V3_MOBILE "0"
```

## Step 5: Deploy!

### Method 1: Using the Batch Script (Easiest)
```cmd
deploy.bat
```

### Method 2: Manual Commands

1. **Test build locally first:**
```cmd
npm run build
```

2. **If build succeeds, deploy to production:**
```cmd
netlify deploy --prod
```

3. **Follow the prompts:**
   - Select "Create & configure a new site" (first time) or choose existing site
   - Choose your team
   - Enter site name (or leave blank for random name)
   - Confirm the publish directory: `.next`

## Step 6: Update Supabase Settings

After deployment, you'll get a Netlify URL like: `https://your-site.netlify.app`

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** â†’ **URL Configuration**
4. Add your Netlify URL to:
   - **Site URL**: `https://your-site.netlify.app`
   - **Redirect URLs**: Add `https://your-site.netlify.app/**`

## Troubleshooting

### Build Fails
```cmd
# Clear cache and rebuild
rmdir /s /q .next
rmdir /s /q node_modules
npm install
npm run build
```

### "netlify: command not found"
```cmd
# Reinstall Netlify CLI
npm uninstall -g netlify-cli
npm install -g netlify-cli
```

### Environment Variables Not Working
- Make sure you set them in Netlify Dashboard
- Redeploy after setting variables
- Check variable names match exactly (case-sensitive)

## Quick Commands Reference

```cmd
# Login to Netlify
netlify login

# Check current site status
netlify status

# View environment variables
netlify env:list

# Deploy to production
netlify deploy --prod

# Open site in browser
netlify open:site

# View deployment logs
netlify logs
```

## Next Steps After Deployment

1. âœ… Test your live site
2. âœ… Set up custom domain (optional)
3. âœ… Enable automatic deployments from Git
4. âœ… Set up monitoring and alerts
