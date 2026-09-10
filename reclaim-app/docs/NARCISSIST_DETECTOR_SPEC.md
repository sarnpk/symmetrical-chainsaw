# Narcissist Detector Feature Specification

## Overview
A sophisticated AI-powered tool that analyzes text/conversations to identify narcissistic personality patterns, classify narcissist types, detect manipulation tactics, and predict likely narcissistic responses based on real conversation context.

---

## Phase 1: Narcissist Type Detector

### 1.1 Feature: Message/Conversation Analyzer

**Purpose**: Analyze text input to identify narcissistic traits and classify narcissist type

**Input Methods**:
1. **Paste Message** - Single message or email
2. **Paste Conversation** - Full conversation thread
3. **Describe Interaction** - User describes what happened
4. **Upload Screenshot** - Image of conversation (OCR)
5. **Voice Input** - Transcribe conversation description

**Analysis Output**:
```
Primary Classification:
â”œâ”€ Narcissist Type: Covert Narcissist
â”œâ”€ Confidence: 85%
â”œâ”€ Secondary Types: Vulnerable (45%), Communal (30%)
â”‚
Traits Detected (with confidence scores):
â”œâ”€ Gaslighting: 92% (HIGH)
â”œâ”€ Victim Mentality: 88% (HIGH)
â”œâ”€ Passive Aggression: 75% (MEDIUM)
â”œâ”€ Love-bombing: 65% (MEDIUM)
â”œâ”€ Hoovering: 72% (MEDIUM)
â”œâ”€ Triangulation: 35% (LOW)
â”œâ”€ Projection: 80% (HIGH)
â””â”€ Devaluation: 55% (MEDIUM)

Manipulation Tactics Identified:
â”œâ”€ Emotional Manipulation
â”œâ”€ Guilt-Tripping
â”œâ”€ Playing the Victim
â”œâ”€ Subtle Criticism
â””â”€ Invalidation

Severity Score: 7/10
â”œâ”€ Emotional Impact: HIGH
â”œâ”€ Manipulation Intensity: MEDIUM-HIGH
â”œâ”€ Predictability: MEDIUM

Key Phrases Detected:
â”œâ”€ "You're too sensitive" (Gaslighting)
â”œâ”€ "I'm the real victim here" (Victim mentality)
â”œâ”€ "Nobody understands me like you do" (Love-bombing)
â””â”€ [More phrases...]

Recommended Response Strategy:
â”œâ”€ Primary: Grey Rock Technique
â”œâ”€ Secondary: BIFF Communication
â””â”€ Avoid: Direct confrontation, emotional engagement
```

---

### 1.2 Narcissist Type Classification

**Types to Detect**:

#### **Overt Narcissist**
- **Traits**: Grandiosity, entitlement, dominance, explicit superiority
- **Language Markers**: 
  - "I'm the best at..."
  - "You're lucky to have me"
  - Direct criticism and contempt
  - Boasting and name-dropping
- **Confidence Indicators**: Explicit self-praise, direct commands, dismissive tone

#### **Covert Narcissist**
- **Traits**: Victim mentality, passive-aggression, hidden superiority, hypersensitivity
- **Language Markers**:
  - "Nobody understands me"
  - "I'm the real victim"
  - Subtle criticism disguised as concern
  - Sarcasm and indirect attacks
- **Confidence Indicators**: Victim language, passive-aggressive tone, false modesty

#### **Malignant Narcissist**
- **Traits**: Sadism, cruelty, lack of empathy, vindictiveness, antisocial behavior
- **Language Markers**:
  - Deliberate cruelty
  - Threats or intimidation
  - Complete lack of remorse
  - Enjoyment of others' pain
- **Confidence Indicators**: Cruel language, threats, sadistic comments

#### **Vulnerable/Fragile Narcissist**
- **Traits**: Extreme sensitivity to criticism, shame-based, defensive
- **Language Markers**:
  - "You hurt me so badly"
  - Extreme reactions to minor criticism
  - Defensive explanations
  - Playing victim after criticism
- **Confidence Indicators**: Defensive tone, victim language, shame-based responses

#### **Communal Narcissist**
- **Traits**: False altruism, hidden superiority, fake humility
- **Language Markers**:
  - "I'm so generous/helpful"
  - False modesty ("I'm nothing special, but...")
  - Bragging disguised as helping others
  - Moral superiority
- **Confidence Indicators**: False humility, hidden boasting, moral superiority

#### **Somatic Narcissist**
- **Traits**: Obsession with appearance, body, sexuality
- **Language Markers**:
  - Constant references to appearance
  - Sexual comments or advances
  - Criticism of others' appearance
  - Vanity-focused language
- **Confidence Indicators**: Appearance-focused language, sexual references

---

### 1.3 Trait Detection Engine

**Core Traits to Detect**:

| Trait | Definition | Language Markers | Detection Method |
|-------|-----------|------------------|------------------|
| **Gaslighting** | Denying reality, making victim question sanity | "That never happened", "You're crazy", "You're too sensitive" | Denial phrases, reality distortion |
| **Love-bombing** | Excessive praise and attention | "You're perfect", "I've never felt this way", "You complete me" | Superlatives, intensity, future promises |
| **Hoovering** | Sudden contact after silence, trying to suck back in | "I miss you", "I've changed", "Let's try again" | Sudden contact, false change claims |
| **Triangulation** | Bringing third party into conflict | "My ex was better", "Everyone agrees with me" | Third-party references, comparisons |
| **Projection** | Accusing others of their own behaviors | "You're the narcissist", "You're manipulative" | Accusation reversal, blame-shifting |
| **Devaluation** | Sudden criticism and contempt | "You're worthless", "I never loved you" | Contempt language, sudden criticism |
| **Victim Mentality** | Playing victim, seeking sympathy | "I'm the real victim", "Nobody understands me" | Victim language, sympathy-seeking |
| **Passive Aggression** | Indirect hostility | Sarcasm, backhanded compliments, silent treatment | Sarcasm detection, indirect criticism |
| **Rage/Narcissistic Injury** | Extreme reaction to criticism | ALL CAPS, threats, explosive anger | Intensity markers, threat language |
| **Lack of Empathy** | Inability to understand others' feelings | "I don't care how you feel", dismissing emotions | Empathy-lacking statements |
| **Entitlement** | Belief they deserve special treatment | "You owe me", "I deserve better" | Entitlement language |
| **Grandiosity** | Exaggerated self-importance | "I'm the best", "Nobody can do it like me" | Self-aggrandizing language |

---

### 1.4 Manipulation Tactic Detection

**Common Tactics**:
- Emotional manipulation
- Guilt-tripping
- Shame-inducing
- Fear-based control
- Isolation tactics
- Financial control
- Sexual manipulation
- Intermittent reinforcement (reward/punishment cycles)
- Smear campaigns
- Flying monkeys (using others against victim)

---

## Phase 2: Context-Based Prediction (Simulator Foundation)

### 2.1 Feature: Conversation Context Analyzer

**Input**: 
- Real conversation history with narcissist
- Current message/situation
- Narcissist type (detected or user-selected)
- Scenario context

**Output**:
```
Likely Narcissistic Responses (ranked by probability):

1. Gaslighting Response (72% probability)
   "That's not what happened. You're misremembering again."
   â””â”€ Reasoning: Pattern of denying reality in past messages
   â””â”€ Emotional Impact: HIGH - Causes self-doubt

2. Victim Mentality Response (65% probability)
   "After everything I've done for you, this is how you treat me?"
   â””â”€ Reasoning: History of playing victim when confronted
   â””â”€ Emotional Impact: MEDIUM - Induces guilt

3. Devaluation Response (58% probability)
   "You're not as special as you think you are."
   â””â”€ Reasoning: Pattern of sudden criticism after intimacy
   â””â”€ Emotional Impact: HIGH - Causes shame

4. Hoovering Response (45% probability)
   "I miss you. I've been thinking about us. Can we talk?"
   â””â”€ Reasoning: Previous hoovering attempts after conflict
   â””â”€ Emotional Impact: MEDIUM - Confuses victim

Recommended Counter-Strategies:
â”œâ”€ Grey Rock: "Okay. I need to focus on other things."
â”œâ”€ BIFF: "I understand you feel that way. I'm moving forward."
â””â”€ No Contact: Consider limiting communication
```

---

### 2.2 Feature: Pattern Recognition Over Time

**Tracks**:
- Recurring manipulation tactics
- Escalation patterns
- Cycle timing (love-bombing â†’ devaluation â†’ hoovering)
- Trigger identification
- Response effectiveness

**Output**:
```
Narcissistic Cycle Detected:
â”œâ”€ Phase 1: Love-bombing (Days 1-7)
â”œâ”€ Phase 2: Devaluation (Days 8-21)
â”œâ”€ Phase 3: Discard (Days 22-28)
â””â”€ Phase 4: Hoovering (Days 29+)

Cycle Duration: ~30 days
Next Predicted Phase: Hoovering (in 3-5 days)
Recommended Preparation: Strengthen boundaries, prepare Grey Rock responses
```

---

## Phase 3: Narcissist Simulator (Future)

### 3.1 Live Chat Simulator

**User Flow**:
1. Select narcissist type
2. Choose scenario (breakup, custody, confrontation, etc.)
3. Optionally paste real conversation for context
4. Start live chat with AI narcissist
5. AI responds with realistic narcissistic patterns
6. Real-time analysis of tactics being used
7. Suggested responses from AI Coach

**Safety Features**:
- Emotional check-ins every 5 minutes
- Immediate exit option
- Crisis resources always visible
- Cooldown recommendations
- Session limits

---

## Technical Architecture

### 3.1 Backend Components

```
/api/narcissist-detector/
â”œâ”€ /analyze-message (POST)
â”‚  â”œâ”€ Input: text, context
â”‚  â”œâ”€ Process: Trait detection, type classification
â”‚  â””â”€ Output: Analysis report
â”‚
â”œâ”€ /predict-response (POST)
â”‚  â”œâ”€ Input: conversation history, narcissist type
â”‚  â”œâ”€ Process: Pattern matching, probability scoring
â”‚  â””â”€ Output: Predicted responses with reasoning
â”‚
â”œâ”€ /detect-type (POST)
â”‚  â”œâ”€ Input: conversation or description
â”‚  â”œâ”€ Process: Type classification
â”‚  â””â”€ Output: Type with confidence scores
â”‚
â””â”€ /analyze-conversation (POST)
   â”œâ”€ Input: full conversation thread
   â”œâ”€ Process: Pattern analysis, cycle detection
   â””â”€ Output: Comprehensive analysis report
```

### 3.2 AI Prompting Strategy

**System Prompt Template**:
```
You are an expert in narcissistic personality patterns and manipulation tactics.
Your role is to analyze text for narcissistic traits and behaviors.

Analyze the provided text for:
1. Narcissistic traits (gaslighting, love-bombing, etc.)
2. Narcissist type classification
3. Manipulation tactics
4. Severity assessment
5. Recommended responses

Provide confidence scores (0-100%) for each detection.
Be specific with examples from the text.
Explain your reasoning for each classification.
```

---

## Database Schema

```sql
-- Narcissist Detector Analysis
CREATE TABLE narcissist_analyses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  input_text TEXT,
  input_type ENUM('message', 'conversation', 'description', 'screenshot'),
  
  -- Classification
  primary_type VARCHAR(50),
  primary_confidence DECIMAL(3,2),
  secondary_types JSONB, -- [{type, confidence}, ...]
  
  -- Traits
  traits_detected JSONB, -- {trait_name: confidence, ...}
  manipulation_tactics JSONB,
  
  -- Analysis
  severity_score INT (1-10),
  key_phrases JSONB,
  recommended_strategies JSONB,
  
  -- Metadata
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  conversation_id UUID REFERENCES ai_conversations(id)
);

-- Conversation Pattern Analysis
CREATE TABLE conversation_patterns (
  id UUID PRIMARY KEY,
  user_id UUID,
  conversation_id UUID,
  
  -- Pattern data
  detected_cycles JSONB,
  recurring_tactics JSONB,
  escalation_indicators JSONB,
  trigger_patterns JSONB,
  
  -- Predictions
  predicted_responses JSONB,
  next_phase_prediction VARCHAR(50),
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## UI/UX Components

### 4.1 Detector Interface

**Main Page**:
- Input method selector (Paste/Upload/Describe/Voice)
- Text input area with character counter
- "Analyze" button
- Loading state with progress
- Results display with tabs:
  - Overview
  - Traits
  - Tactics
  - Recommendations
  - Key Phrases

**Results Display**:
- Type classification with confidence
- Trait breakdown with visual indicators
- Severity gauge
- Recommended responses
- Educational insights
- Export/Save option

### 4.2 Conversation Analyzer

**Interface**:
- Paste full conversation
- Select narcissist type (auto-detect or manual)
- Timeline view of conversation
- Pattern visualization
- Cycle detection display
- Prediction panel

---

## Safety & Ethical Considerations

### 5.1 Content Warnings
- "This tool analyzes for narcissistic patterns. It's educational, not diagnostic."
- "If you're in immediate danger, call emergency services."
- Crisis hotline always visible

### 5.2 Limitations Disclaimer
- Not a professional diagnosis
- AI can make mistakes
- Should not replace therapy
- For educational purposes only

### 5.3 User Protections
- Option to delete analyses
- Privacy controls
- No sharing without consent
- Secure storage of sensitive data

---

## Implementation Roadmap

### Phase 1: MVP (Week 1-2)
- [ ] Basic message analyzer
- [ ] Trait detection (5 core traits)
- [ ] Type classification (3 main types)
- [ ] Simple UI

### Phase 2: Enhanced Detection (Week 3-4)
- [ ] All 12 traits
- [ ] All 6 narcissist types
- [ ] Confidence scoring
- [ ] Key phrase extraction

### Phase 3: Conversation Analysis (Week 5-6)
- [ ] Multi-message analysis
- [ ] Pattern detection
- [ ] Cycle identification
- [ ] Response prediction

### Phase 4: Simulator Foundation (Week 7-8)
- [ ] Scenario builder
- [ ] AI narcissist engine
- [ ] Real-time analysis
- [ ] Safety features

---

## Success Metrics

- Accuracy of type detection (validated against expert assessments)
- User satisfaction with analysis
- Trait detection precision/recall
- Prediction accuracy for responses
- User engagement and retention
- Safety incident rate (should be zero)

---

## Notes

- Start with text analysis, expand to voice/image later
- Use Google Generative AI for analysis
- Implement caching for common patterns
- Build educational content alongside tool
- Gather user feedback for continuous improvement
