# Developer Implementation Guide
## Reality Anchor Routine & New Features

---

## PROJECT STRUCTURE

```
reclaim-app/src/
├── app/
│   ├── reality-anchor/
│   │   ├── page.tsx                    # Main Reality Anchor page
│   │   ├── layout.tsx
│   │   ├── morning-intention/
│   │   │   ├── page.tsx
│   │   │   └── MorningIntentionCard.tsx
│   │   ├── reality-log/
│   │   │   ├── page.tsx
│   │   │   ├── RealityLogEntry.tsx
│   │   │   ├── RealityLogViewer.tsx
│   │   │   └── NPDTraitSelector.tsx
│   │   ├── pre-interaction/
│   │   │   ├── page.tsx
│   │   │   ├── PreInteractionChecklist.tsx
│   │   │   ├── ArmorVisualization.tsx
│   │   │   └── BreathingExercise.tsx
│   │   └── decompression/
│   │       ├── page.tsx
│   │       ├── DecompressionRitualSelector.tsx
│   │       ├── PhysicalRituals.tsx
│   │       ├── CreativeRituals.tsx
│   │       └── MindfulnessRituals.tsx
│   ├── npd-traits/
│   │   ├── page.tsx
│   │   ├── TraitLibrary.tsx
│   │   └── TraitDetail.tsx
│   ├── manipulation-decoder/
│   │   ├── page.tsx
│   │   └── MessageAnalyzer.tsx
│   ├── expectation-management/
│   │   ├── page.tsx
│   │   ├── DiagnosisAcceptance.tsx
│   │   ├── RoleReframing.tsx
│   │   └── EmpathyRedirection.tsx
│   ├── co-parenting/
│   │   ├── page.tsx
│   │   └── StabilityTracker.tsx
│   └── recovery-metrics/
│       ├── page.tsx
│       └── ProgressDashboard.tsx
├── components/
│   ├── reality-anchor/
│   │   ├── RoutineStreak.tsx
│   │   ├── AffirmationLibrary.tsx
│   │   └── RoutineDashboard.tsx
│   └── ...
├── lib/
│   ├── reality-anchor.ts              # Business logic
│   ├── npd-traits.ts
│   ├── manipulation-decoder.ts
│   └── ...
└── api/
    ├── reality-anchor/
    │   ├── morning-intention.ts
    │   ├── reality-log.ts
    │   ├── pre-interaction.ts
    │   └── decompression.ts
    ├── npd-traits/
    │   └── index.ts
    ├── manipulation-decoder/
    ���   └── analyze.ts
    └── ...
```

---

## DATABASE MIGRATIONS

### Migration File: `20250825_reality_anchor_routine.sql`

```sql
-- Reality Anchor Routine Tables

-- 1. Morning Intentions
CREATE TABLE morning_intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  intention_text TEXT NOT NULL,
  affirmation_id UUID REFERENCES affirmations(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_morning_intentions_user_date ON morning_intentions(user_id, date);

-- 2. Affirmations Library
CREATE TABLE affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL, -- 'morning', 'boundary', 'self-compassion', 'children'
  text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_affirmations_category ON affirmations(category);

-- 3. Reality Log Entries
CREATE TABLE reality_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  event_description TEXT NOT NULL,
  factual_details TEXT NOT NULL,
  npd_traits_identified TEXT[] NOT NULL DEFAULT '{}',
  pattern_consistency TEXT,
  emotional_impact_before INT CHECK (emotional_impact_before >= 1 AND emotional_impact_before <= 10),
  emotional_impact_after INT CHECK (emotional_impact_after >= 1 AND emotional_impact_after <= 10),
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reality_log_user_date ON reality_log_entries(user_id, date);
CREATE INDEX idx_reality_log_traits ON reality_log_entries USING GIN(npd_traits_identified);

-- 4. NPD Trait Library
CREATE TABLE npd_traits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  covert_vs_overt VARCHAR(20) NOT NULL, -- 'covert', 'overt', 'both'
  examples TEXT[] DEFAULT '{}',
  response_strategies TEXT[] DEFAULT '{}',
  trigger_indicators TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_npd_traits_name ON npd_traits(name);

-- 5. Pre-Interaction Sessions
CREATE TABLE pre_interaction_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'text', 'call', 'pickup', 'dropoff', 'other'
  interaction_date TIMESTAMP NOT NULL,
  preparation_completed BOOLEAN DEFAULT FALSE,
  breathing_exercise_done BOOLEAN DEFAULT FALSE,
  mantra_repeated TEXT,
  armor_visualization_done BOOLEAN DEFAULT FALSE,
  coping_strategies_reviewed TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pre_interaction_user_date ON pre_interaction_sessions(user_id, interaction_date);

-- 6. Decompression Rituals
CREATE TABLE decompression_rituals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_id UUID REFERENCES pre_interaction_sessions(id),
  ritual_type VARCHAR(50) NOT NULL, -- 'physical', 'creative', 'mindfulness'
  ritual_subtype VARCHAR(100) NOT NULL, -- 'walk', 'exercise', 'music', 'journaling', 'breathing'
  duration_minutes INT,
  mood_before INT CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INT CHECK (mood_after >= 1 AND mood_after <= 10),
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_decompression_user_date ON decompression_rituals(user_id, completed_at);

-- 7. Routine Streaks
CREATE TABLE routine_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_type VARCHAR(50) NOT NULL, -- 'morning_intention', 'reality_log', 'pre_interaction', 'decompression'
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, routine_type)
);

-- RLS Policies
ALTER TABLE morning_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reality_log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_interaction_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decompression_rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_streaks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own morning intentions"
  ON morning_intentions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own morning intentions"
  ON morning_intentions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own morning intentions"
  ON morning_intentions FOR UPDATE
  USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

---

## API ENDPOINTS

### Morning Intention Endpoints

```typescript
// pages/api/reality-anchor/morning-intention.ts

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    // Get today's intention
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('morning_intentions')
      .select('*, affirmations(*)')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message })
    }

    // If no intention exists, get a random default affirmation
    if (!data) {
      const { data: affirmation } = await supabase
        .from('affirmations')
        .select('*')
        .eq('category', 'morning')
        .eq('is_default', true)
        .order('RANDOM()')
        .limit(1)
        .single()

      return res.status(200).json({
        intention: null,
        suggestedAffirmation: affirmation,
      })
    }

    return res.status(200).json({ intention: data })
  }

  if (req.method === 'POST') {
    // Create or update intention
    const { intention_text, affirmation_id } = req.body
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('morning_intentions')
      .upsert({
        user_id: user.id,
        date: today,
        intention_text,
        affirmation_id,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ intention: data })
  }

  if (req.method === 'PUT') {
    // Mark intention as complete
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('morning_intentions')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('date', today)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Update streak
    await updateStreak(supabase, user.id, 'morning_intention')

    return res.status(200).json({ intention: data })
  }

  res.status(405).json({ error: 'Method not allowed' })
}

async function updateStreak(supabase: any, userId: string, routineType: string) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data: streak } = await supabase
    .from('routine_streaks')
    .select('*')
    .eq('user_id', userId)
    .eq('routine_type', routineType)
    .single()

  if (!streak) {
    await supabase
      .from('routine_streaks')
      .insert({
        user_id: userId,
        routine_type: routineType,
        current_streak: 1,
        longest_streak: 1,
        last_completed_date: today,
      })
    return
  }

  const lastDate = new Date(streak.last_completed_date)
  const todayDate = new Date(today)
  const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

  let newStreak = streak.current_streak
  if (daysDiff === 1) {
    newStreak = streak.current_streak + 1
  } else if (daysDiff > 1) {
    newStreak = 1
  }

  const longestStreak = Math.max(newStreak, streak.longest_streak)

  await supabase
    .from('routine_streaks')
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_completed_date: today,
    })
    .eq('user_id', userId)
    .eq('routine_type', routineType)
}
```

### Reality Log Endpoints

```typescript
// pages/api/reality-anchor/reality-log.ts

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    // Get reality log entries with filters
    const { dateFrom, dateTo, traits, page = 1, limit = 10 } = req.query

    let query = supabase
      .from('reality_log_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (dateFrom) {
      query = query.gte('date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('date', dateTo)
    }

    if (traits) {
      const traitArray = Array.isArray(traits) ? traits : [traits]
      query = query.contains('npd_traits_identified', traitArray)
    }

    const offset = (Number(page) - 1) * Number(limit)
    const { data, error, count } = await query
      .range(offset, offset + Number(limit) - 1)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({
      entries: data,
      total: count,
      page: Number(page),
      limit: Number(limit),
    })
  }

  if (req.method === 'POST') {
    // Create reality log entry
    const {
      event_description,
      factual_details,
      npd_traits_identified,
      pattern_consistency,
      emotional_impact_before,
      emotional_impact_after,
    } = req.body

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('reality_log_entries')
      .insert({
        user_id: user.id,
        date: today,
        event_description,
        factual_details,
        npd_traits_identified,
        pattern_consistency,
        emotional_impact_before,
        emotional_impact_after,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Update streak
    await updateStreak(supabase, user.id, 'reality_log')

    return res.status(201).json({ entry: data })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
```

---

## REACT COMPONENTS

### MorningIntentionCard Component

```typescript
// components/reality-anchor/MorningIntentionCard.tsx

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Check } from 'lucide-react'

interface MorningIntentionCardProps {
  userId: string
  subscriptionTier: 'foundation' | 'recovery' | 'empowered'
}

export default function MorningIntentionCard({
  userId,
  subscriptionTier,
}: MorningIntentionCardProps) {
  const [intention, setIntention] = useState<any>(null)
  const [suggestedAffirmation, setSuggestedAffirmation] = useState<any>(null)
  const [completed, setCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadIntention = async () => {
      try {
        const response = await fetch('/api/reality-anchor/morning-intention')
        const data = await response.json()

        if (data.intention) {
          setIntention(data.intention)
          setCompleted(data.intention.completed)
        } else if (data.suggestedAffirmation) {
          setSuggestedAffirmation(data.suggestedAffirmation)
        }

        // Load streak
        const { data: streakData } = await supabase
          .from('routine_streaks')
          .select('current_streak')
          .eq('user_id', userId)
          .eq('routine_type', 'morning_intention')
          .single()

        if (streakData) {
          setStreak(streakData.current_streak)
        }
      } catch (error) {
        console.error('Error loading intention:', error)
      } finally {
        setLoading(false)
      }
    }

    loadIntention()
  }, [userId, supabase])

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/reality-anchor/morning-intention', {
        method: 'PUT',
      })

      if (response.ok) {
        setCompleted(true)
        setStreak(streak + 1)
      }
    } catch (error) {
      console.error('Error completing intention:', error)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  const displayText = intention?.intention_text || suggestedAffirmation?.text

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-indigo-600" />
            <CardTitle>Morning Intention</CardTitle>
          </div>
          <div className="text-sm font-semibold text-indigo-600">
            🔥 {streak} day streak
          </div>
        </div>
        <CardDescription>Set your intention for today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white rounded-lg border border-indigo-100">
          <p className="text-gray-700 italic">{displayText}</p>
        </div>

        {!completed ? (
          <button
            onClick={handleComplete}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Mark as Complete
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

### RealityLogEntry Component

```typescript
// components/reality-anchor/RealityLogEntry.tsx

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface RealityLogEntryProps {
  userId: string
  onSave: (entry: any) => void
}

export default function RealityLogEntry({ userId, onSave }: RealityLogEntryProps) {
  const [traits, setTraits] = useState<any[]>([])
  const [formData, setFormData] = useState({
    event_description: '',
    factual_details: '',
    npd_traits_identified: [] as string[],
    pattern_consistency: '',
    emotional_impact_before: 5,
    emotional_impact_after: 5,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadTraits = async () => {
      const { data } = await supabase
        .from('npd_traits')
        .select('*')
        .order('name')

      setTraits(data || [])
    }

    loadTraits()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/reality-anchor/reality-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const { entry } = await response.json()
        onSave(entry)
        setFormData({
          event_description: '',
          factual_details: '',
          npd_traits_identified: [],
          pattern_consistency: '',
          emotional_impact_before: 5,
          emotional_impact_after: 5,
        })
      }
    } catch (error) {
      console.error('Error saving entry:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reality Log Entry</CardTitle>
        <CardDescription>
          Document what happened factually, without emotion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event (Brief Description)
            </label>
            <input
              type="text"
              value={formData.event_description}
              onChange={(e) =>
                setFormData({ ...formData, event_description: e.target.value })
              }
              placeholder="e.g., Discussed childcare schedule"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Factual Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Factual Details (What happened, not how it felt)
            </label>
            <textarea
              value={formData.factual_details}
              onChange={(e) =>
                setFormData({ ...formData, factual_details: e.target.value })
              }
              placeholder="Describe only the facts of what occurred..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* NPD Traits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NPD Traits Identified
            </label>
            <div className="grid grid-cols-2 gap-3">
              {traits.map((trait) => (
                <label key={trait.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.npd_traits_identified.includes(trait.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          npd_traits_identified: [
                            ...formData.npd_traits_identified,
                            trait.id,
                          ],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          npd_traits_identified:
                            formData.npd_traits_identified.filter(
                              (id) => id !== trait.id
                            ),
                        })
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{trait.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Emotional Impact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emotional Impact Before: {formData.emotional_impact_before}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.emotional_impact_before}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emotional_impact_before: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emotional Impact After: {formData.emotional_impact_after}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.emotional_impact_after}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emotional_impact_after: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## TESTING CHECKLIST

### Unit Tests
- [ ] Morning intention creation and completion
- [ ] Streak calculation logic
- [ ] Reality log entry validation
- [ ] NPD trait matching
- [ ] Emotional impact calculations

### Integration Tests
- [ ] Morning intention → Streak update flow
- [ ] Reality log → Pattern analysis flow
- [ ] Pre-interaction → Decompression flow
- [ ] Subscription tier gating

### E2E Tests
- [ ] Complete morning routine workflow
- [ ] Reality log entry with trait identification
- [ ] Pre-interaction preparation
- [ ] Decompression ritual completion
- [ ] Streak tracking across days

---

## DEPLOYMENT CHECKLIST

- [ ] Database migrations applied
- [ ] RLS policies configured
- [ ] API endpoints tested
- [ ] Components tested in all subscription tiers
- [ ] Notifications configured
- [ ] Analytics tracking added
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Documentation updated

---

## PERFORMANCE CONSIDERATIONS

### Database Optimization
- Index on `(user_id, date)` for quick lookups
- Index on `npd_traits_identified` array for filtering
- Pagination for large result sets
- Caching for affirmations library

### Frontend Optimization
- Lazy load components
- Memoize expensive calculations
- Debounce form inputs
- Cache API responses

### API Optimization
- Batch operations where possible
- Use database functions for complex calculations
- Implement rate limiting
- Cache frequently accessed data

---

## MONITORING & ANALYTICS

### Key Metrics to Track
- Daily active users
- Feature usage frequency
- Streak completion rates
- Subscription tier distribution
- User retention
- Error rates

### Logging
- API request/response logging
- Error tracking with Sentry
- User action tracking
- Performance monitoring

---

## CONCLUSION

This implementation guide provides the technical foundation for building the Reality Anchor Routine and supporting features. Follow the structure, implement the database schema, create the API endpoints, and build the React components to bring this therapeutic feature to life.

The goal is to provide trauma survivors with daily practices that build emotional detachment and clarity about narcissistic abuse patterns.
