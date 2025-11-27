# Crisis Reframe - Quick Start Guide

## 🚀 Deploy in 3 Steps

### Step 1: Run Database Migration
```bash
cd reclaim-app
```

Then run the migration using Supabase CLI:
```bash
supabase db push
```

Or manually via SQL:
```bash
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/add_crisis_reframe.sql
```

### Step 2: Verify Environment
Make sure your `.env.local` has:
```
GOOGLE_AI_API_KEY=your-gemini-key
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Step 3: Deploy
```bash
npm run build
# Then deploy using your preferred method
```

---

## 🧪 Test the Feature

### 1. Access Crisis Reframe
- Log in to your app
- Go to Dashboard
- See the red "Crisis Reframe" widget at the top
- Click it

### 2. Test Flow
1. **Select Crisis**: Click "Discard/Breakup"
2. **Answer Questions**:
   - Duration: "1-2 years"
   - First time: "Yes"
   - Feeling: "shattered"
3. **Confirm Control**: Click "I'm in control"
4. **Wait 2-3 seconds**: AI generates reframe
5. **Read Reframe**: See all 7 sections
6. **Complete Checklist**: Check some commitments
7. **Rate**: Give it 5 stars

### 3. Test History
- Go back to crisis selection
- See your recent reframe listed
- Click "View" to revisit it

---

## 📱 Quick Demo Script

**Scenario**: User just got discarded by narcissist

1. **Open app** → Dashboard
2. **See red alert widget** → "Crisis Reframe"
3. **Click** → Crisis type selection
4. **Select** → "💔 Discard/Breakup"
5. **Answer**:
   - "How long together?" → "1-2 years"
   - "First time?" → "Yes"
   - "How you feel?" → "devastated"
6. **Click** → "I'm in control" button
7. **Wait** → "Generating your reframe..."
8. **Read** → AI-generated reframe with:
   - ✋ YOU ARE IN CONTROL RIGHT NOW
   - 🫂 What You're Feeling Is Real
   - 🎯 What This Actually Is
   - 💡 The Reframe
   - 🌅 Your Future (6 months from now...)
   - 🛡️ Right Now, You Need To...
   - 💪 Your Power In This Moment
9. **Check** → Control checklist items
10. **See** → "Survived 0 minutes" counter
11. **Rate** → 5 stars

---

## 🎯 Expected AI Output Example

For "Discard after 1-2 years, first time, feeling devastated":

```
✋ YOU ARE IN CONTROL RIGHT NOW

Stop. Breathe. You are in control of this moment. You're reading 
this instead of reacting, which means you're already making a 
powerful choice. You're safe.

🫂 WHAT YOU'RE FEELING IS REAL

You feel devastated because someone you loved for 2 years just 
vanished like you never mattered. The pain is crushing because 
you invested your heart, and now you're questioning everything. 
This grief is real, and you're not overreacting. The urge to 
text them, to fix this, to understand - that's normal. But you 
don't have to act on it.

🎯 WHAT THIS ACTUALLY IS

This is a narcissistic discard - a predictable pattern where 
they devalue and discard when you're no longer serving their 
needs. It's not about anything you did or didn't do. It's about 
their inability to sustain genuine connection. This was always 
coming because narcissists cycle through people.

💡 THE REFRAME

This isn't rejection - it's liberation you didn't know you needed. 
What feels like an ending is actually the beginning of getting 
yourself back. The person you're grieving never existed; you're 
mourning the illusion they sold you. The real tragedy would be 
staying and losing more years to this cycle.

🌅 YOUR FUTURE (6 Months From Now)

Six months from now, you'll wake up and realize you haven't 
thought about them in days. You'll be laughing with friends, 
pursuing dreams you'd forgotten, and feeling lighter than you 
have in years. You'll meet someone who treats you with basic 
respect and think, "Wow, I almost settled for crumbs." You'll 
look back at today and see it as the day your real life started.

🛡️ RIGHT NOW, YOU NEED TO...

• Put your phone in another room (remove the temptation)
• Call someone who loves you - don't be alone with this
• Write down 3 things they did that hurt you (reality anchor)
• Drink water, eat something, take a shower (body care)
• Set a timer for 10 minutes - survive 10 minutes at a time

💪 YOUR POWER IN THIS MOMENT

You have the power to choose your next move. You can choose not 
to text them. You can choose to sit with this pain instead of 
running back to the source of it. You're not losing someone who 
loved you - you're escaping someone who couldn't. And right now, 
in this moment, you're in control.
```

---

## 🐛 Troubleshooting

### Issue: "Monthly limit reached"
**Solution**: User is on Foundation tier (3/month limit)
- Upgrade to Recovery (10/month) or Empowerment (unlimited)

### Issue: AI generation fails
**Check**:
1. GOOGLE_AI_API_KEY is set correctly
2. Gemini API is accessible
3. Check API route logs for errors

### Issue: Database error
**Check**:
1. Migration ran successfully
2. RLS policies are enabled
3. User is authenticated

### Issue: Widget not showing
**Check**:
1. Dashboard imports CrisisReframeWidget
2. Widget is rendered in JSX
3. Clear browser cache

---

## 📊 Monitor These Metrics

### Day 1
- [ ] Feature accessible
- [ ] AI generates reframes
- [ ] Reframes save to database
- [ ] No errors in logs

### Week 1
- [ ] Usage count per tier
- [ ] Average rating (target: 4+)
- [ ] Revisit rate (target: 30%+)
- [ ] Prevented contact rate

### Month 1
- [ ] User feedback
- [ ] Crisis frequency trends
- [ ] Feature adoption rate
- [ ] Upgrade conversions

---

## 💬 User Feedback Questions

After 1 week, ask users:
1. Did Crisis Reframe help you feel more in control?
2. Did it prevent you from contacting the narcissist?
3. How many times did you revisit your reframe?
4. What would make it more helpful?
5. Would you recommend it to others?

---

## 🎉 Success Indicators

✅ Users report feeling calmer after reading
✅ Prevented impulsive contact with narcissist
✅ High revisit rate (users read multiple times)
✅ Positive ratings (4-5 stars)
✅ Increased no-contact adherence
✅ Reduced crisis frequency over time

---

## 🚨 Emergency Contacts (Add to Feature)

If user mentions self-harm, show:
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **National Domestic Violence Hotline**: 1-800-799-7233

---

## 📞 Support

If you encounter issues:
1. Check implementation docs
2. Review API logs
3. Test with different crisis types
4. Verify database records
5. Check Gemini API status

---

## ✅ Launch Checklist

- [ ] Database migration complete
- [ ] Environment variables set
- [ ] Feature tested end-to-end
- [ ] Widget visible on dashboard
- [ ] AI generates quality reframes
- [ ] Usage limits working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Analytics tracking setup
- [ ] User documentation ready

---

## 🎯 Ready to Launch!

Crisis Reframe is ready to help users regain control during their darkest moments. Deploy with confidence! 🚀
