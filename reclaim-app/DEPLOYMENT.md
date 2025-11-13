# Netlify Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Set these in Netlify Dashboard → Site Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### 2. Supabase Configuration
- Ensure your Supabase project is set up
- Add your Netlify domain to Supabase Auth → URL Configuration → Site URL
- Add your Netlify domain to Supabase Auth → URL Configuration → Redirect URLs

### 3. Build Settings in Netlify
- **Base directory**: `reclaim-app`
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20

## Deployment Steps

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy to production:
```bash
cd reclaim-app
netlify deploy --prod
```

### Option 2: Deploy via Git

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository in Netlify Dashboard
3. Configure build settings (see above)
4. Deploy!

## Post-Deployment

### 1. Test Critical Features
- [ ] User authentication (sign up, login, logout)
- [ ] AI Coach functionality
- [ ] Journal entries
- [ ] All dashboard pages load correctly
- [ ] Mobile responsiveness

### 2. Configure Custom Domain (Optional)
- Add your custom domain in Netlify Dashboard
- Update NEXT_PUBLIC_APP_URL environment variable
- Update Supabase Auth URLs

### 3. Enable HTTPS
- Netlify automatically provisions SSL certificates
- Ensure "Force HTTPS" is enabled in Domain Settings

## Troubleshooting

### Build Fails
- Check build logs in Netlify Dashboard
- Verify all environment variables are set
- Ensure Node version is 20

### API Routes Not Working
- Verify Supabase credentials are correct
- Check Netlify Functions logs
- Ensure CORS is configured in Supabase

### Authentication Issues
- Verify redirect URLs in Supabase match your Netlify domain
- Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set

## Performance Optimization

The following are already configured:
- ✅ Image optimization
- ✅ Compression enabled
- ✅ React strict mode
- ✅ Security headers
- ✅ Standalone output for faster cold starts

## Monitoring

- Monitor build times in Netlify Dashboard
- Check Analytics for traffic patterns
- Review Function logs for API errors
- Set up Supabase monitoring for database performance
