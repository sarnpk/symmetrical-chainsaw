# 🚀 Quick Start Guide - Reclaim App

## Start Development Server

```bash
cd reclaim-app
npm run dev
```

Visit: `http://localhost:3000`

## Test the Fixes

### 1. Test Auth Flow
1. Go to `http://localhost:3000`
2. Click "Get Started" button
3. Should go to `/auth` page (not modal)
4. Fill in email/password
5. Click "Create Account"
6. Check email for confirmation

### 2. Test Free Tools
1. Go to `http://localhost:3000/free-narcissist-test`
2. Answer 10 questions
3. Get instant results (no AI delay)
4. Check header has "Free Tools" dropdown
5. Check footer has all links

### 3. Test Mobile Menu
1. Resize browser to mobile width
2. Click hamburger menu (☰)
3. Menu should open with all links
4. Click any link - should navigate

### 4. Test Navigation
1. Click "Free Tools" dropdown
2. Should see 3 tools listed
3. Click each tool - should navigate
4. Check header is same on all pages

## Environment Variables Needed

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_AI_API_KEY=your_google_ai_key (optional now)
RESEND_API_KEY=your_resend_key (for emails)
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX (optional)
```

## Key Files Modified

### New Components
- `src/components/UnifiedHeader.tsx` - Main header
- `src/components/UnifiedFooter.tsx` - Main footer
- `src/components/FreeToolsMenu.tsx` - Tools dropdown
- `src/components/SignInButton.tsx` - Auth link
- `src/components/GoogleAnalytics.tsx` - GA tracking

### Fixed Pages
- `src/app/auth/page.tsx` - Now shows form
- `src/app/free-narcissist-test/page.tsx` - Question-based
- `src/app/gaslighting-reality-check/page.tsx` - Updated header
- `src/app/discard-stage-test/page.tsx` - Question-based
- `src/app/pricing/page.tsx` - Updated header

## Common Issues & Fixes

### Issue: "Module not found"
```bash
npm install
```

### Issue: Supabase errors
Check `.env.local` has correct keys

### Issue: Auth not working
1. Check Supabase project is active
2. Check email confirmation is enabled
3. Check redirect URLs in Supabase dashboard

### Issue: Styles not loading
```bash
npm run dev
# Hard refresh browser (Ctrl+Shift+R)
```

## Deploy to Netlify

1. Push code to GitHub
2. Connect repo to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

Build command: `npm run build`
Publish directory: `.next`

## Enable Google Analytics

1. Get GA4 Measurement ID from analytics.google.com
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Restart dev server
4. GA will auto-load on all pages

## Enable Email Sending

1. Sign up for Resend.com
2. Get API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxx
   ```
4. Follow `EMAIL_INTEGRATION_GUIDE.md`

## Stripe Webhook Setup

1. Go to dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select "All events"
4. Copy signing secret
5. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

## File Structure

```
reclaim-app/
├── src/
│   ├── app/
│   │   ├── page.tsx (landing)
│   │   ├── auth/page.tsx (signup/login)
│   │   ├── pricing/page.tsx
│   │   ├── free-narcissist-test/page.tsx
│   │   ├── gaslighting-reality-check/page.tsx
│   │   └── discard-stage-test/page.tsx
│   ├── components/
│   │   ├── UnifiedHeader.tsx ⭐ NEW
│   │   ├── UnifiedFooter.tsx ⭐ NEW
│   │   ├── FreeToolsMenu.tsx ⭐ NEW
│   │   ├── SignInButton.tsx ⭐ NEW
│   │   └── GoogleAnalytics.tsx ⭐ NEW
│   └── lib/
│       ├── supabase.ts
│       └── stripe.ts
├── .env.local (your secrets)
└── package.json
```

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Install dependencies
npm install

# Add new package
npm install package-name
```

## Support

- Design Review: `DESIGN_REVIEW_AND_FIXES.md`
- Implementation Details: `IMPLEMENTATION_COMPLETE.md`
- Email Setup: `EMAIL_INTEGRATION_GUIDE.md`

## Success Checklist

- [ ] Dev server runs without errors
- [ ] Can sign up new account
- [ ] Can sign in existing account
- [ ] Free tools work instantly
- [ ] Mobile menu works
- [ ] All pages have consistent header/footer
- [ ] Navigation works on all pages
- [ ] Stripe webhook configured
- [ ] Email sending configured (optional)
- [ ] Google Analytics enabled (optional)

**You're ready to launch! 🚀**
