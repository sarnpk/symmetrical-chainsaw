# Crisis Toolkit Feature - Implementation Complete

## Overview
A hybrid static + AI-powered mental health intervention system providing quick-access coping strategies for anxiety, depression, PTSD, social anxiety, and OCD.

## Features Implemented

### 1. Database Schema
**File:** `supabase/migrations/20250907_crisis_toolkit.sql`

Tables:
- `crisis_toolkit_logs` - Tracks each toolkit usage session
- `user_favorite_interventions` - Stores user's most effective techniques

### 2. Static Intervention Data
**File:** `src/lib/crisis-toolkit-data.ts`

Evidence-based interventions for 5 conditions:
- **Anxiety**: Cold water reset, 4-6 breathing, 5-4-3 grounding
- **Depression**: Hydration, sunlight exposure, micro tasks
- **PTSD**: Color grounding, physical grounding, present moment statements
- **Social Anxiety**: Voice steadying, eye contact practice, act opposite
- **OCD**: Thought labeling, compulsion delay, exposure response

Each intervention includes:
- Rule-out question (safety check)
- 3-4 interactive skills
- Self-compassion affirmation
- Future vision statement

### 3. API Routes

#### `/api/crisis-toolkit/log` (POST/GET)
- Logs toolkit usage sessions
- Retrieves user history
- Tracks skills used and ratings

#### `/api/crisis-toolkit/personalize` (POST)
- AI-powered affirmation personalization
- Uses Gemini AI to adapt messages based on user history
- Acknowledges resilience for repeat users

#### `/api/crisis-toolkit/stats` (GET)
- Returns usage statistics
- Condition breakdown
- Average helpfulness ratings
- Resilience tracking ("You've gotten through this X times")

### 4. Main Page
**File:** `src/app/crisis-toolkit/page.tsx`

Interactive flow:
1. **Condition Selection** - Choose what you're experiencing
2. **Rule-Out Check** - Safety assessment question
3. **Skills Practice** - Interactive techniques with timers
4. **Affirmation** - Personalized self-compassion statement
5. **Rating & Completion** - Track effectiveness

Features:
- Built-in timers for timed exercises (30s, 60s, 120s)
- Visual progress tracking
- Skill completion checkmarks
- Resilience counter

### 5. Quick Access Widget
**File:** `src/components/CrisisToolkitWidget.tsx`

- Floating button (bottom-right corner)
- Available on all pages
- Expandable info card
- 🆘 emoji for instant recognition

### 6. Dashboard Card
**File:** `src/components/CrisisToolkitCard.tsx`

- Shows resilience stats
- Quick access from dashboard
- Gradient design for visibility

## How It Works

### Static Foundation (Safety First)
All core interventions are pre-validated and static:
- No AI hallucination risk during crisis
- Consistent, evidence-based techniques
- Works offline (after first load)
- Fast response time

### AI Enhancement Layer
AI personalizes the experience:
- Adapts affirmation language to user history
- Acknowledges resilience ("You've used this 5 times before")
- Maintains core message safety
- Only enhances, never generates from scratch

## Usage Flow

```
User clicks 🆘 button
  ↓
Selects condition (anxiety, depression, etc.)
  ↓
Answers rule-out question
  ↓
Chooses and practices skills
  ↓
Reads personalized affirmation
  ↓
Rates helpfulness
  ↓
Session logged, stats updated
```

## Integration Points

### Add to Dashboard
```tsx
import CrisisToolkitCard from '@/components/CrisisToolkitCard';

// In your dashboard component:
<CrisisToolkitCard />
```

### Widget Already Active
The floating 🆘 button is automatically available on all pages via the root layout.

## Database Migration

Run the migration:
```bash
# Apply to Supabase
supabase db push
```

Or manually execute:
```sql
-- Run the contents of:
supabase/migrations/20250907_crisis_toolkit.sql
```

## Environment Variables Required

```env
GEMINI_API_KEY=your_gemini_api_key
```

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini Pro
- **Styling**: Tailwind CSS

## Key Design Decisions

1. **Hybrid Approach**: Static interventions + AI personalization
   - Safety: Core content never AI-generated
   - Engagement: Personalized to user's journey

2. **Progressive Enhancement**: Works without AI
   - If AI fails, shows static affirmation
   - Graceful degradation

3. **Privacy First**: All data user-scoped
   - RLS policies enforce data isolation
   - No cross-user data sharing

4. **Mobile Optimized**: Touch-friendly, responsive
   - Large tap targets
   - Readable text sizes
   - Gradient backgrounds for visibility

## Future Enhancements (Phase 2+)

- [ ] Pattern detection ("You tend to need this on Sunday evenings")
- [ ] Preventive suggestions ("Would you like to practice before bed?")
- [ ] Community sharing (optional, anonymous)
- [ ] Offline PWA support
- [ ] Voice-guided exercises
- [ ] Breathing animation visualizations
- [ ] Integration with journal entries
- [ ] Crisis plan builder

## Testing Checklist

- [ ] Database migration applied
- [ ] Widget appears on all pages
- [ ] Can select each condition type
- [ ] Timers work correctly
- [ ] Skills can be marked as used
- [ ] Affirmations display properly
- [ ] Rating system saves to database
- [ ] Stats update after session
- [ ] Personalization API works
- [ ] Mobile responsive
- [ ] Works without JavaScript (graceful degradation)

## Support

For issues or questions:
1. Check database migration is applied
2. Verify GEMINI_API_KEY is set
3. Check browser console for errors
4. Review Supabase logs for API errors

## License & Attribution

Based on evidence-based DBT/CBT techniques. Interventions adapted from:
- Dialectical Behavior Therapy (DBT)
- Cognitive Behavioral Therapy (CBT)
- Trauma-informed care practices
