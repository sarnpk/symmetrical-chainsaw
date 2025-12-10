# Crisis Toolkit - AI Features & Tier Gating

## 🤖 AI-Powered Features

### 1. Personalized Affirmations (All Tiers)
**Endpoint:** `/api/crisis-toolkit/personalize`

Adapts affirmations based on user history:
- Acknowledges resilience: "You've gotten through this 5 times before"
- Personalizes tone while keeping core safety message
- Falls back to static affirmation if AI fails

**Example:**
```
Static: "My anxiety is loud, not necessarily accurate"
AI: "You've faced this anxiety 3 times this week and survived each time. 
     Your anxiety is loud, but you know it's not accurate. You're safe."
```

### 2. Manual Thought Labeling (OCD)
When using the "Label the Thought" skill for OCD:
- User types their intrusive thought in a text box
- Externalizes the thought by writing it down
- System labels it as "sticky/intrusive thought"
- Helps create distance from the thought
- Saved in session notes for tracking

### 3. Guided Voice Affirmations 🎙️
Self-compassion affirmations can be:
- Read aloud by text-to-speech
- Calming, slow pace (0.85x speed)
- Hands-free listening during crisis
- Helps internalize the message
- Available for all affirmations

### 4. AI Skill Recommendations (Recovery Tier Only) ✨
**Endpoint:** `/api/crisis-toolkit/recommend`

Generates 3 unique, personalized coping skills:

1. **History-Based Skill** - Based on what worked before
2. **Innovative Technique** - Something new to try
3. **Abuse-Specific Skill** - Tailored for narcissistic abuse survivors

**AI analyzes:**
- User's skill effectiveness history
- Current intensity level (1-10)
- Time of day
- Context/situation
- Past ratings and usage patterns

**Example Recommendations:**

```json
[
  {
    "name": "The Anchor Breath",
    "description": "Place one hand on your heart, one on your belly. Breathe in for 4, hold for 2, out for 6. Repeat 3 times while saying 'I am here, I am safe.'",
    "why": "Your history shows breathing techniques work well for you at this intensity. The physical touch adds grounding.",
    "duration": 60
  },
  {
    "name": "Reality Timestamp",
    "description": "Look at your phone. Say out loud: 'It is [time] on [date]. I am [location]. This is real.' Take a photo of where you are right now.",
    "why": "Creates a concrete anchor to present reality, especially powerful when flashbacks blur past and present.",
    "duration": 45
  },
  {
    "name": "The Boundary Shield",
    "description": "Visualize a protective shield around you. Say: 'Their chaos is not my emergency. I choose peace.' Cross your arms over your chest protectively.",
    "why": "Specifically designed for survivors of narcissistic abuse - reinforces boundaries and separates their emotions from yours.",
    "duration": 30
  }
]
```

## 🎯 Tier-Based Access

### Foundation Tier (Free)
- ✅ Basic toolkit access
- ✅ All 5 condition types
- ✅ Static skills (15 total)
- ✅ Personalized affirmations
- ⚠️ **10 uses per month**
- ❌ No AI skill recommendations

### Healing Tier
- ✅ Everything in Foundation
- ✅ **30 uses per month**
- ❌ No AI skill recommendations

### Recovery Tier (Premium)
- ✅ **Unlimited uses**
- ✅ **AI Skill Recommendations** ✨
- ✅ Personalized coping strategies
- ✅ History-based insights
- ✅ Abuse-specific techniques

## 📊 Usage Limits

**Monthly Reset:** 1st of each month

**Limits:**
- Foundation: 10 sessions/month
- Healing: 30 sessions/month
- Recovery: Unlimited

**What counts as a "use":**
- Completing a full toolkit session (from condition selection to rating)
- Logging is blocked when limit reached
- Viewing history doesn't count

**UI Indicators:**
- Shows remaining uses on main page
- Warning when < 3 uses left
- Upgrade prompt when limit reached

## 🔧 Technical Implementation

### Tier Check (All Endpoints)
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('subscription_tier')
  .eq('id', user.id)
  .single();

const tier = profile?.subscription_tier || 'foundation';
```

### Usage Counting
```typescript
const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const { count } = await supabase
  .from('crisis_toolkit_logs')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', user.id)
  .gte('created_at', startOfMonth.toISOString());
```

### AI Recommendation Gating
```typescript
if (profile?.subscription_tier !== 'recovery') {
  return NextResponse.json({ 
    error: 'This feature requires Recovery tier',
    requiredTier: 'recovery'
  }, { status: 403 });
}
```

## 🎨 UI/UX

### AI Recommendations Button
- Only visible to Recovery tier users
- Gradient purple-to-pink styling
- ✨ Sparkle emoji indicator
- Appears in skills section

### Usage Counter
- Displayed on main page
- Color-coded:
  - Green: > 3 uses remaining
  - Red: < 3 uses remaining
- Shows upgrade link when low

### Upgrade Prompts
- Appears when limit reached
- Links to `/pricing`
- Non-intrusive, helpful tone

## 🚀 AI Prompt Engineering

The AI recommendation prompt includes:
- User's condition type
- Current intensity (1-10)
- Time of day context
- User's skill history with ratings
- Specific instructions for narcissistic abuse recovery
- JSON format requirements

**Safety measures:**
- AI generates NEW skills, not medical advice
- Always actionable and time-bound
- Trauma-informed language
- Focuses on grounding and regulation

## 📈 Future AI Enhancements

### Phase 2 (Planned)
- [ ] Pattern detection ("You need this on Sunday evenings")
- [ ] Preventive suggestions ("Practice before bed?")
- [ ] Check-ins ("3 uses today - want to talk?")
- [ ] Skill effectiveness predictions
- [ ] Personalized skill ordering

### Phase 3 (Future)
- [ ] Voice-guided AI coach
- [ ] Real-time intensity tracking
- [ ] Integration with journal patterns
- [ ] Community-sourced skill library
- [ ] Therapist collaboration features

## 🔒 Privacy & Ethics

**Data Usage:**
- AI only sees anonymized usage patterns
- No personal information in prompts
- Skills stored locally, not shared
- User controls all data

**Ethical Guidelines:**
- AI enhances, never replaces therapy
- Clear tier boundaries
- No manipulation or upselling
- Crisis resources always available
- Transparent about AI limitations

## 📞 Error Handling

**AI Failures:**
- Falls back to static skills
- Logs error for monitoring
- User sees graceful message
- Doesn't block core functionality

**Tier Violations:**
- Clear error messages
- Upgrade path provided
- No data loss
- Preserves user progress

## ✅ Testing Checklist

- [ ] Foundation tier sees usage limit
- [ ] Healing tier has 30 uses
- [ ] Recovery tier is unlimited
- [ ] AI button only shows for Recovery
- [ ] AI recommendations are unique
- [ ] Recommendations are actionable
- [ ] Usage counter updates correctly
- [ ] Upgrade prompts appear when needed
- [ ] Limits reset monthly
- [ ] Error handling works

## 🎯 Value Proposition

**Why upgrade to Recovery?**
- Unlimited crisis support (no counting)
- AI-powered personalized skills
- Techniques tailored to YOUR history
- Abuse-specific coping strategies
- Peace of mind in crisis moments

**Pricing suggestion:**
- Foundation: Free (10/month)
- Healing: $9.99/month (30/month)
- Recovery: $19.99/month (unlimited + AI)
