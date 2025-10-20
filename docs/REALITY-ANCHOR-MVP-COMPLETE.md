# Reality Anchor MVP - Complete Spec
## Affirmations + Morning Intention + Reality Log

---

## 🎯 WHAT WE'RE BUILDING

Three simple features that work together:

1. **Affirmations Library** - Daily affirmations by category
2. **Morning Intention Streak** - Daily check-in with streak tracking
3. **Reality Log** - Quick fact documentation

All separate, all simple, all powerful.

---

## 📊 QUICK OVERVIEW

| Feature | Purpose | Time | Fields |
|---------|---------|------|--------|
| **Affirmations** | Daily motivation | 1 min | Display only |
| **Morning Intention** | Daily ritual + streak | 1 min | 1 button |
| **Reality Log** | Document facts | 2 min | 4 fields |

---

## 🗂️ DATABASE SCHEMA

```sql
-- 1. AFFIRMATIONS TABLE
CREATE TABLE affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL, -- 'morning', 'boundary', 'self-compassion'
  text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_affirmations_category ON affirmations(category);

-- 2. MORNING INTENTIONS TABLE
CREATE TABLE morning_intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  affirmation_id UUID REFERENCES affirmations(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_morning_intentions_user_date ON morning_intentions(user_id, date);

-- 3. ROUTINE STREAKS TABLE
CREATE TABLE routine_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_type VARCHAR(50) NOT NULL, -- 'morning_intention'
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, routine_type)
);

-- 4. REALITY LOG TABLE
CREATE TABLE reality_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  event TEXT NOT NULL,
  fact TEXT NOT NULL,
  npd_trait VARCHAR(100),
  is_consistent BOOLEAN,
  pattern_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reality_log_user_date ON reality_log_entries(user_id, date);

-- SEED DEFAULT AFFIRMATIONS
INSERT INTO affirmations (category, text) VALUES
('morning', 'My only goal today is my peace and my children''s well-being'),
('morning', 'I release the need to manage her emotions or expect normalcy'),
('morning', 'Her actions are a reflection of her disorder, not my worth'),
('morning', 'I am a project manager for a difficult co-parenting project'),
('morning', 'Today I choose clarity over confusion'),
('morning', 'I am building emotional detachment for my children''s sake'),
('boundary', 'My boundaries are not negotiable'),
('boundary', 'I can say no without guilt'),
('boundary', 'Her reaction to my boundary is not my responsibility'),
('self-compassion', 'I have survived immense trauma and I am still here'),
('self-compassion', 'I deserve kindness, especially from myself'),
('self-compassion', 'My healing is not linear, and that''s okay');
```

---

## 🎨 UI MOCKUPS

### DASHBOARD - Reality Anchor Hub

```
┌─────────────────────────────────────────────────────────┐
│ REALITY ANCHOR ROUTINE                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 1️⃣  MORNING INTENTION                               │ │
│ │ 🔥 8 day streak                                     │ │
│ │                                                     │ │
│ │ "My only goal today is my peace and my children's  │ │
│ │  well-being"                                        │ │
│ │                                                     │ │
│ │ [Mark Complete]  [View Affirmations]                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 2️⃣  REALITY LOG                                     │ │
│ │ 📝 3 entries this week                              │ │
│ │ 🏷️  Top trait: Playing the Victim (2x)              │ │
│ │                                                     │ │
│ │ [Add Entry]  [View All]                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### PAGE 1: Affirmations Library

```
┌─────────────────────────────────────────────────────────┐
│ AFFIRMATIONS                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Morning] [Boundary] [Self-Compassion]                  │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ "My only goal today is my peace and my children's  │ │
│ │  well-being"                                        │ │
│ │                                                     │ │
│ │ [❤️ Favorite] [📋 Copy]                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ "I release the need to manage her emotions or       │ │
│ │  expect normalcy"                                   │ │
│ │                                                     │ │
│ │ [❤️ Favorite] [📋 Copy]                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ "Her actions are a reflection of her disorder,      │ │
│ │  not my worth"                                      │ │
│ │                                                     │ │
│ │ [❤️ Favorite] [📋 Copy]                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### PAGE 2: Morning Intention

```
┌─────────────────────────────────────────────────────────┐
│ MORNING INTENTION                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔥 CURRENT STREAK: 8 DAYS                              │
│ 🏆 LONGEST STREAK: 12 DAYS                             │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ TODAY'S AFFIRMATION                                 │ │
│ │                                                     │ │
│ │ "My only goal today is my peace and my children's  │ │
│ │  well-being"                                        │ │
│ │                                                     │ │
│ │ [Mark Complete]                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ COMPLETION CALENDAR                                 │ │
│ │                                                     │ │
│ │ M  T  W  T  F  S  S                                 │ │
│ │ ✓  ✓  ✓  ✓  ✓  ✓  ✓  (This week)                   │ │
│ │ ��  ✓  ✓  ✓  ✓  ✗  ✓  (Last week)                   │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Change Affirmation]  [View All Affirmations]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### PAGE 3: Reality Log Hub

```
┌─────────────────────────────────────────────────────────┐
│ REALITY LOG                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 THIS WEEK: 3 entries                                 │
│ 🏷️  Top trait: Playing the Victim (2x)                  │
│                                                         │
│ [+ ADD NEW ENTRY]                                       │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ TODAY - 3:45 PM                                     │ │
│ │ Event: Discussed childcare schedule                 │ │
│ │ Fact: Request met with victimhood ("I do            │ │
│ │       everything"). I handled it alone.              │ │
│ │ Trait: Playing the Victim ✓ Consistent              │ │
│ │ [View] [Edit] [Delete]                              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ YESTERDAY - 2:15 PM                                 │ │
│ │ Event: Asked about school fees                      │ │
│ │ Fact: She said "I can't afford it" but bought       │ │
│ │       furniture. Blamed me for financial problems.   │ │
│ │ Trait: Gaslighting ✓ Consistent                     │ │
│ │ [View] [Edit] [Delete]                              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### PAGE 4: Add Reality Log Entry

```
┌─────────────────────────────────────────────────────────┐
│ ADD REALITY LOG ENTRY                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📅 DATE: [Today] ▼                                      │
│                                                         │
│ 🎯 EVENT (What happened?)                               │
│ ┌───────────────────────���─────────────────────────────┐ │
│ │ Discussed childcare schedule                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📋 FACT (What exactly happened?)                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Request was met with immediate victimhood           │ │
│ │ ("I do everything"). I had to handle it alone.       │ │
│ │                                                     │ │
│ │ (Be factual, not emotional)                         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 🏷️  NPD TRAIT (What trait is this?)                     │
│ [Select a trait...] ▼                                   │
│ • Playing the Victim                                    │
│ �� Gaslighting                                           │
│ • Triangulation                                         │
│ • Love-bombing                                          │
│ • Hoovering                                             │
│ • Flying Monkeys                                        │
│ • Covert Criticism                                      │
│ • Boundary Violations                                   │
│                                                         │
│ 📌 PATTERN (Is this consistent?)                        │
│ ☑ This is consistent with past behavior                │
│                                                         │
│ Pattern note (optional):                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ She always plays victim when I ask for help          │ │
│ │ (Documented 5 times in past month)                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [SAVE ENTRY]  [SAVE & ADD ANOTHER]  [CANCEL]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### PAGE 5: View Reality Log Entry

```
┌─────────────────────────────────────────────────────────┐
│ REALITY LOG ENTRY                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📅 DATE: Today (3:45 PM)                                │
│                                                         │
│ 🎯 EVENT                                                │
│ Discussed childcare schedule                            │
│                                                         │
│ 📋 FACT                                                 │
│ Request was met with immediate victimhood ("I do        │
│ everything"). I had to handle it alone.                 │
│                                                         │
│ 🏷️  NPD TRAIT                                           │
│ Playing the Victim                                      │
│                                                         │
│ 📌 PATTERN                                              │
│ ✓ Consistent with past behavior                         │
│ She always plays victim when I ask for help             │
│ (Documented 5 times in past month)                      │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ 💡 REALITY CHECK                                        │
│ This is consistent with the Covert NPD trait of:        │
│ "Playing the Victim to Avoid Responsibility"           │
│                                                         │
│ When you set a boundary or ask for help, she            │
│ responds with victimhood to make you feel guilty        │
│ and take responsibility instead.                        │
│                                                         │
│ This is NOT your fault. This is her pattern.            │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ [EDIT]  [DELETE]  [BACK]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 API ENDPOINTS

### Affirmations
```
GET /api/affirmations?category=morning
GET /api/affirmations/daily
POST /api/affirmations/:id/favorite
```

### Morning Intention
```
GET /api/morning-intention/today
PUT /api/morning-intention/complete
GET /api/streaks/morning_intention
```

### Reality Log
```
POST /api/reality-log
GET /api/reality-log
GET /api/reality-log/:id
PUT /api/reality-log/:id
DELETE /api/reality-log/:id
```

---

## 💻 COMPONENTS NEEDED

### Affirmations
- `AffirmationCard.tsx` - Display single affirmation
- `AffirmationLibrary.tsx` - List all affirmations
- `DailyAffirmation.tsx` - Dashboard widget

### Morning Intention
- `MorningIntentionCard.tsx` - Dashboard widget
- `MorningIntentionPage.tsx` - Full page
- `StreakCounter.tsx` - Display streak
- `CompletionCalendar.tsx` - Calendar view

### Reality Log
- `RealityLogHub.tsx` - List all entries
- `RealityLogForm.tsx` - Add/edit entry
- `RealityLogEntry.tsx` - View single entry

---

## 📱 PAGES TO CREATE

```
/app/affirmations/page.tsx
/app/morning-intention/page.tsx
/app/reality-log/page.tsx
/app/reality-log/new/page.tsx
/app/reality-log/[id]/page.tsx
```

---

## 🔄 HOW THEY WORK TOGETHER

### Daily User Flow

```
MORNING (5 min)
├─ See Morning Intention on dashboard
├─ Read affirmation
├─ Click "Mark Complete"
└─ 🔥 Streak: 8 days

DURING DAY (As needed)
├─ When confused or doubting
├─ Open Reality Log
├─ Add quick entry
│  ├─ Event: What happened
│  ├─ Fact: What exactly happened
│  ├─ Trait: What NPD trait
│  └─ Pattern: Is it consistent?
└─ ✓ Clarity restored

ANYTIME
├─ Need motivation?
├─ Open Affirmations
├─ Browse by category
├─ Copy to clipboard
└─ Feel empowered
```

---

## 📊 EXAMPLE ENTRIES

### Affirmation
```
Category: Morning
Text: "My only goal today is my peace and my children's well-being"
```

### Morning Intention
```
Date: 3/15/2025
Affirmation: "My only goal today is my peace and my children's well-being"
Completed: Yes
Completed at: 7:15 AM
Streak: 8 days
```

### Reality Log
```
Date: 3/15/2025
Event: Discussed childcare schedule
Fact: Request was met with immediate victimhood ("I do everything"). 
      I had to handle it alone.
Trait: Playing the Victim
Pattern: ✓ Consistent (She always plays victim when I ask for help)
```

---

## ✨ KEY FEATURES

### Affirmations Library
✅ Browse by category  
✅ Copy to clipboard  
✅ Favorite/bookmark  
✅ Search functionality  

### Morning Intention
✅ Daily affirmation  
✅ Mark complete button  
✅ Streak counter  
✅ Calendar view  
✅ Longest streak tracking  

### Reality Log
✅ Quick entry form  
✅ 4 simple fields  
✅ NPD trait selection  
✅ Pattern tracking  
✅ Reality check explanation  
✅ View/edit/delete entries  

---

## 🚀 IMPLEMENTATION TIMELINE

```
Day 1: Database setup + seed data (1 hour)
Day 2: API endpoints (2 hours)
Day 3: Affirmations components (2 hours)
Day 4: Morning Intention components (2 hours)
Day 5: Reality Log components (2 hours)
Day 6: Pages + integration (2 hours)
Day 7: Testing + polish (2 hours)

Total: ~15 hours = 2-3 days with team
```

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] Create migration file
- [ ] Run `supabase db push`
- [ ] Create API endpoints
- [ ] Create React components
- [ ] Create pages
- [ ] Add to navigation/dashboard
- [ ] Test locally
- [ ] Test on mobile
- [ ] Deploy to production
- [ ] Monitor usage

---

## 💡 QUICK START

```bash
# 1. Create migration
touch supabase/migrations/20250825_reality_anchor_mvp.sql
# Add SQL from above

# 2. Push to Supabase
supabase db push

# 3. Create API files
mkdir -p pages/api/affirmations pages/api/morning-intention pages/api/reality-log

# 4. Create components
mkdir -p components/reality-anchor

# 5. Create pages
mkdir -p app/affirmations app/morning-intention app/reality-log

# 6. Test
npm run dev

# 7. Deploy
git add .
git commit -m "feat: add reality anchor MVP"
git push
```

---

## 🎯 EXPECTED OUTCOMES

### After 1 Week:
✅ Users see daily affirmation  
✅ Users can mark intention complete  
✅ Streak counter shows progress  
✅ Users can add reality log entries  
✅ Users can view past entries  

### After 1 Month:
✅ 60%+ daily completion rate  
✅ Users documenting patterns  
✅ Users reporting clarity  
✅ Reduced confusion/self-doubt  
✅ Better emotional detachment  

---

## 📊 SUCCESS METRICS

Track:
- Daily active users
- Morning intention completion rate
- Streak length (average)
- Reality log entries per week
- User retention
- Feature engagement

---

## ✨ BOTTOM LINE

**Three simple features:**
1. Affirmations - Daily motivation
2. Morning Intention - Daily ritual + streak
3. Reality Log - Quick fact documentation

**Together they:**
✅ Build daily habit  
✅ Provide clarity  
✅ Counter gaslighting  
✅ Track patterns  
✅ Support healing  

**Ready to build! 🚀**
