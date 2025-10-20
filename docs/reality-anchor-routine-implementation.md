# Reality Anchor Routine: Implementation Guide
## The Flagship Feature for Emotional Detachment & Recovery

---

## OVERVIEW

The **Reality Anchor Routine** is the core therapeutic practice from the research text. It consists of four interconnected daily practices designed to build emotional detachment and maintain clarity about the narcissistic partner's disorder.

This document provides technical specifications for implementing this feature in the Reclaim app.

---

## FEATURE ARCHITECTURE

### Database Schema Requirements

```sql
-- Reality Anchor Routine Tables

-- 1. Morning Intentions
CREATE TABLE morning_intentions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL,
  intention_text TEXT NOT NULL,
  affirmation_id UUID REFERENCES affirmations(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 2. Affirmations Library
CREATE TABLE affirmations (
  id UUID PRIMARY KEY,
  category VARCHAR(50), -- 'morning', 'boundary', 'self-compassion', 'children'
  text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Reality Log Entries
CREATE TABLE reality_log_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL,
  event_description TEXT NOT NULL,
  factual_details TEXT NOT NULL,
  npd_traits_identified TEXT[] NOT NULL, -- Array of trait IDs
  pattern_consistency TEXT,
  emotional_impact_before INT, -- 1-10 scale
  emotional_impact_after INT,
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. NPD Trait Library
CREATE TABLE npd_traits (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  covert_vs_overt VARCHAR(20), -- 'covert', 'overt', 'both'
  examples TEXT[],
  response_strategies TEXT[],
  trigger_indicators TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Mental Pause Pre-Interaction
CREATE TABLE pre_interaction_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  interaction_type VARCHAR(50), -- 'text', 'call', 'pickup', 'dropoff', 'other'
  interaction_date TIMESTAMP NOT NULL,
  preparation_completed BOOLEAN DEFAULT FALSE,
  breathing_exercise_done BOOLEAN DEFAULT FALSE,
  mantra_repeated TEXT,
  armor_visualization_done BOOLEAN DEFAULT FALSE,
  coping_strategies_reviewed TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Decompression Rituals
CREATE TABLE decompression_rituals (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  interaction_id UUID REFERENCES pre_interaction_sessions(id),
  ritual_type VARCHAR(50), -- 'physical', 'creative', 'mindfulness'
  ritual_subtype VARCHAR(100), -- 'walk', 'exercise', 'music', 'journaling', 'breathing'
  duration_minutes INT,
  mood_before INT, -- 1-10 scale
  mood_after INT,
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Reality Anchor Routine Streaks
CREATE TABLE routine_streaks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  routine_type VARCHAR(50), -- 'morning_intention', 'reality_log', 'pre_interaction', 'decompression'
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## COMPONENT SPECIFICATIONS

### 1. MORNING INTENTION MODULE

#### UI Components

**MorningIntentionCard.tsx**
```typescript
interface MorningIntentionProps {
  userId: string;
  subscriptionTier: 'foundation' | 'recovery' | 'empowered';
  onComplete: (intentionId: string) => void;
}

Features:
- Display current date
- Show pre-written affirmation or custom intention
- "Mark as Complete" button
- Streak counter
- Optional notification reminder setup
- Quick access to affirmation library
```

**AffirmationLibrary.tsx**
```typescript
interface AffirmationLibraryProps {
  userId: string;
  category?: 'morning' | 'boundary' | 'self-compassion' | 'children';
  onSelect: (affirmation: Affirmation) => void;
}

Features:
- Categorized affirmations
- Search functionality
- Custom affirmation creation
- Favorite/bookmark affirmations
- Daily rotation option
- Share with accountability partner
```

#### Default Affirmations

```json
{
  "morning": [
    "My only goal today is my peace and my children's well-being",
    "I release the need to manage her emotions or expect normalcy",
    "Her actions are a reflection of her disorder, not my worth",
    "I am a project manager for a difficult co-parenting project",
    "Today I choose clarity over confusion",
    "I am building emotional detachment for my children's sake",
    "My empathy is redirected toward my children and myself",
    "I will respond with logic, not react with emotion",
    "The person I married never existed—it was a mask",
    "I deserve the compassion I keep wasting on someone who cannot reciprocate"
  ],
  "boundary": [
    "My boundaries are not negotiable",
    "I can say no without guilt",
    "Her reaction to my boundary is not my responsibility",
    "I am protecting my peace, not being selfish",
    "Boundaries are an act of self-love"
  ],
  "self_compassion": [
    "I have survived immense trauma and I am still here",
    "I am doing the best I can with what I know",
    "I deserve kindness, especially from myself",
    "My healing is not linear, and that's okay",
    "I am worthy of love and respect"
  ],
  "children": [
    "My emotional stability is the greatest gift I can give my children",
    "My detachment from her drama protects my children",
    "I am the stable parent my children need",
    "My children have one home that is a sanctuary of calm",
    "I am modeling healthy boundaries for my children"
  ]
}
```

#### API Endpoints

```
POST /api/morning-intention/complete
- Mark intention as complete for the day
- Update streak
- Return streak count

GET /api/morning-intention/today
- Get today's intention
- Return streak info

GET /api/affirmations
- Query: category, search term
- Return paginated affirmations

POST /api/affirmations/custom
- Create custom affirmation
- Return created affirmation

POST /api/affirmations/:id/favorite
- Add/remove from favorites
```

---

### 2. REALITY LOG MODULE

#### UI Components

**RealityLogEntry.tsx**
```typescript
interface RealityLogEntryProps {
  userId: string;
  onSave: (entry: RealityLogEntry) => void;
}

Features:
- Date picker (auto-filled with today)
- Event description field (brief)
- Factual details field (emotion-free)
- NPD trait selector (multi-select with descriptions)
- Pattern consistency assessment
- Emotional impact before/after (1-10 scale)
- Privacy toggle (password-protected)
- Save & Continue button
```

**RealityLogViewer.tsx**
```typescript
interface RealityLogViewerProps {
  userId: string;
  filters?: {
    dateRange?: [Date, Date];
    traits?: string[];
    emotionalImpact?: [number, number];
  };
}

Features:
- Timeline view of all entries
- Filter by date, trait, impact
- Search functionality
- "Doubt Buster" feature: Quick access to past entries
- Export to PDF
- Print functionality
- Trend analysis
```

**NPDTraitSelector.tsx**
```typescript
interface NPDTraitSelectorProps {
  onSelect: (traits: NPDTrait[]) => void;
  selectedTraits?: string[];
}

Features:
- Searchable trait list
- Trait descriptions on hover
- Examples for each trait
- Quick-tag buttons for common traits
- Custom trait option
```

#### Reality Log Template

```
┌─────────────────────────────────────────────────────────┐
│ REALITY LOG ENTRY                                       │
├─────────────────────────────────────────────────────────┤
│ Date: [XX/XX/XXXX]                                      │
│                                                         │
│ EVENT (Brief description):                              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Discussed childcare schedule                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ FACTUAL DETAILS (What happened, not how it felt):       │
│ ┌───────────────────────────────────��─────────────────┐ │
│ │ Request was met with immediate victimhood           │ │
│ │ ("I do everything"). I had to handle it alone.      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ NPD TRAITS IDENTIFIED:                                  │
│ ☑ Victim-Playing  ☐ Gaslighting  ☐ Triangulation      │
│ ☐ Love-bombing    ☐ Hoovering    ☐ Flying Monkeys     │
│                                                         │
│ PATTERN CONSISTENCY:                                    │
│ ☑ This is consistent with past behavior                │
│ Pattern: She always plays victim when asked for help    │
│                                                         │
│ EMOTIONAL IMPACT:                                       │
│ Before: 8/10  →  After: 5/10                           │
│                                                         │
│ [SAVE ENTRY]  [SAVE & ADD ANOTHER]  [CANCEL]          │
└────────────────────────────────────────────────��────────┘
```

#### API Endpoints

```
POST /api/reality-log/entries
- Create new reality log entry
- Auto-tag NPD traits if enabled
- Return entry with ID

GET /api/reality-log/entries
- Query: userId, dateRange, traits, emotionalImpact
- Return paginated entries

GET /api/reality-log/entries/:id
- Return single entry with full details

PUT /api/reality-log/entries/:id
- Update entry

DELETE /api/reality-log/entries/:id
- Delete entry (soft delete for privacy)

GET /api/reality-log/doubt-buster
- Return random past entry for reassurance
- Query: trait (optional)

GET /api/reality-log/trends
- Return trend analysis
- Query: dateRange, trait
- Return: frequency, patterns, escalation indicators
```

---

### 3. MENTAL PAUSE PRE-INTERACTION TOOL

#### UI Components

**PreInteractionChecklist.tsx**
```typescript
interface PreInteractionChecklistProps {
  userId: string;
  interactionType: 'text' | 'call' | 'pickup' | 'dropoff' | 'other';
  onComplete: (sessionId: string) => void;
}

Features:
- 10-second timer
- Breathing exercise (4-7-8 technique)
- Armor visualization guide
- Grey Rock mantra display
- Coping strategy cards
- Interaction type specific tips
- "I'm ready" confirmation button
```

**ArmorVisualization.tsx**
```typescript
Features:
- Guided visualization script
- Audio option (calming voice)
- Visual animation (armor forming)
- Customizable armor description
- Permeable to children's love, impermeable to manipulation
```

**BreathingExercise.tsx**
```typescript
Features:
- 4-7-8 breathing technique
- Visual breathing guide
- Countdown timer
- Haptic feedback (if available)
- Completion confirmation
```

#### Pre-Interaction Flow

```
1. User selects interaction type
2. System displays:
   - Interaction-specific tips
   - Mantra: "This is a transaction, not a relationship"
   - Breathing exercise (4-7-8)
   - Armor visualization
   - Relevant coping strategies
3. User confirms readiness
4. Session created with timestamp
5. User proceeds with interaction
```

#### API Endpoints

```
POST /api/pre-interaction/start
- Create pre-interaction session
- Return: sessionId, tips, mantra, coping strategies

PUT /api/pre-interaction/:sessionId/complete
- Mark preparation as complete
- Record which exercises were done

GET /api/pre-interaction/tips
- Query: interactionType
- Return: interaction-specific tips
```

---

### 4. DECOMPRESSION RITUAL POST-INTERACTION

#### UI Components

**DecompressionRitualSelector.tsx**
```typescript
interface DecompressionRitualSelectorProps {
  userId: string;
  preInteractionSessionId: string;
  onComplete: (ritualId: string) => void;
}

Features:
- Mood check-in before (1-10 scale)
- Three ritual categories:
  1. Physical (walk, exercise, shake it out)
  2. Creative (music, journaling, tear & throw)
  3. Mindfulness (breathing, meditation)
- Duration selector
- Ritual-specific guidance
- Completion tracking
- Mood check-in after
```

**PhysicalRitualOptions.tsx**
```typescript
Options:
- Brisk walk (with timer)
- Push-ups counter
- Shake it out (with instructions)
- Dance to music
- Cold water splash
- Progressive muscle relaxation
```

**CreativeRitualOptions.tsx**
```typescript
Options:
- Playlist integration (powerful songs)
- Journaling prompt (write angry/hurt feelings)
- Digital tear & throw (write then delete)
- Art/drawing
- Letter writing (not sent)
```

**MindfulnessRitualOptions.tsx**
```typescript
Options:
- 5-minute breathing meditation
- Body scan meditation
- Grounding exercise (5 senses)
- Guided visualization
- Progressive relaxation
```

#### Decompression Flow

```
1. User completes interaction
2. System prompts: "Let's decompress"
3. Mood check-in: "How are you feeling? (1-10)"
4. Ritual category selection
5. Specific ritual selection
6. Guided ritual completion
7. Mood check-in after: "How are you feeling now? (1-10)"
8. Ritual logged with mood improvement
9. Encouragement message
```

#### API Endpoints

```
POST /api/decompression/start
- Create decompression session
- Link to pre-interaction session
- Return: ritual options, mood scale

POST /api/decompression/:sessionId/complete
- Log ritual completion
- Record mood before/after
- Calculate mood improvement
- Update streak

GET /api/decompression/rituals
- Query: category, subscriptionTier
- Return: available rituals with guidance
```

---

## INTEGRATION WITH EXISTING FEATURES

### Journal Integration
- Add "Reality Log" as journal template option
- Auto-tag entries with NPD traits
- Link to pattern analysis

### AI Coach Integration
- Coach can reference reality log entries
- Provide coaching on expectation management
- Suggest affirmations based on patterns

### Grey Rock Integration
- Pre-interaction tool links to Grey Rock technique
- Suggest Grey Rock responses based on interaction type
- Post-interaction decompression after Grey Rock practice

### Pattern Analysis Integration
- Identify NPD traits from reality log entries
- Track escalation patterns
- Predict likely behaviors based on history

### Safety Plan Integration
- Link decompression rituals to safety plan
- Emergency contacts accessible from pre-interaction tool
- Boundary matrix linked to interaction types

---

## SUBSCRIPTION TIER GATING

### Foundation (Free)
- Morning Intention: 1 per day
- Reality Log: 5 entries/month
- Pre-Interaction Tool: Basic version (no audio)
- Decompression Ritual: Physical options only
- Affirmations: Default library only
- NPD Traits: Read-only

### Recovery ($15/month)
- Morning Intention: Unlimited
- Reality Log: Unlimited
- Pre-Interaction Tool: Full features with audio
- Decompression Ritual: All options
- Affirmations: Custom creation allowed
- NPD Traits: With annotations
- Streak tracking
- Doubt Buster feature

### Empowered ($24.99/month)
- All Recovery features
- Advanced analytics on routine completion
- Trend analysis on emotional impact
- Accountability partner sharing
- Custom ritual creation
- Priority support for routine guidance

---

## NOTIFICATION & REMINDER SYSTEM

### Optional Notifications

```
Morning Intention:
- Time: User-selected (default 7 AM)
- Message: "Time for your morning intention"
- Action: Open intention module

Pre-Interaction Reminder:
- Trigger: User logs upcoming interaction
- Time: 15 minutes before
- Message: "Prepare for your interaction"
- Action: Open pre-interaction tool

Decompression Reminder:
- Trigger: After interaction logged
- Time: Immediately
- Message: "Let's decompress from that interaction"
- Action: Open decompression ritual

Streak Milestone:
- Trigger: 7-day, 30-day, 100-day streaks
- Message: "You've completed [X] days of [routine]!"
- Action: View streak stats
```

---

## ANALYTICS & REPORTING

### Reality Anchor Routine Dashboard

```
┌──────────────────────────���──────────────────────────────┐
│ YOUR REALITY ANCHOR ROUTINE                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ STREAKS:                                                │
│ Morning Intention:    ████████░░ 8 days                │
│ Reality Log:          ██████░░░░ 6 days                │
│ Pre-Interaction:      ████░░░░░░ 4 days                │
│ Decompression:        ██████████ 10 days               │
│                                                         │
│ THIS WEEK:                                              │
│ Morning Intentions:   7/7 ✓                             │
│ Reality Log Entries:  5 entries                         │
│ Interactions Prepared: 3                                │
│ Decompression Rituals: 3                                │
│                                                         │
│ EMOTIONAL IMPACT:                                       │
│ Average Mood Before Interaction: 6.2/10                │
│ Average Mood After Decompression: 7.8/10               │
│ Improvement: +1.6 points                               │
│                                                         │
│ TOP NPD TRAITS IDENTIFIED:                              │
│ 1. Victim-Playing (8 occurrences)                       │
│ 2. Gaslighting (5 occurrences)                          │
│ 3. Triangulation (3 occurrences)                        │
│                                                         │
│ [VIEW DETAILED ANALYTICS]  [EXPORT REPORT]             │
└─────────────────────────────────────────────────────────┘
```

### Metrics to Track

1. **Routine Completion:**
   - Daily completion rates
   - Streak length
   - Consistency over time

2. **Emotional Impact:**
   - Mood before/after interactions
   - Mood before/after decompression
   - Trend over weeks/months

3. **Pattern Recognition:**
   - Most common NPD traits
   - Escalation patterns
   - Trigger identification

4. **Engagement:**
   - Feature usage frequency
   - Time spent in each module
   - Affirmation preferences

---

## TECHNICAL IMPLEMENTATION NOTES

### Frontend Stack
- React/Next.js components
- Tailwind CSS for styling
- Framer Motion for animations (armor visualization, breathing guide)
- React Query for data fetching
- Zustand for state management

### Backend Stack
- Supabase for database & auth
- Edge functions for API endpoints
- Real-time subscriptions for streak updates
- Scheduled functions for daily reminders

### Security Considerations
- Reality log entries encrypted at rest
- Password protection for sensitive entries
- User-controlled privacy settings
- No data sharing without explicit consent

### Performance Optimization
- Lazy load affirmations library
- Cache NPD trait descriptions
- Optimize reality log queries with indexes
- Pagination for large datasets

---

## SUCCESS METRICS

1. **User Adoption:**
   - % of users completing morning intention
   - % of users creating reality log entries
   - % of users using pre-interaction tool

2. **Engagement:**
   - Average streak length
   - Daily active users
   - Feature usage frequency

3. **Therapeutic Outcomes:**
   - Emotional stability improvement
   - Mood trend analysis
   - User-reported clarity on NPD patterns

4. **Retention:**
   - 30-day retention rate
   - Subscription upgrade rate
   - User satisfaction scores

---

## ROLLOUT PLAN

### Phase 1: MVP (Week 1-2)
- Morning Intention module
- Reality Log basic functionality
- NPD Trait Library (read-only)

### Phase 2: Interaction Tools (Week 3-4)
- Pre-Interaction Checklist
- Decompression Ritual Selector
- Basic analytics

### Phase 3: Enhancement (Week 5-6)
- Advanced analytics dashboard
- Affirmation customization
- Streak gamification

### Phase 4: Integration (Week 7+)
- Integration with existing features
- Accountability partner sharing
- Community features

---

## CONCLUSION

The Reality Anchor Routine is the cornerstone of the Reclaim app's therapeutic approach. By implementing these four interconnected practices, users can build the emotional detachment and clarity necessary to heal from narcissistic abuse while maintaining stability for their children.

This feature directly addresses the research's core therapeutic principles and provides daily structure for recovery.
