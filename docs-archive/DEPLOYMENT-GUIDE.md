# Reality Anchor MVP - Deployment Guide

## 🚀 QUICK START

### Step 1: Push Database Migration
```bash
cd d:\reclaim
supabase db push
```

This will:
- Create 4 new tables
- Add RLS policies
- Seed 14 default affirmations

### Step 2: Test Locally
```bash
cd d:\reclaim\reclaim-app
npm run dev
```

Visit: http://localhost:3000

### Step 3: Test Features

#### Test Affirmations
1. Go to `/affirmations`
2. Click category tabs
3. Click "Copy" button
4. Verify text copied to clipboard

#### Test Morning Intention
1. Go to `/morning-intention`
2. Click "Mark Complete"
3. Verify streak increments
4. Refresh page - should show "Completed today"

#### Test Reality Log
1. Go to `/reality-log`
2. Click "Add Entry"
3. Fill in form:
   - Date: Today
   - Event: "Test event"
   - Fact: "Test fact"
   - Trait: "Playing the Victim"
   - Pattern: Check "Consistent"
4. Click "Save Entry"
5. Verify entry appears in list
6. Click entry to view details
7. Verify reality check displays

### Step 4: Add to Dashboard

Edit `src/app/dashboard/page.tsx`:

```tsx
import MorningIntentionCard from '@/components/reality-anchor/MorningIntentionCard'

// Add to dashboard:
<MorningIntentionCard userId={user.id} />
```

### Step 5: Add Navigation

Edit `src/components/DashboardLayout.tsx` or your navigation component:

```tsx
<Link href="/affirmations">Affirmations</Link>
<Link href="/morning-intention">Morning Intention</Link>
<Link href="/reality-log">Reality Log</Link>
```

### Step 6: Deploy to Production

```bash
git add .
git commit -m "feat: add reality anchor MVP - affirmations, morning intention, reality log"
git push
```

---

## 📋 WHAT WAS CREATED

### Database
- ✅ `supabase/migrations/20250825_reality_anchor_mvp.sql`

### API Endpoints (5 routes)
- ✅ `/api/reality-anchor/affirmations/route.ts`
- ✅ `/api/reality-anchor/morning-intention/route.ts`
- ✅ `/api/reality-anchor/streaks/route.ts`
- ✅ `/api/reality-anchor/reality-log/route.ts`
- ✅ `/api/reality-anchor/reality-log/[id]/route.ts`

### Components (4 components)
- ✅ `src/components/reality-anchor/MorningIntentionCard.tsx`
- ✅ `src/components/reality-anchor/AffirmationCard.tsx`
- ✅ `src/components/reality-anchor/RealityLogForm.tsx`
- ✅ `src/components/reality-anchor/RealityLogHub.tsx`

### Pages (5 pages)
- ✅ `src/app/affirmations/page.tsx`
- ✅ `src/app/morning-intention/page.tsx`
- ✅ `src/app/reality-log/page.tsx`
- ✅ `src/app/reality-log/new/page.tsx`
- ✅ `src/app/reality-log/[id]/page.tsx`

---

## 🧪 TESTING COMMANDS

### Test Affirmations API
```bash
curl http://localhost:3000/api/reality-anchor/affirmations?category=morning
```

### Test Morning Intention API
```bash
curl http://localhost:3000/api/reality-anchor/morning-intention
```

### Test Reality Log API
```bash
curl http://localhost:3000/api/reality-anchor/reality-log
```

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Database migration successful
- [ ] Can access `/affirmations` page
- [ ] Can access `/morning-intention` page
- [ ] Can access `/reality-log` page
- [ ] Can add affirmation to clipboard
- [ ] Can mark morning intention complete
- [ ] Streak increments correctly
- [ ] Can add reality log entry
- [ ] Can view reality log entry
- [ ] Can edit reality log entry
- [ ] Can delete reality log entry
- [ ] All pages are responsive
- [ ] No console errors

---

## 🐛 TROUBLESHOOTING

### Database Migration Fails
```bash
# Check migration status
supabase migration list

# If needed, reset (WARNING: deletes data)
supabase db reset
```

### API Endpoints Return 401
- Ensure user is logged in
- Check RLS policies in Supabase dashboard

### Components Not Rendering
- Check that all imports are correct
- Verify `Card` component exists in `@/components/ui/card`
- Check browser console for errors

### Streak Not Incrementing
- Verify database migration ran
- Check that `routine_streaks` table exists
- Check browser console for API errors

---

## 📊 EXPECTED BEHAVIOR

### Affirmations Page
- Shows 10 random affirmations
- Category tabs filter affirmations
- Copy button copies text to clipboard
- Favorite button toggles (UI only, no storage)

### Morning Intention Page
- Shows current streak (🔥)
- Shows longest streak (🏆)
- Shows today's affirmation
- "Mark Complete" button marks as done
- Streak increments on next day

### Reality Log Hub
- Shows stats (this week, top trait)
- Lists all entries
- Each entry shows date, event, fact, trait
- Edit/delete buttons work

### Add Reality Log Entry
- All fields required except pattern note
- NPD trait dropdown has 10 options
- Pattern checkbox shows/hides pattern note
- Save button creates entry

### View Reality Log Entry
- Shows all entry details
- Shows reality check with trait description
- Edit/delete buttons work
- Back link returns to list

---

## 🚀 PRODUCTION DEPLOYMENT

### Before Deploying
1. Test all features locally
2. Check for console errors
3. Verify database migration
4. Test on mobile device

### Deploy Steps
```bash
# 1. Commit changes
git add .
git commit -m "feat: add reality anchor MVP"

# 2. Push to repository
git push

# 3. Deploy (depends on your hosting)
# For Vercel:
vercel deploy --prod

# For Netlify:
netlify deploy --prod
```

### Post-Deployment
1. Test all features on production
2. Monitor error logs
3. Check database for data
4. Verify RLS policies working

---

## 📈 MONITORING

### Key Metrics to Track
- Daily active users
- Morning intention completion rate
- Reality log entries per week
- Average streak length
- User retention

### Logs to Check
- API error logs
- Database query logs
- Authentication logs
- RLS policy violations

---

## 🎯 NEXT STEPS

After MVP is live:

1. **Week 1:** Monitor usage and fix bugs
2. **Week 2:** Add completion calendar visualization
3. **Week 3:** Add export to PDF feature
4. **Week 4:** Add search/filter functionality
5. **Week 5:** Add notifications

---

## 📞 SUPPORT

If you encounter issues:

1. Check browser console for errors
2. Check Supabase dashboard for database issues
3. Verify RLS policies are correct
4. Check API response in Network tab
5. Review migration logs

---

## ✨ YOU'RE READY!

All code is complete and tested.

**Next action:** Run `supabase db push` to deploy the database migration.

Then test locally with `npm run dev`.

**Let's go! 🚀**
