# MVP Quick Implementation Guide
## Fast-Track Features (1-2 Week Sprint)

---

## 🚀 TOP 3 QUICK WINS (Pick 1-2)

### OPTION 1: AFFIRMATIONS LIBRARY (Fastest - 2-3 Days)
**Why:** Reuses existing journal infrastructure, minimal DB changes
**Effort:** ⭐ (Easiest)
**Impact:** High - Daily user engagement

#### What to Build:
1. **Simple Affirmations Page** (`/affirmations`)
   - Display daily affirmation (rotates each day)
   - 3 buttons: "Like", "Dislike", "Copy to clipboard"
   - Favorite affirmations list
   - Search by category

2. **Database Changes:**
   ```sql
   CREATE TABLE affirmations (
     id UUID PRIMARY KEY,
     category VARCHAR(50), -- 'morning', 'boundary', 'self-compassion'
     text TEXT NOT NULL,
     is_default BOOLEAN DEFAULT TRUE
   );
   ```

3. **Components Needed:**
   - `AffirmationCard.tsx` (display + actions)
   - `AffirmationLibrary.tsx` (list view)
   - `DailyAffirmation.tsx` (homepage widget)

4. **API Endpoint:**
   ```
   GET /api/affirmations/daily
   GET /api/affirmations?category=morning
   POST /api/affirmations/:id/favorite
   ```

**Time:** 2-3 days | **Complexity:** Low | **Dependencies:** None

---

### OPTION 2: REALITY LOG TEMPLATE (Quick - 3-4 Days)
**Why:** Extends existing journal, uses current form patterns
**Effort:** ⭐⭐ (Easy-Medium)
**Impact:** Very High - Core therapeutic feature

#### What to Build:
1. **Reality Log Entry Form** (new journal template)
   - Reuse existing journal form structure
   - Add 4 fields:
     - Event (text)
     - Factual Details (textarea)
     - NPD Traits (checkboxes - hardcoded list)
     - Emotional Impact Before/After (sliders)

2. **Database Changes:**
   ```sql
   ALTER TABLE journal_entries ADD COLUMN reality_log_data JSONB;
   -- Store: { event, factual_details, traits[], impact_before, impact_after }
   ```

3. **Components Needed:**
   - `RealityLogForm.tsx` (form component)
   - `RealityLogViewer.tsx` (view past entries)
   - Reuse existing journal components

4. **NPD Traits (Hardcoded for MVP):**
   ```typescript
   const NPD_TRAITS = [
     'Victim-Playing',
     'Gaslighting',
     'Triangulation',
     'Love-bombing',
     'Hoovering',
     'Flying Monkeys',
     'Covert Criticism',
     'Boundary Violations'
   ];
   ```

**Time:** 3-4 days | **Complexity:** Low-Medium | **Dependencies:** Existing journal

---

### OPTION 3: MORNING INTENTION STREAK (Quick - 3-4 Days)
**Why:** Simple daily check-in, high engagement
**Effort:** ⭐⭐ (Easy-Medium)
**Impact:** High - Daily habit building

#### What to Build:
1. **Morning Intention Widget** (dashboard + dedicated page)
   - Display today's affirmation
   - "Mark Complete" button
   - Streak counter (days)
   - Calendar view of completions

2. **Database Changes:**
   ```sql
   CREATE TABLE morning_intentions (
     id UUID PRIMARY KEY,
     user_id UUID NOT NULL,
     date DATE NOT NULL,
     completed BOOLEAN DEFAULT FALSE,
     completed_at TIMESTAMP,
     UNIQUE(user_id, date)
   );
   
   CREATE TABLE routine_streaks (
     id UUID PRIMARY KEY,
     user_id UUID NOT NULL,
     routine_type VARCHAR(50),
     current_streak INT DEFAULT 0,
     longest_streak INT DEFAULT 0,
     last_completed_date DATE,
     UNIQUE(user_id, routine_type)
   );
   ```

3. **Components Needed:**
   - `MorningIntentionCard.tsx` (dashboard widget)
   - `MorningIntentionPage.tsx` (full page)
   - `StreakCounter.tsx` (display)
   - `CompletionCalendar.tsx` (calendar view)

4. **API Endpoints:**
   ```
   GET /api/morning-intention/today
   PUT /api/morning-intention/complete
   GET /api/streaks/:routineType
   ```

**Time:** 3-4 days | **Complexity:** Low-Medium | **Dependencies:** Affirmations

---

## 🎯 RECOMMENDED MVP COMBO (Best ROI)

### **COMBO: Affirmations + Morning Intention** (5-6 Days Total)
**Why:** 
- Affirmations are the foundation
- Morning Intention builds on it
- Both drive daily engagement
- Minimal dependencies
- High therapeutic value

**Timeline:**
- Day 1-2: Affirmations Library
- Day 3-4: Morning Intention
- Day 5-6: Testing & Polish

**Result:** Users have daily ritual + engagement driver

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Database (Day 1)
```sql
-- Create affirmations table
CREATE TABLE affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create morning intentions table
CREATE TABLE morning_intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL,
  affirmation_id UUID REFERENCES affirmations(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create streaks table
CREATE TABLE routine_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  routine_type VARCHAR(50) NOT NULL,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, routine_type)
);

-- Seed default affirmations
INSERT INTO affirmations (category, text) VALUES
('morning', 'My only goal today is my peace and my children''s well-being'),
('morning', 'I release the need to manage her emotions or expect normalcy'),
('morning', 'Her actions are a reflection of her disorder, not my worth'),
('morning', 'I am a project manager for a difficult co-parenting project'),
('boundary', 'My boundaries are not negotiable'),
('boundary', 'I can say no without guilt'),
('self-compassion', 'I have survived immense trauma and I am still here'),
('self-compassion', 'I deserve kindness, especially from myself');
```

### Phase 2: API Endpoints (Day 2)

**File:** `pages/api/affirmations/index.ts`
```typescript
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { category } = req.query
    let query = supabase.from('affirmations').select('*')
    
    if (category) query = query.eq('category', category)
    
    const { data, error } = await query.order('RANDOM()').limit(10)
    return res.status(error ? 500 : 200).json(error ? { error: error.message } : { affirmations: data })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
```

**File:** `pages/api/morning-intention/index.ts`
```typescript
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const today = new Date().toISOString().split('T')[0]
    
    let { data: intention } = await supabase
      .from('morning_intentions')
      .select('*, affirmations(*)')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (!intention) {
      const { data: affirmation } = await supabase
        .from('affirmations')
        .select('*')
        .eq('category', 'morning')
        .order('RANDOM()')
        .limit(1)
        .single()

      intention = { affirmations: affirmation }
    }

    return res.status(200).json({ intention })
  }

  if (req.method === 'PUT') {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('morning_intentions')
      .upsert({
        user_id: user.id,
        date: today,
        completed: true,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    // Update streak
    const { data: streak } = await supabase
      .from('routine_streaks')
      .select('*')
      .eq('user_id', user.id)
      .eq('routine_type', 'morning_intention')
      .single()

    if (!streak) {
      await supabase.from('routine_streaks').insert({
        user_id: user.id,
        routine_type: 'morning_intention',
        current_streak: 1,
        longest_streak: 1,
        last_completed_date: today
      })
    } else {
      const lastDate = new Date(streak.last_completed_date)
      const todayDate = new Date(today)
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      const newStreak = daysDiff === 1 ? streak.current_streak + 1 : 1
      
      await supabase.from('routine_streaks').update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_completed_date: today
      }).eq('user_id', user.id).eq('routine_type', 'morning_intention')
    }

    return res.status(200).json({ intention: data })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
```

### Phase 3: Components (Day 3-4)

**File:** `components/reality-anchor/MorningIntentionCard.tsx`
```typescript
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Check } from 'lucide-react'

export default function MorningIntentionCard({ userId }: { userId: string }) {
  const [intention, setIntention] = useState<any>(null)
  const [completed, setCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/morning-intention')
      const data = await res.json()
      setIntention(data.intention)
      setCompleted(data.intention?.completed || false)
      
      const streakRes = await fetch(`/api/streaks/morning_intention`)
      const streakData = await streakRes.json()
      setStreak(streakData.streak?.current_streak || 0)
      setLoading(false)
    }
    load()
  }, [])

  const handleComplete = async () => {
    const res = await fetch('/api/morning-intention', { method: 'PUT' })
    if (res.ok) {
      setCompleted(true)
      setStreak(streak + 1)
    }
  }

  if (loading) return <div className="animate-pulse">Loading...</div>

  const text = intention?.affirmations?.text || 'Loading affirmation...'

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-indigo-600" />
            <CardTitle>Morning Intention</CardTitle>
          </div>
          <span className="text-sm font-bold text-indigo-600">🔥 {streak} days</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 italic p-4 bg-white rounded-lg border border-indigo-100">
          {text}
        </p>
        {!completed ? (
          <button
            onClick={handleComplete}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Mark Complete
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <Check className="h-5 w-5" />
            Completed today
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### Phase 4: Pages (Day 4-5)

**File:** `app/affirmations/page.tsx`
```typescript
'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Copy, Check } from 'lucide-react'

export default function AffirmationsPage() {
  const [affirmations, setAffirmations] = useState<any[]>([])
  const [category, setCategory] = useState('morning')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/affirmations?category=${category}`)
      const data = await res.json()
      setAffirmations(data.affirmations || [])
    }
    load()
  }, [category])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Affirmations</h1>

        <div className="flex gap-2">
          {['morning', 'boundary', 'self-compassion'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {affirmations.map((aff) => (
            <Card key={aff.id}>
              <CardContent className="pt-6">
                <p className="text-gray-700 mb-4">{aff.text}</p>
                <button
                  onClick={() => handleCopy(aff.text, aff.id)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                >
                  {copied === aff.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
```

### Phase 5: Testing & Polish (Day 5-6)
- [ ] Test streak calculation
- [ ] Test daily reset
- [ ] Test affirmation rotation
- [ ] Mobile responsiveness
- [ ] Add to dashboard
- [ ] Add navigation link

---

## 📊 EFFORT BREAKDOWN

| Feature | DB | API | Components | Pages | Total |
|---------|----|----|------------|-------|-------|
| Affirmations | 1 table | 1 endpoint | 2 | 1 | 2-3 days |
| Morning Intention | 2 tables | 2 endpoints | 2 | 1 | 3-4 days |
| Reality Log | 1 column | 1 endpoint | 2 | 1 | 3-4 days |

---

## 🎯 RECOMMENDED FIRST MVP

### **Go with: Affirmations + Morning Intention**

**Why:**
1. ✅ Fastest to implement (5-6 days)
2. ✅ Highest daily engagement
3. ✅ Foundation for other features
4. ✅ Minimal dependencies
5. ✅ High therapeutic value
6. ✅ Easy to test

**Result:** Users get daily ritual + streak motivation

---

## 🚀 DEPLOYMENT STEPS

1. **Create migration file** in `supabase/migrations/`
2. **Run migration** locally: `supabase db push`
3. **Create API endpoints** in `pages/api/`
4. **Create components** in `components/`
5. **Create pages** in `app/`
6. **Add navigation** to dashboard
7. **Test thoroughly**
8. **Deploy to production**

---

## 📱 QUICK START COMMAND

```bash
# 1. Create migration
touch supabase/migrations/20250825_affirmations_morning_intention.sql

# 2. Add SQL from Phase 1 above

# 3. Push to Supabase
supabase db push

# 4. Create API files
mkdir -p pages/api/affirmations pages/api/morning-intention
# Add endpoint files

# 5. Create components
mkdir -p components/reality-anchor
# Add component files

# 6. Create pages
mkdir -p app/affirmations
# Add page files

# 7. Test
npm run dev

# 8. Deploy
git add .
git commit -m "feat: add affirmations and morning intention MVP"
git push
```

---

## ✨ EXPECTED OUTCOME

After 5-6 days:
- ✅ Users see daily affirmation on dashboard
- ✅ Users can mark intention complete
- ✅ Streak counter shows progress
- ✅ Daily engagement driver
- ✅ Foundation for Reality Anchor Routine

**Next Phase:** Add Reality Log, Pre-Interaction Tool, Decompression Ritual

---

## 💡 TIPS FOR SPEED

1. **Reuse existing components** - Use Card, Button from UI library
2. **Hardcode data first** - Don't over-engineer
3. **Skip animations initially** - Add later
4. **Use Tailwind classes** - No custom CSS
5. **Test with real data** - Seed affirmations early
6. **Deploy early** - Get feedback fast

---

## 🎯 SUCCESS METRICS

After launch, track:
- Daily active users
- Morning intention completion rate
- Streak length (average)
- User retention
- Feature engagement

**Goal:** 60%+ of users complete morning intention daily
