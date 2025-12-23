# Crisis Reframe - Feature Specification

## 🚨 Overview

**Crisis Reframe** is an AI-powered immediate panic intervention tool designed to help survivors process acute emotional distress when experiencing triggering narcissistic behaviors (discard, rage, hoovering, silent treatment, etc.). 

**Key Innovation**: Uses AI to generate personalized, hope-building narratives that help users:
- Reframe the crisis as a normal narcissist pattern (not personal failure)
- Visualize a positive future beyond this moment
- Build realistic hope while breaking trauma bonds
- Tolerate grief without spiraling into panic
- See the situation from a healthier perspective

Unlike conversational AI tools, this provides instant, structured reframing with AI-generated hope narratives tailored to the user's specific situation.

---

## 🎯 Core Problem

When narcissistic abuse survivors experience triggering events (discard, rage, silent treatment), they often:
- **Panic and spiral** into catastrophic thinking
- **Blame themselves** ("What did I do wrong?")
- **Lose hope** about their future
- **Fantasize about reconciliation** (trauma bond activation)
- **Feel out of control** emotionally (THE BIGGEST DANGER)
- **Can't see past the pain** to imagine healing
- **Make impulsive decisions** (texting, begging, reacting)

**Crisis Reframe solves this by**:
1. **Restoring sense of control** - "You're in control right now"
2. Immediately normalizing the narcissist's behavior
3. Validating the user's pain
4. AI-generating a personalized hope narrative
5. Reframing the situation to break trauma bonds
6. **Preventing loss of control** through grounding
7. **Showing them their power** in this moment

---

## 🧠 AI-Powered Hope Building

### The Hope Paradox
Survivors need hope, but the WRONG kind of hope (reconciliation, narcissist changing) strengthens trauma bonds. The RIGHT kind of hope (healing, freedom, better future) breaks them.

### AI Hope Generation Strategy

**Input**: User's crisis situation + context
**Output**: Personalized hope narrative that:

1. **RESTORES CONTROL FIRST** ("You are in control right now. You're choosing to pause and think.")
2. **Acknowledges the pain** ("This hurts deeply, and that's valid")
3. **Normalizes the behavior** ("This is textbook narcissist discard - it's not about you")
4. **Reframes the meaning** ("This isn't rejection, it's liberation starting")
5. **Paints a realistic future** ("6 months from now, you'll see this as the day your healing accelerated")
6. **Provides immediate comfort** ("Right now, you just need to breathe and survive this moment")
7. **Builds healthy hope** ("You're going to build a life where this kind of pain doesn't exist")
8. **REINFORCES CONTROL** ("You have the power to choose your next move. You're not helpless.")

---

## 🎨 User Experience Flow

### Step 1: Crisis Selection
User selects what just happened:
- 💔 **Discard/Breakup** - "They suddenly ended it"
- 🔥 **Narcissistic Rage** - "They exploded at me"
- 🤐 **Silent Treatment** - "They're ignoring me"
- 💌 **Hoovering** - "They're trying to come back"
- 😢 **Devaluation** - "They're treating me terribly"
- 🎭 **Gaslighting** - "They're denying reality"
- 🔄 **Cycle Repeat** - "It's happening again"
- 🆘 **Other Crisis** - Custom input

### Step 2: Quick Context (2-3 questions max)
**Example for Discard**:
1. "How long were you together?" (dropdown: weeks/months/1-2yr/3-5yr/5+yr)
2. "Is this the first time?" (Yes/No/It's complicated)
3. "One word for how you feel right now?" (text input)

### Step 3: AI Processing (2-3 seconds)
Loading screen with calming messages:
- "Taking a breath with you..."
- "Gathering your strength..."
- "Preparing your reframe..."

### Step 4: The Reframe (AI-Generated)

**Structure**:

```
┌─────────────────────────────────────────┐
│  ✋ YOU ARE IN CONTROL RIGHT NOW        │
│  [AI establishes control immediately]   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🫂 WHAT YOU'RE FEELING IS REAL         │
│  [AI validates their specific pain]     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🎯 WHAT THIS ACTUALLY IS               │
│  [AI explains the narcissist pattern]   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  💡 THE REFRAME                         │
│  [AI reframes the meaning]              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🌅 YOUR FUTURE (Hope Narrative)        │
│  [AI paints realistic positive future]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  �️ RIGHT NIOW, YOU NEED TO...          │
│  [Immediate grounding actions]          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  💪 YOUR POWER IN THIS MOMENT           │
│  [Control reinforcement + affirmation]  │
└─────────────────────────────────────────┘
```

### Step 5: Save & Revisit
- Save this reframe to revisit when panic returns
- Add to "Crisis Survival Kit"
- Share with therapist (optional)

---

## 📝 AI Prompt Engineering

### System Prompt for Crisis Reframe AI

```
You are a trauma-informed crisis counselor specializing in narcissistic abuse recovery. 
Your role is to provide immediate emotional stabilization through reframing.

PRIMARY OBJECTIVE: RESTORE USER'S SENSE OF CONTROL AND PREVENT PANIC SPIRALING

CRITICAL RULES:
1. START by establishing control: "You are in control right now"
2. PREVENT impulsive reactions (texting, begging, confronting)
3. NEVER suggest reconciliation or that the narcissist will change
4. ALWAYS validate the user's pain (but after establishing control)
5. Build hope around THEIR future, not the relationship
6. Use concrete, specific language (not generic platitudes)
7. Normalize the narcissist's behavior as predictable patterns
8. Break trauma bonds by reframing the meaning
9. Provide immediate grounding, not long-term advice
10. Keep tone warm, direct, and confident
11. Use "you" language to make it personal
12. Paint a vivid but realistic positive future
13. END by reinforcing their power and control

STRUCTURE YOUR RESPONSE:
1. Control Establishment (2 sentences: "You are in control. You're safe.")
2. Validation (2-3 sentences acknowledging their specific pain)
3. Pattern Recognition (2-3 sentences explaining the narcissist behavior)
4. Reframe (3-4 sentences changing the meaning)
5. Hope Narrative (4-5 sentences painting their future)
6. Immediate Actions (3-4 bullet points - focus on control)
7. Power Statement (2 sentences reinforcing their control + affirmation)

CONTROL LANGUAGE TO USE:
- "You are in control right now"
- "You have the power to choose"
- "You're not helpless - you're pausing to think"
- "This feeling will pass, and you'll still be in control"
- "You decide what happens next"
- "Your response is your power"

TONE: Compassionate but strong. Like a wise friend who's been through this.
LENGTH: 250-350 words total
```

### Example AI-Generated Reframe

**Crisis**: Discard after 2 years, first time, feeling "shattered"

**AI Output**:

```
✋ YOU ARE IN CONTROL RIGHT NOW

Stop. Breathe. You are in control of this moment. You're reading this instead 
of reacting, which means you're already making a powerful choice. You're safe.

🫂 WHAT YOU'RE FEELING IS REAL

You feel shattered because someone you loved just vanished like you never mattered. 
The pain is crushing because you invested 2 years of your heart, and now you're 
questioning everything. This grief is real, and you're not overreacting. The urge 
to text them, to fix this, to understand - that's normal. But you don't have to act on it.

🎯 WHAT THIS ACTUALLY IS

This is a narcissistic discard - a predictable pattern where they devalue and 
discard when you're no longer serving their needs. It's not about anything you 
did or didn't do. It's about their inability to sustain genuine connection. 
This was always coming because narcissists cycle through people. You couldn't 
have prevented this by being "better."

💡 THE REFRAME

This isn't rejection - it's liberation you didn't know you needed. What feels 
like an ending is actually the beginning of getting yourself back. The person 
you're grieving never existed; you're mourning the illusion they sold you. 
The real tragedy would be staying and losing more years to this cycle. Right 
now, you're free - even though it doesn't feel like it yet.

🌅 YOUR FUTURE (6 Months From Now)

Six months from now, you'll wake up and realize you haven't thought about them 
in days. You'll be laughing with friends, pursuing dreams you'd forgotten, and 
feeling lighter than you have in years. You'll meet someone who treats you with 
basic respect and think, "Wow, I almost settled for crumbs." You'll look back 
at today and see it as the day your real life started. The pain you feel right 
now is temporary; the freedom you're gaining is permanent. You'll be proud of 
yourself for not texting them today.

🛡️ RIGHT NOW, YOU NEED TO...

• Put your phone in another room (remove the temptation to text)
• Call someone who loves you - don't be alone with this
• Write down 3 things they did that hurt you (reality anchor)
• Drink water, eat something, take a shower (body care = self-care)
• Set a timer for 10 minutes - just survive 10 minutes at a time

💪 YOUR POWER IN THIS MOMENT

You have the power to choose your next move. You can choose not to text them. 
You can choose to sit with this pain instead of running back to the source of it. 
You're not losing someone who loved you - you're escaping someone who couldn't. 
And right now, in this moment, you're in control.
```

---

## 🎮 Control Restoration Techniques

### The Control Crisis
When users are in panic, they feel **powerless**. This leads to:
- Impulsive texting/calling the narcissist
- Begging or apologizing
- Making promises to change
- Accepting blame
- Breaking no-contact

**Our Goal**: Restore their sense of control BEFORE they make decisions they'll regret.

### Multi-Layer Control Restoration

#### Layer 1: Immediate Control Statement (First 2 seconds)
```
✋ YOU ARE IN CONTROL RIGHT NOW
Stop. Breathe. You are in control of this moment.
```

**Why this works**: 
- Interrupts panic spiral
- Provides immediate anchor
- Shifts focus from "what they did" to "what I can do"

#### Layer 2: Choice Recognition (Throughout reframe)
Remind user they're CHOOSING to:
- Read this instead of texting
- Pause instead of reacting
- Think instead of spiraling
- Seek help instead of isolating

**Language examples**:
- "You're reading this instead of reacting - that's power"
- "You chose to pause - that's control"
- "You're thinking before acting - that's strength"

#### Layer 3: Action Control (Immediate steps)
Give them SPECIFIC actions they CAN control:
- ✅ "Put your phone in another room" (control over impulse)
- ✅ "Set a timer for 10 minutes" (control over time)
- ✅ "Write down 3 things" (control over narrative)
- ✅ "Call someone" (control over isolation)

**NOT vague**: "Try to stay calm" ❌
**SPECIFIC**: "Count to 10 out loud" ✅

#### Layer 4: Future Control (Hope narrative)
Show them they control their FUTURE:
- "You can choose not to text them"
- "You decide what happens next"
- "Your response is your power"
- "You're building the life you want"

#### Layer 5: Power Reinforcement (Final statement)
End with control affirmation:
```
💪 YOUR POWER IN THIS MOMENT
You have the power to choose your next move.
You're not helpless - you're pausing to think.
Right now, in this moment, you're in control.
```

### Interactive Control Elements

#### 1. "I'm In Control" Button
Before showing reframe, user must click:
```
┌─────────────────────────────────────┐
│                                     │
│   [Tap to confirm: I'm in control]  │
│                                     │
└─────────────────────────────────────┘
```
**Why**: Physical action = psychological control

#### 2. Breathing Timer (Optional)
```
Breathe with me:
[Animated circle expanding/contracting]
In... 4... 3... 2... 1...
Out... 4... 3... 2... 1...
```
**Why**: Regulates nervous system = restores control

#### 3. "Don't Text Them" Lock
```
┌─────────────────────────────────────┐
│  ⚠️ WAIT 24 HOURS BEFORE TEXTING   │
│                                     │
│  Set reminder to revisit this       │
│  decision tomorrow                  │
│                                     │
│  [Lock my decision for 24 hours]   │
└─────────────────────────────────────┘
```
**Why**: Prevents impulsive loss of control

#### 4. Control Checklist
After reading reframe:
```
Before you leave, check what you control:

☐ I will not text/call them for the next hour
☐ I will tell one person how I'm feeling
☐ I will write down what happened (reality log)
☐ I will revisit this reframe if panic returns
☐ I will be kind to myself today

[Save My Commitments]
```
**Why**: Concrete commitments = sense of agency

#### 5. "Survived" Counter
```
🏆 You've survived this crisis for:
   [15 minutes] [1 hour] [4 hours] [1 day]
   
   Every minute you don't react is a victory.
```
**Why**: Gamifies control, shows progress

### Control-Focused Language Library

**Instead of**: "You'll be okay"
**Say**: "You're in control of your next move"

**Instead of**: "This will pass"
**Say**: "You have the power to survive this moment"

**Instead of**: "Don't panic"
**Say**: "You're choosing to pause and think - that's control"

**Instead of**: "Stay strong"
**Say**: "You're already showing strength by reading this"

**Instead of**: "You'll get through this"
**Say**: "You're getting through this right now, one choice at a time"

### Panic Prevention Triggers

Detect high-risk situations and add extra control messaging:

**If user mentions**:
- "I need to text them" → Add "Phone Lock" feature
- "I can't breathe" → Add breathing timer
- "I'm going crazy" → Add grounding checklist
- "I want to die" → Add crisis hotline + safety plan
- "I need to see them" → Add "24-hour rule"

### Control Metrics to Track

- Time between crisis and impulsive action (goal: increase)
- Number of times user revisits reframe (shows self-regulation)
- Completion of control checklist
- "Survived" counter duration
- User-reported sense of control (1-10 scale)

---

## 🔧 Technical Implementation

### Database Schema

```sql
CREATE TABLE crisis_reframes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  crisis_type TEXT NOT NULL, -- 'discard', 'rage', 'silent_treatment', etc.
  context_data JSONB, -- User's answers to context questions
  ai_reframe TEXT NOT NULL, -- The full AI-generated reframe
  created_at TIMESTAMP DEFAULT NOW(),
  revisited_count INTEGER DEFAULT 0,
  last_revisited_at TIMESTAMP,
  helpful_rating INTEGER, -- 1-5 stars
  notes TEXT -- User's personal notes
);

CREATE INDEX idx_crisis_reframes_user ON crisis_reframes(user_id);
CREATE INDEX idx_crisis_reframes_type ON crisis_reframes(crisis_type);
```

### API Endpoints

#### POST /api/crisis-reframe/generate
**Request**:
```json
{
  "crisis_type": "discard",
  "context": {
    "duration": "1-2yr",
    "first_time": true,
    "feeling": "shattered"
  }
}
```

**Response**:
```json
{
  "id": "uuid",
  "reframe": {
    "validation": "You feel shattered because...",
    "pattern": "This is a narcissistic discard...",
    "reframe": "This isn't rejection...",
    "hope_narrative": "Six months from now...",
    "immediate_actions": ["Block them...", "Call someone..."],
    "affirmation": "You're not losing someone..."
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### GET /api/crisis-reframe/history
Returns user's saved reframes

#### POST /api/crisis-reframe/:id/revisit
Increments revisit counter

#### POST /api/crisis-reframe/:id/rate
User rates helpfulness (1-5 stars)

---

## 🎨 UI Components

### Crisis Type Selector
```tsx
const crisisTypes = [
  { 
    id: 'discard', 
    icon: '💔', 
    label: 'Discard/Breakup',
    description: 'They suddenly ended it'
  },
  { 
    id: 'rage', 
    icon: '🔥', 
    label: 'Narcissistic Rage',
    description: 'They exploded at me'
  },
  // ... more types
]
```

### Reframe Display
- Smooth fade-in animation
- Calming color palette (soft blues, greens)
- Large, readable text
- Copy-to-clipboard for each section
- Text-to-speech option
- Save button
- "Read this again when panic returns" reminder

### Crisis Survival Kit
- Collection of saved reframes
- Quick access from dashboard
- Offline-capable (PWA)
- Emergency contact integration

---

## 🧪 AI Prompt Variations by Crisis Type

### Discard
Focus: Liberation, not rejection. Future without them is brighter.

### Rage
Focus: Their rage is about their shame, not your worth. You're safe now.

### Silent Treatment
Focus: Silence is manipulation, not mystery. Your peace matters more.

### Hoovering
Focus: They want supply, not you. Stay strong in your boundary.

### Devaluation
Focus: Their opinion is distorted by their disorder. You're not the problem.

### Gaslighting
Focus: Your reality is valid. Trust yourself over their lies.

---

## 📊 Success Metrics

- **Immediate**: User reports feeling calmer (1-5 scale)
- **Short-term**: User revisits reframe instead of contacting narcissist
- **Long-term**: User maintains no-contact after crisis
- **Engagement**: Average revisit count per reframe
- **Satisfaction**: Helpfulness ratings

---

## 🚀 MVP Scope

**Phase 1** (Week 1-2):
- 3 crisis types (discard, rage, silent treatment)
- Basic AI reframe generation
- Simple UI
- Save functionality

**Phase 2** (Week 3-4):
- All 8 crisis types
- Enhanced AI prompts
- Crisis Survival Kit
- Revisit tracking

**Phase 3** (Week 5-6):
- Text-to-speech
- Offline mode
- Therapist sharing
- Analytics dashboard

---

## 🛡️ Safety Considerations

1. **Not a replacement for crisis hotlines** - Include emergency resources
2. **Suicide risk detection** - If user mentions self-harm, show crisis resources
3. **Therapist disclaimer** - "This is peer support, not therapy"
4. **No medical advice** - Avoid diagnosing or prescribing
5. **Privacy** - All reframes are private by default

---

## 💰 Monetization

- **Foundation Tier**: 3 crisis reframes/month
- **Recovery Tier**: 10 crisis reframes/month
- **Empowerment Tier**: Unlimited crisis reframes

---

## 🎯 Key Differentiators

1. **Instant, not conversational** - No waiting for AI to respond
2. **Hope-focused** - Builds healthy hope, not false hope
3. **Trauma-bond breaking** - Actively reframes to break bonds
4. **Personalized** - AI tailors to user's specific situation
5. **Revisitable** - Designed to be read multiple times during panic
6. **Grounding** - Provides immediate actions, not just words

---

## 📱 Mobile-First Design

- Large touch targets
- Minimal scrolling
- Offline-capable
- Quick access from home screen
- Push notifications for revisit reminders

---

## 🔮 Future Enhancements

- **Voice input** for context questions
- **Guided breathing** integration
- **Community support** - Anonymous sharing
- **Therapist collaboration** - Share reframes with therapist
- **Pattern tracking** - Show user their crisis patterns over time
- **Predictive alerts** - "You usually have a crisis on Sundays. Here's your toolkit."

---

## 📚 Related Features

- **AI Coach** - For deeper conversations after crisis passes
- **No Contact Anchor** - For maintaining boundaries post-crisis
- **Reality Log** - For documenting the crisis objectively
- **Narcissist Detector** - For analyzing the behavior that triggered crisis

---

## ✅ Ready to Build?

This spec provides everything needed to build an AI-powered crisis intervention tool that:
- Provides immediate emotional stabilization
- Builds healthy hope (not false hope)
- Breaks trauma bonds through reframing
- Helps users tolerate grief without spiraling
- Gives them a vision of a better future

**Next Step**: Create the implementation plan with API routes, UI components, and AI prompt templates.