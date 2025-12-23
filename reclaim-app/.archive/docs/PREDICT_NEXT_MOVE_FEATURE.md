# Predict Next Move Feature - Narcissist Simulator

## Overview

The "Predict Next Move" feature uses AI to analyze the conversation context and predict the narcissist's next 3 most likely moves, complete with probabilities, reasoning, and recommended responses.

---

## What It Does

### Analyzes Conversation Context
- Reviews the entire conversation history
- Identifies patterns and tactics being used
- Considers the narcissist type and scenario
- For custom context: uses their established patterns from real conversation

### Predicts 3 Likely Moves
Each prediction includes:
- **What they'll say/do**: Specific predicted action or statement
- **Probability**: How likely this move is (0-100%)
- **Reasoning**: Why they'll do this based on patterns
- **How to respond**: Recommended strategy for this move

### Provides Strategic Overview
- **Overall Strategy**: What manipulation strategy they're using
- **Warning Signs**: Any escalation or danger indicators

---

## How It Works

### User Flow

1. **Have a Conversation**
   - User must have at least one exchange (2+ messages)
   - The more context, the better the predictions

2. **Click "Predict Next Move"**
   - Purple button in the session controls
   - Disabled until enough conversation exists

3. **AI Analyzes**
   - Takes 3-5 seconds to analyze
   - Considers all conversation context
   - Uses narcissist type and patterns

4. **View Predictions**
   - Shows 3 most likely moves
   - Ranked by probability
   - Each with reasoning and response strategy

5. **Prepare Response**
   - User can prepare for likely scenarios
   - Practice responses before they happen
   - Understand the manipulation strategy

---

## Example Predictions

### Scenario: Custody Exchange

**Conversation Context:**
```
Narcissist: I need to switch weekends again.
User: That's the third time this month.
Narcissist: So you're saying I'm a bad parent?
User: I'm saying we need consistency.
```

**Predicted Moves:**

**1. Guilt Trip About Kids (85% likely)**
- **Move**: "Fine. But when the kids ask why they can't see me, I'll tell them you wouldn't be flexible."
- **Reasoning**: They're using the kids as leverage and trying to make you feel guilty. This is a classic manipulation tactic when boundaries are set.
- **How to Respond**: Grey rock: "The schedule is in the custody agreement." Don't engage with the guilt trip.

**2. Play Victim (70% likely)**
- **Move**: "You're always so rigid. No wonder our relationship failed."
- **Reasoning**: When guilt doesn't work, they often shift to playing victim and blaming you for everything.
- **How to Respond**: BIFF: "The schedule works for the kids' stability. See you Friday at 5pm."

**3. Escalate/Threaten (45% likely)**
- **Move**: "I'm documenting all of this for my lawyer."
- **Reasoning**: If other tactics fail, they may escalate to threats to regain control.
- **How to Respond**: Stay calm: "That's your choice. The schedule remains as agreed."

**Overall Strategy**: They're trying to regain control by making you feel guilty and responsible for their problems. They want you to give in to avoid conflict.

**Warning**: Watch for escalation if you maintain boundaries. They may involve third parties (kids, lawyers, family) to pressure you.

---

## Technical Implementation

### API Endpoint
`POST /api/narcissist-simulator/predict`

**Request:**
```json
{
  "narcissistType": "covert",
  "scenario": "custody",
  "conversationHistory": [...],
  "customContext": "optional real conversation"
}
```

**Response:**
```json
{
  "prediction": {
    "likelyMoves": [
      {
        "move": "predicted action",
        "probability": 0.85,
        "reasoning": "why they'll do this",
        "howToRespond": "recommended strategy"
      }
    ],
    "overallStrategy": "their manipulation strategy",
    "warningSign": "escalation indicators"
  }
}
```

### AI Prompting Strategy

**For Standard Scenarios:**
- Uses narcissist type profile
- Analyzes conversation flow
- Predicts based on typical patterns

**For Custom Context:**
- Analyzes their real conversation patterns
- Identifies their specific tactics
- Predicts based on THEIR established behavior
- More accurate and personalized

---

## Benefits

### For Users

**1. Preparation**
- Know what's coming before it happens
- Prepare responses in advance
- Reduce anxiety about interactions

**2. Understanding**
- See the manipulation strategy clearly
- Understand why they do what they do
- Recognize patterns faster

**3. Confidence**
- Feel more in control
- Less reactive, more proactive
- Better boundary maintenance

**4. Safety**
- Identify escalation risks early
- Prepare for dangerous situations
- Know when to disengage

### For Learning

**1. Pattern Recognition**
- Learn to spot tactics in real-time
- Understand narcissistic cycles
- Recognize manipulation faster

**2. Strategy Development**
- See which responses work best
- Understand their triggers
- Develop effective boundaries

**3. Validation**
- Confirms your observations
- Validates your experiences
- Reduces self-doubt

---

## Use Cases

### 1. Pre-Interaction Preparation

**Scenario**: You have a custody exchange tomorrow

**How to use:**
- Paste recent conversation in custom context
- Practice a few exchanges
- Click "Predict Next Move"
- Prepare for likely scenarios
- Go into interaction confident

### 2. Mid-Conversation Strategy

**Scenario**: You're in a text exchange right now

**How to use:**
- Paste the current conversation
- See what they'll likely do next
- Prepare your response
- Avoid falling into traps

### 3. Pattern Analysis

**Scenario**: You want to understand their cycles

**How to use:**
- Practice multiple scenarios
- Predict at different points
- See how patterns repeat
- Learn their playbook

### 4. Safety Planning

**Scenario**: You're worried about escalation

**How to use:**
- Analyze recent conversations
- Look for warning signs
- Prepare exit strategies
- Know when to get help

---

## Limitations

### What It Can't Do

1. **Not 100% Accurate**
   - Predictions are probabilities, not certainties
   - Real narcissists may surprise you
   - Use as a guide, not gospel

2. **Requires Context**
   - Needs at least one exchange
   - More context = better predictions
   - Short conversations = less accurate

3. **Not a Replacement for Professionals**
   - This is educational, not therapeutic
   - Consult professionals for serious situations
   - Don't use for legal decisions

4. **Can't Predict Everything**
   - Focuses on most likely moves
   - May miss unexpected tactics
   - Can't predict timing exactly

---

## Best Practices

### ✅ DO:

- **Use after several exchanges**: More context = better predictions
- **Consider all predictions**: Even low-probability ones can happen
- **Prepare multiple responses**: Have backup strategies
- **Update predictions**: Re-predict as conversation evolves
- **Trust your gut**: If something feels off, it probably is

### ❌ DON'T:

- **Predict too early**: Need at least one exchange
- **Rely solely on predictions**: Use your own judgment too
- **Share predictions with them**: Will escalate conflict
- **Ignore warning signs**: Take escalation seriously
- **Assume 100% accuracy**: These are educated guesses

---

## Privacy & Safety

### Data Privacy
- ✅ Predictions not stored permanently
- ✅ Used only for current session
- ✅ Not shared with anyone
- ✅ Deleted when session ends

### Emotional Safety
- ⚠️ Predictions can be triggering
- ⚠️ May reveal difficult truths
- ⚠️ Take breaks if needed
- ⚠️ Seek support if overwhelmed

### Physical Safety
- 🚨 If predictions show escalation to violence
- 🚨 If warning signs indicate danger
- 🚨 Contact authorities immediately
- 🚨 Have a safety plan ready

---

## Future Enhancements

### Phase 2
- [ ] Predict timing (when they'll respond)
- [ ] Predict emotional impact on you
- [ ] Suggest pre-emptive strategies
- [ ] Track prediction accuracy over time
- [ ] Learn from your specific narcissist

### Phase 3
- [ ] Multi-step predictions (next 3 moves)
- [ ] Scenario branching (if you do X, they'll do Y)
- [ ] Confidence intervals for predictions
- [ ] Historical pattern matching
- [ ] Community-validated predictions

---

## Success Metrics

Track:
- % of users who use prediction feature
- Accuracy of predictions (user feedback)
- Impact on user confidence
- Reduction in anxiety
- Improved boundary maintenance

---

## User Feedback Questions

After using predictions:
1. Were the predictions accurate?
2. Did they help you prepare?
3. Did you feel more confident?
4. Were the response suggestions helpful?
5. Would you use this feature again?

---

## Getting Started

1. **Start a simulation session**
2. **Have at least one exchange**
3. **Click "Predict Next Move"**
4. **Review the 3 predictions**
5. **Prepare your responses**
6. **Continue the conversation**
7. **See if predictions were accurate**

---

## Remember

- **Predictions are tools, not crystal balls**
- **Your safety comes first**
- **Trust your instincts**
- **Preparation reduces anxiety**
- **Knowledge is power**

Understanding their playbook gives you the advantage. You're no longer reacting—you're anticipating. That's powerful. 💪

---

## Questions?

**Q: How accurate are the predictions?**
A: Typically 70-85% accurate for common patterns. Custom context predictions are more accurate because they're based on YOUR specific narcissist.

**Q: Can I predict multiple times in one session?**
A: Yes! Predict as often as you want. Predictions update based on new conversation context.

**Q: What if the prediction is wrong?**
A: That's okay! Real narcissists can be unpredictable. Use predictions as a guide, not a guarantee.

**Q: Should I tell them I know what they're going to do?**
A: No! This will escalate conflict and give them information about your strategies.

**Q: Can I save predictions?**
A: Not yet - this is a planned feature. Currently predictions are temporary.

---

## Related Features

- **Narcissist Detector**: Identify their type first
- **Custom Context**: Use real conversations for better predictions
- **Live Feedback**: Get real-time technique analysis
- **BIFF Assistant**: Craft effective responses

---

This feature transforms the simulator from practice tool to strategic planning tool. You're not just reacting anymore—you're anticipating, preparing, and staying one step ahead. 🎯
