# Crisis Toolkit - Quick Setup Guide

## 🎯 Tier Access

**Foundation (Free):** 10 uses/month, basic skills
**Healing:** 30 uses/month, basic skills  
**Recovery:** Unlimited + AI skill recommendations ✨

## ✅ Setup Steps

### 1. Apply Database Migration

**Option A: Using Supabase CLI**
```bash
cd reclaim-app
supabase db push
```

**Option B: Manual SQL Execution**
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of: `supabase/migrations/20250907_crisis_toolkit.sql`
4. Click "Run"

### 2. Verify Tables Created

Run this query in Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('crisis_toolkit_logs', 'user_favorite_interventions');
```

You should see both tables listed.

### 3. Test the Feature

1. Start your dev server: `npm run dev`
2. Look for the 🆘 button in the bottom-right corner
3. Click it and select a condition
4. Complete a session
5. Check that data is saved in Supabase

### 4. Add to Dashboard (Optional)

In your dashboard component:
```tsx
import CrisisToolkitCard from '@/components/CrisisToolkitCard';

// Add to your dashboard grid:
<CrisisToolkitCard />
```

## 📁 Files Created

### Database
- `supabase/migrations/20250907_crisis_toolkit.sql` - Database schema

### Backend
- `src/lib/crisis-toolkit-data.ts` - Static intervention data
- `src/app/api/crisis-toolkit/log/route.ts` - Usage logging
- `src/app/api/crisis-toolkit/personalize/route.ts` - AI personalization
- `src/app/api/crisis-toolkit/stats/route.ts` - Statistics

### Frontend
- `src/app/crisis-toolkit/page.tsx` - Main toolkit page
- `src/app/crisis-toolkit/help/page.tsx` - Help page
- `src/components/CrisisToolkitWidget.tsx` - Floating button
- `src/components/CrisisToolkitCard.tsx` - Dashboard card

### Documentation
- `public/docs/CRISIS_TOOLKIT_GUIDE.html` - User guide
- `CRISIS_TOOLKIT_IMPLEMENTATION.md` - Technical docs
- `CRISIS_TOOLKIT_SETUP.md` - This file

## ⚠️ Common Issues

### "Syntax error at or near //"
**Problem:** You're trying to run a TypeScript file as SQL.

**Solution:** Only run the `.sql` file in Supabase. The `.ts` files are for your Next.js app, not the database.

**Correct file to run:** `supabase/migrations/20250907_crisis_toolkit.sql`
**Don't run:** `src/lib/crisis-toolkit-data.ts` (this is TypeScript, not SQL)

### Widget not showing
**Check:** Is the widget imported in `src/app/layout.tsx`?

### AI personalization not working
**Check:** Is `GEMINI_API_KEY` set in your `.env.local`?

### Stats showing 0
**Check:** Complete at least one toolkit session first.

## 🧪 Testing Checklist

- [ ] Database tables created
- [ ] 🆘 button visible on all pages
- [ ] Can select each condition type
- [ ] Timers work for timed exercises
- [ ] Skills can be marked as used
- [ ] Affirmations display
- [ ] Rating system saves to database
- [ ] Stats update after session
- [ ] Help page loads correctly
- [ ] Mobile responsive

## 🚀 Ready to Deploy

Once tested locally:
```bash
npm run build
# Deploy to your hosting platform
```

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs for API errors
3. Verify the migration ran successfully
4. Ensure all environment variables are set
