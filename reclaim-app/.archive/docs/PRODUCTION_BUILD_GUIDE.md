# Production Build Guide

## Quick Start - Build for Production

### Step 1: Prepare Environment Variables

Create or update `.env.production.local` in the `reclaim-app` directory with all required variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<from .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from .env.local>
SUPABASE_SERVICE_ROLE_KEY=<from .env.local>

# Google AI (for Narcissist Detector)
GOOGLE_AI_API_KEY=<from .env.local>

# Other APIs
GLADIA_API_KEY=<from .env.local>
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### Step 2: Build Locally (Recommended Before Deploying)

```bash
cd reclaim-app
npm install
npm run build
```

This will:
- Install all dependencies
- Compile TypeScript
- Optimize assets
- Generate `.next` folder (production build)

### Step 3: Test Production Build Locally

```bash
npm run start
```

Visit `http://localhost:3000` and test:
- Login/signup
- Narcissist Detector (all 4 tabs)
- AI Coach
- Journal entries
- Dashboard pages

### Step 4: Deploy to Netlify

#### Option A: Using Netlify CLI (Fastest)

```bash
npm install -g netlify-cli
netlify login
cd reclaim-app
netlify deploy --prod
```

#### Option B: Using Git Push (Recommended for Teams)

1. Push to your Git repository:
```bash
git add .
git commit -m "Production build"
git push origin main
```

2. Netlify will automatically build and deploy (if connected)

#### Option C: Manual Upload via Netlify Dashboard

1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `reclaim-app/.next` folder
4. Set environment variables in Site Settings

## Environment Variables for Netlify

In Netlify Dashboard → Site Settings → Build & Deploy → Environment:

```
NEXT_PUBLIC_SUPABASE_URL=<from .env.local>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from .env.local>
SUPABASE_SERVICE_ROLE_KEY=<from .env.local>
GOOGLE_AI_API_KEY=<from .env.local>
GLADIA_API_KEY=<from .env.local>
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://your-domain.netlify.app
```

## Netlify Build Configuration

In Netlify Dashboard → Site Settings → Build & Deploy:

- **Base directory**: `reclaim-app`
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20.x (set in `.nvmrc` or environment)

Or create `netlify.toml` in root:

```toml
[build]
  base = "reclaim-app"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Pre-Deployment Checklist

- [ ] All environment variables set in `.env.production.local`
- [ ] `npm run build` completes without errors
- [ ] `npm run start` works locally
- [ ] Tested all major features locally
- [ ] Supabase Auth URLs updated with production domain
- [ ] GOOGLE_AI_API_KEY is valid and has quota
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive design tested
- [ ] All API routes respond correctly

## Post-Deployment Verification

After deploying to production:

1. **Check Site Health**
   - Visit your production URL
   - Check browser console for errors
   - Test login/signup flow

2. **Test Narcissist Detector**
   - Select traits and analyze
   - Paste a message and analyze
   - Paste a conversation and analyze
   - Verify results display correctly

3. **Monitor Netlify Logs**
   - Go to Netlify Dashboard → Deploys
   - Check build logs for warnings
   - Monitor Function logs for API errors

4. **Test API Endpoints**
   - Open DevTools → Network tab
   - Trigger API calls
   - Verify responses are successful (200 status)
   - Check for 500 errors

## Troubleshooting Production Issues

### 500 Errors on API Calls

**Check:**
1. Environment variables are set in Netlify
2. GOOGLE_AI_API_KEY is valid
3. Supabase credentials are correct
4. API route code has no syntax errors

**Debug:**
```bash
# View Netlify function logs
netlify logs --function=narcissist-detector/trait-checklist
```

### Build Fails

**Common causes:**
- Missing environment variables
- TypeScript errors
- Missing dependencies
- Node version mismatch

**Fix:**
```bash
# Clear cache and rebuild
rm -rf node_modules .next
npm install
npm run build
```

### Authentication Issues

**Check:**
1. Supabase Auth URLs include production domain
2. NEXT_PUBLIC_SUPABASE_URL is correct
3. NEXT_PUBLIC_SUPABASE_ANON_KEY is valid
4. Redirect URLs in Supabase match your domain

## Performance Tips

1. **Enable Caching**
   - Netlify automatically caches static assets
   - Set cache headers in `next.config.ts`

2. **Monitor Build Size**
   ```bash
   npm run build
   # Check .next folder size
   ```

3. **Optimize Images**
   - Already configured with Next.js Image component
   - Verify images load quickly in production

4. **Monitor API Performance**
   - Check Netlify Function execution time
   - Optimize Google AI prompts if slow

## Rollback Procedure

If something goes wrong:

1. **Via Netlify Dashboard**
   - Go to Deploys
   - Click on previous successful deploy
   - Click "Publish deploy"

2. **Via Git**
   - Revert commit: `git revert HEAD`
   - Push: `git push origin main`
   - Netlify will auto-deploy

## Continuous Deployment

For automatic deployments on every push:

1. Connect GitHub/GitLab to Netlify
2. Set build settings (see above)
3. Every push to `main` branch auto-deploys
4. Set up branch previews for testing

## Support

For issues:
- Check Netlify build logs
- Review browser console errors
- Check Supabase dashboard for database issues
- Verify all API keys are valid and have quota
