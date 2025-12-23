# Donation System - MVP Setup Guide

## ✅ Files Created

### Pages
- `/src/app/donate/page.tsx` - Main donation page
- `/src/app/donate/thank-you/page.tsx` - Thank you page after donation

### API Routes
- `/src/app/api/donations/create-checkout/route.ts` - Creates Stripe checkout or Ko-fi redirect
- `/src/app/api/donations/webhook/route.ts` - Handles Stripe webhook events

### Database
- `/supabase/migrations/20250202_donations_system.sql` - Donations table + donor badge

---

## 🚀 Setup Instructions

### 1. Run Database Migration
```bash
cd reclaim-app
supabase db push
```

### 2. Configure Environment Variables

Add to `.env.local`:
```env
# Stripe (Optional - if not set, will use Ko-fi fallback)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase (should already exist)
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### 3. Install Stripe (if using Stripe)
```bash
npm install stripe
```

### 4. Setup Stripe Webhook (if using Stripe)
```bash
stripe listen --forward-to localhost:3000/api/donations/webhook
```

---

## 💡 How It Works

### Without Stripe (Ko-fi Fallback)
1. User clicks "Donate Now"
2. Redirects to Ko-fi donation page
3. Manual tracking required

### With Stripe
1. User clicks "Donate Now"
2. Creates Stripe checkout session
3. User completes payment
4. Webhook updates database
5. User gets donor badge
6. Redirects to thank you page

---

## 🎨 Features Included

### Donation Page (`/donate`)
- ✅ 3 preset tiers ($5, $25, $100)
- ✅ Custom amount option
- ✅ Impact stats (survivors helped, AI costs)
- ✅ Transparency breakdown (where money goes)
- ✅ Why donate section
- ✅ Mobile responsive

### Thank You Page (`/donate/thank-you`)
- ✅ Personalized thank you message
- ✅ Impact summary
- ✅ Links back to dashboard
- ✅ Upsell to monthly sponsorship

### Database Tracking
- ✅ Donations table (amount, status, user)
- ✅ Donor badge on profile
- ✅ RLS policies for privacy

---

## 🔗 Integration Points

### Add to Navigation
In `layout.tsx` or navigation component:
```tsx
<Link href="/donate">💜 Donate</Link>
```

### Add to Dashboard
Optional widget showing donation impact:
```tsx
<div className="bg-purple-50 p-4 rounded">
  <p>Love Reclaim? Consider donating to keep it free!</p>
  <Link href="/donate">Donate Now</Link>
</div>
```

### Show Donor Badge
In profile or comments:
```tsx
{user.is_donor && <span className="text-purple-600">💜 Donor</span>}
```

---

## 📊 Tracking Donations

### View All Donations (Admin)
```sql
SELECT 
  d.amount,
  d.status,
  d.created_at,
  p.email
FROM donations d
LEFT JOIN profiles p ON d.user_id = p.id
ORDER BY d.created_at DESC;
```

### Total Donations
```sql
SELECT 
  COUNT(*) as total_donations,
  SUM(amount) as total_amount,
  AVG(amount) as avg_donation
FROM donations
WHERE status = 'completed';
```

---

## 🎯 Next Steps (Future Enhancements)

### Phase 2: Monthly Sponsorship
- `/sponsor` page
- Recurring Stripe subscriptions
- Sponsor tiers with benefits

### Phase 3: Campaign Page
- `/campaign` page
- Goal tracking with progress bar
- Milestone unlocks
- Backer rewards

### Phase 4: In-App Integration
- Donation banner (dismissible)
- Dashboard widget
- Post-feature-use gentle ask

---

## 🔧 Customization

### Change Donation Tiers
Edit `src/app/donate/page.tsx`:
```tsx
const tiers = [
  { amount: 10, title: 'Friend', impact: 'Your custom impact' },
  { amount: 50, title: 'Supporter', impact: 'Your custom impact' },
  { amount: 200, title: 'Hero', impact: 'Your custom impact' },
]
```

### Change Impact Stats
Edit the stats section:
```tsx
<div className="text-3xl font-bold text-purple-600 mb-2">Your Number</div>
<div className="text-gray-600">Your Metric</div>
```

### Change Transparency Breakdown
Edit the percentages:
```tsx
<div className="flex justify-between">
  <span>Your Category</span>
  <span className="font-semibold">XX%</span>
</div>
```

---

## 🐛 Troubleshooting

### Stripe Not Working
- Check environment variables are set
- Verify Stripe keys are correct
- Check webhook is running
- Falls back to Ko-fi if Stripe not configured

### Database Errors
- Run migration: `supabase db push`
- Check RLS policies are enabled
- Verify user is authenticated

### Redirect Issues
- Check `NEXT_PUBLIC_BASE_URL` is set correctly
- Verify success/cancel URLs in Stripe session

---

## 📞 Support

For issues or questions:
1. Check console for errors
2. Verify environment variables
3. Test with Stripe test mode first
4. Check Supabase logs

---

## ✨ MVP Complete!

You now have a fully functional donation system with:
- ✅ Beautiful donation page
- ✅ Stripe integration (with Ko-fi fallback)
- ✅ Database tracking
- ✅ Donor badges
- ✅ Thank you page
- ✅ Transparency and impact messaging

**Ready to accept donations and support survivors! 💜**
