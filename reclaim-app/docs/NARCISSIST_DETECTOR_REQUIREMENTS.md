# Narcissist Detector - Requirements & Implementation Plan

## Executive Summary

Build a two-phase feature:
1. **Phase 1 (MVP)**: Narcissist Type Detector - Analyze text to identify narcissistic patterns
2. **Phase 2**: Narcissist Simulator - Live chat practice with AI narcissist using real conversation context

---

## Phase 1: Narcissist Type Detector (MVP)

### User Stories

#### US-1: Analyze Single Message
**As a** survivor
**I want to** paste a message from my narcissist
**So that** I can understand what manipulation tactics they're using

**Acceptance Criteria**:
- [ ] User can paste a single message
- [ ] System analyzes and returns:
  - Primary narcissist type with confidence %
  - Traits detected with confidence scores
  - Manipulation tactics identified
  - Severity score (1-10)
  - Recommended response strategy
- [ ] Results display in clear, readable format
- [ ] User can save/export results

#### US-2: Analyze Full Conversation
**As a** survivor
**I want to** paste an entire conversation thread
**So that** I can see patterns and cycles in their behavior

**Acceptance Criteria**:
- [ ] User can paste multi-message conversation
- [ ] System identifies:
  - Recurring manipulation tactics
  - Narcissistic cycle phases
  - Escalation patterns
  - Trigger identification
- [ ] Timeline view shows conversation flow
- [ ] Pattern visualization (charts/graphs)
- [ ] Predicted next moves based on patterns

#### US-3: Describe Interaction
**As a** survivor
**I want to** describe what happened in my own words
**So that** I can get analysis without needing exact text

**Acceptance Criteria**:
- [ ] User can write description of interaction
- [ ] System analyzes description for narcissistic patterns
- [ ] Returns same analysis as text input
- [ ] Handles natural language descriptions

#### US-4: Auto-Detect Narcissist Type
**As a** survivor
**I want to** let the AI detect the narcissist type
**So that** I don't have to guess or know the terminology

**Acceptance Criteria**:
- [ ] System analyzes text and suggests type
- [ ] Shows confidence % for each type
- [ ] User can override if they know the type
- [ ] Explains why each type was suggested

#### US-5: View Detailed Trait Analysis
**As a** survivor
**I want to** understand each trait detected
**So that** I can learn about narcissistic patterns

**Acceptance Criteria**:
- [ ] Each trait shows:
  - Definition
  - Confidence score
  - Examples from their text
  - Why it matters
  - How to respond
- [ ] Traits are sortable by confidence
- [ ] Educational content for each trait

#### US-6: Get Recommended Responses
**As a** survivor
**I want to** know how to respond to narcissistic messages
**So that** I can protect myself emotionally

**Acceptance Criteria**:
- [ ] System suggests:
  - Grey Rock responses
  - BIFF communication examples
  - What NOT to do
  - Why each strategy works
- [ ] Multiple response options provided
- [ ] Explanations for each recommendation

#### US-7: Save Analysis History
**As a** survivor
**I want to** save my analyses
**So that** I can track patterns over time

**Acceptance Criteria**:
- [ ] Each analysis is saved to user account
- [ ] User can view history
- [ ] Can compare analyses over time
- [ ] Can delete analyses
- [ ] Can export as PDF/document

---

## Phase 2: Narcissist Simulator (Future)

### User Stories

#### US-8: Select Simulator Scenario
**As a** survivor
**I want to** choose a scenario (breakup, custody, confrontation)
**So that** I can practice for a specific situation

**Acceptance Criteria**:
- [ ] Predefined scenarios available:
  - Breakup conversation
  - Custody discussion
  - Confrontation
  - Reconciliation attempt
  - Financial discussion
  - Custom scenario
- [ ] User can select narcissist type
- [ ] User can optionally paste real conversation for context
- [ ] Difficulty levels (easy/medium/hard)

#### US-9: Live Chat with AI Narcissist
**As a** survivor
**I want to** chat with an AI that acts like my narcissist
**So that** I can practice responses in a safe environment

**Acceptance Criteria**:
- [ ] AI responds with realistic narcissistic patterns
- [ ] Responses match selected narcissist type
- [ ] Uses context from real conversation if provided
- [ ] Responds naturally to user inputs
- [ ] Maintains conversation flow

#### US-10: Real-Time Tactic Analysis
**As a** survivor
**I want to** see what tactics the AI is using in real-time
**So that** I can learn to recognize them

**Acceptance Criteria**:
- [ ] Each AI response shows:
  - Tactics being used
  - Manipulation strategy
  - Emotional impact warning
  - Suggested counter-response
- [ ] Highlights key phrases
- [ ] Explains the manipulation

#### US-11: Pause & Reflect
**As a** survivor
**I want to** pause the conversation to think
**So that** I can process what's happening

**Acceptance Criteria**:
- [ ] User can pause at any time
- [ ] AI Coach provides:
  - Analysis of what just happened
  - Suggested responses
  - Emotional check-in
  - Grounding techniques if needed
- [ ] User can resume or exit

#### US-12: Safety Features
**As a** survivor
**I want to** feel safe during the simulator
**So that** I don't get re-traumatized

**Acceptance Criteria**:
- [ ] Emotional check-ins every 5 minutes
- [ ] Immediate exit option ("I need to stop")
- [ ] Crisis resources always visible
- [ ] Session time limits
- [ ] Cooldown recommendations
- [ ] Content warnings before starting

---

## Technical Requirements

### Backend API Endpoints

#### POST /api/narcissist-detector/analyze-message
```json
Request:
{
  "text": "string",
  "context": "optional string",
  "user_provided_type": "optional string"
}

Response:
{
  "primary_type": "string",
  "primary_confidence": 0.85,
  "secondary_types": [
    {"type": "string", "confidence": 0.45}
  ],
  "traits": {
    "gaslighting": 0.92,
    "love_bombing": 0.65,
    ...
  },
  "manipulation_tactics": ["string"],
  "severity_score": 7,
  "key_phrases": [
    {
      "phrase": "string",
      "tactic": "string",
      "explanation": "string"
    }
  ],
  "recommended_strategies": [
    {
      "strategy": "string",
      "example": "string",
      "why_it_works": "string"
    }
  ]
}
```

#### POST /api/narcissist-detector/analyze-conversation
```json
Request:
{
  "messages": [
    {"role": "user|narcissist", "content": "string", "timestamp": "ISO"}
  ],
  "narcissist_type": "optional string"
}

Response:
{
  "overall_analysis": {...},
  "patterns": {
    "recurring_tactics": ["string"],
    "cycle_detected": "string",
    "escalation_indicators": ["string"],
    "triggers": ["string"]
  },
  "predictions": {
    "likely_responses": [
      {
        "response": "string",
        "probability": 0.72,
        "reasoning": "string",
        "emotional_impact": "HIGH|MEDIUM|LOW"
      }
    ],
    "next_phase": "string",
    "timing": "string"
  }
}
```

#### POST /api/narcissist-detector/predict-response
```json
Request:
{
  "conversation_history": [...],
  "narcissist_type": "string",
  "user_message": "string",
  "scenario": "optional string"
}

Response:
{
  "predicted_responses": [
    {
      "response": "string",
      "probability": 0.72,
      "tactics_used": ["string"],
      "reasoning": "string",
      "counter_strategies": ["string"]
    }
  ]
}
```

### Frontend Components

#### NarcissistDetector Page
- Input method selector
- Text input area
- Analysis results display
- Tabs: Overview, Traits, Tactics, Recommendations
- Save/Export buttons

#### ConversationAnalyzer Component
- Paste conversation area
- Type selector
- Timeline view
- Pattern visualization
- Prediction panel

#### AnalysisResults Component
- Type classification display
- Trait breakdown with confidence bars
- Severity gauge
- Key phrases with explanations
- Recommended responses
- Educational content

#### SimulatorSetup Component (Phase 2)
- Scenario selector
- Type selector
- Context input (paste real conversation)
- Difficulty selector
- Start button

#### SimulatorChat Component (Phase 2)
- Chat interface
- Real-time tactic analysis
- Pause button
- Exit button
- Emotional check-in prompts
- Crisis resources

---

## Data Models

### NarcissistAnalysis
```typescript
interface NarcissistAnalysis {
  id: string
  userId: string
  inputText: string
  inputType: 'message' | 'conversation' | 'description'
  
  primaryType: string
  primaryConfidence: number
  secondaryTypes: Array<{type: string, confidence: number}>
  
  traitsDetected: Record<string, number>
  manipulationTactics: string[]
  
  severityScore: number
  keyPhrases: Array<{
    phrase: string
    tactic: string
    explanation: string
  }>
  
  recommendedStrategies: Array<{
    strategy: string
    example: string
    whyItWorks: string
  }>
  
  createdAt: Date
  updatedAt: Date
}
```

### ConversationPattern
```typescript
interface ConversationPattern {
  id: string
  userId: string
  conversationId: string
  
  recurringTactics: string[]
  cycleDetected: string
  escalationIndicators: string[]
  triggers: string[]
  
  predictedResponses: Array<{
    response: string
    probability: number
    reasoning: string
    emotionalImpact: 'HIGH' | 'MEDIUM' | 'LOW'
  }>
  
  nextPhase: string
  timing: string
  
  createdAt: Date
  updatedAt: Date
}
```

---

## AI Prompting Strategy

### System Prompt for Analysis
```
You are an expert psychologist specializing in narcissistic personality disorder and manipulation tactics.

Your task is to analyze text for narcissistic patterns and behaviors.

For each analysis, provide:
1. Primary narcissist type (Overt, Covert, Malignant, Vulnerable, Communal, Somatic)
2. Confidence score (0-100%) for primary type
3. Secondary types with confidence scores
4. Traits detected with confidence scores
5. Manipulation tactics identified
6. Severity assessment (1-10)
7. Key phrases with explanations
8. Recommended response strategies

Be specific with examples from the text.
Explain your reasoning for each classification.
Provide confidence scores for all detections.

Remember: This is for educational purposes. Always include disclaimers.
```

### System Prompt for Prediction
```
You are an expert in narcissistic behavior patterns.

Given a conversation history and narcissist type, predict the most likely responses.

For each predicted response:
1. Generate realistic response text
2. Provide probability (0-100%)
3. Identify tactics being used
4. Explain the reasoning
5. Suggest counter-strategies

Rank responses by probability.
Consider the narcissist's established patterns.
Account for escalation or de-escalation cycles.
```

---

## Implementation Phases

### Phase 1: MVP (Weeks 1-2)
**Goal**: Basic message analysis working

**Tasks**:
- [ ] Create API endpoint for message analysis
- [ ] Implement trait detection (5 core traits)
- [ ] Implement type classification (3 main types)
- [ ] Create basic UI
- [ ] Add to navigation
- [ ] Test with sample messages

**Deliverables**:
- Working detector for single messages
- Basic analysis results display
- Functional UI

### Phase 2: Enhanced Detection (Weeks 3-4)
**Goal**: Full trait and type detection

**Tasks**:
- [ ] Add remaining traits (12 total)
- [ ] Add all narcissist types (6 total)
- [ ] Implement confidence scoring
- [ ] Add key phrase extraction
- [ ] Improve UI/UX
- [ ] Add educational content

**Deliverables**:
- Complete trait detection
- All narcissist types
- Enhanced results display

### Phase 3: Conversation Analysis (Weeks 5-6)
**Goal**: Multi-message analysis and patterns

**Tasks**:
- [ ] Create conversation analyzer endpoint
- [ ] Implement pattern detection
- [ ] Implement cycle identification
- [ ] Implement response prediction
- [ ] Create timeline visualization
- [ ] Add pattern tracking

**Deliverables**:
- Conversation analysis working
- Pattern detection functional
- Prediction engine working

### Phase 4: Simulator Foundation (Weeks 7-8)
**Goal**: Basic simulator working

**Tasks**:
- [ ] Create scenario builder
- [ ] Implement AI narcissist engine
- [ ] Create chat interface
- [ ] Add real-time analysis
- [ ] Implement safety features
- [ ] Add emotional check-ins

**Deliverables**:
- Working simulator
- Safe practice environment
- Real-time feedback

---

## Success Criteria

- [ ] Detector accurately identifies narcissist types (>80% accuracy)
- [ ] Trait detection has high precision (>85%)
- [ ] Users find analysis helpful (>4/5 rating)
- [ ] Conversation analysis identifies patterns correctly
- [ ] Predictions are accurate (>70% match real behavior)
- [ ] Simulator feels realistic and safe
- [ ] Zero safety incidents
- [ ] Users report increased confidence

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI misidentifies type | User confusion | Add confidence scores, allow manual override |
| Re-traumatization | User harm | Strong safety features, crisis resources |
| Inaccurate predictions | User distrust | Transparency about limitations, continuous improvement |
| Privacy concerns | User hesitation | Clear privacy policy, data encryption |
| Overuse/addiction | Unhealthy coping | Session limits, cooldown recommendations |

---

## Next Steps

1. **Review & Approve** this spec
2. **Create database schema** for storing analyses
3. **Build API endpoints** for analysis
4. **Create UI components** for detector
5. **Implement trait detection** logic
6. **Test with real conversations**
7. **Gather user feedback**
8. **Iterate and improve**

---

## Questions for Discussion

1. Should we start with just message analysis or include conversation analysis in MVP?
2. How many traits should we detect in MVP (5 or all 12)?
3. Should we include voice input in MVP or add later?
4. What's the priority: accuracy or speed?
5. Should analyses be public/shareable or private only?
6. Do we need professional review of our classifications?

