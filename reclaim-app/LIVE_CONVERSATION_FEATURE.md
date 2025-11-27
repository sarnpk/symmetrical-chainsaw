# Live Conversation Feature - NEW! ✅

## Overview
Added a new "Live Conversation" scenario to the Narcissist Simulator that allows users to continue an ongoing conversation with additional situational context.

## What's Different from Custom Context?

### Custom Context:
- Paste a past conversation
- AI learns patterns
- Practice similar scenarios

### Live Conversation (NEW):
- Paste an **ongoing** conversation
- Add **situational context** (what's happening now)
- AI continues the conversation with awareness of the situation
- More realistic and contextually aware responses

## How It Works

### Two Input Fields:

**1. Situation Context (What's Happening?)**
```
Example (with names):
I AM Syed naqvi AND SHE IS Begum New

She took my 2-year-old boy and 4-year-old girl a week ago. 
We're discussing a deposit slip she sent me. 
She's being dismissive and gaslighting about important documents.

OR (without names - put them in conversation instead):
She took my 2-year-old boy and 4-year-old girl a week ago. 
We're discussing a deposit slip she sent me.
```

**2. Ongoing Conversation**
```
Example (with names):
I AM Syed naqvi AND SHE IS Begum New

[11:59 AM] Syed naqvi: یہ رسید ملی لیکن پتہ نہیں کس چیز کی رسید ہے
[11:59 AM] Begum New: Yehi hai
[11:59 AM] Begum New: Yellow hogi ye
[12:01 PM] Begum New: Ali Bhai Ko dikha lain

OR (without names - if you put them in context field):
[11:59 AM] Syed naqvi: یہ رسید ملی لیکن پتہ نہیں کس چیز کی رسید ہے
[11:59 AM] Begum New: Yehi hai
```

**Note:** You can include "I AM [name] AND SHE/HE IS [name]" in EITHER field - the simulator will find it!

## User Flow

### Step 1: Select Scenario
```
Choose "Live Conversation" from scenario options
```

### Step 2: Describe the Situation
```
In the "What's Happening?" field, explain:
- (Optional) Include "I AM [name] AND SHE/HE IS [name]"
- What's currently going on
- Recent events (e.g., "She took the kids a week ago")
- What you're discussing
- Any important context

You can put the names here OR in the conversation field - either works!
```

### Step 3: Paste Conversation
```
Paste your ongoing WhatsApp/text conversation
If you didn't include names in Step 2, add them here:
"I AM [name] AND SHE/HE IS [name]"

The simulator checks BOTH fields for names!
```

### Step 4: Practice
```
AI continues the conversation as the narcissist
Responses are aware of both:
- Their patterns from the conversation
- The situational context you provided
```

## Benefits

### 1. **Situational Awareness**
- AI knows what's happening in your life
- Responses are contextually relevant
- More realistic simulation

### 2. **Real-Time Practice**
- Continue actual ongoing conversations
- Practice before responding in real life
- Test different response strategies

### 3. **Better Context**
- AI understands the stakes (e.g., custody issues)
- Knows recent events (e.g., "took kids a week ago")
- Can reference the situation in responses

### 4. **More Accurate**
- Combines conversation patterns + situation
- Narcissist's responses feel more real
- Better preparation for actual interaction

## Example Use Cases

### Use Case 1: Custody Dispute
```
Situation Context:
"She took my kids without notice last week. We're supposed to 
discuss custody arrangements but she's avoiding the topic and 
gaslighting about documents."

Conversation:
[Recent WhatsApp messages about documents]

Result:
AI continues as her, aware of the custody situation and her 
avoidance tactics.
```

### Use Case 2: Financial Manipulation
```
Situation Context:
"She's demanding money for 'children's expenses' but won't 
provide receipts. She has a history of financial abuse."

Conversation:
[Recent messages about money]

Result:
AI responds as her, aware of the financial manipulation pattern.
```

### Use Case 3: Gaslighting About Events
```
Situation Context:
"She's denying things that happened last week. I have proof 
but she's trying to make me doubt my memory."

Conversation:
[Recent messages where she denies events]

Result:
AI continues the gaslighting, aware of the specific events.
```

## Technical Implementation

### Frontend Changes:
- Added "Live Conversation" to SCENARIOS array
- Added `situationContext` state
- Added two-field UI (situation + conversation)
- Validation for both fields
- Sends both to API

### Backend Changes:
- Updated `start/route.ts` to accept `situationContext`
- Updated `respond/route.ts` to accept `situationContext`
- Added situation info to AI prompts
- AI uses context to make responses more realistic

### AI Prompt Enhancement:
```
SITUATION CONTEXT:
${situationContext}

This provides important background about what's currently happening.
Use this context to make the narcissist's responses more realistic 
and situationally aware.
```

## UI Design

### Situation Context Field:
- Green background (different from custom context blue)
- Clear label: "What's Happening? (Context)"
- Example placeholder text
- 32-line height textarea

### Conversation Field:
- Same format as custom context
- Requires "I AM [name] AND SHE/HE IS [name]"
- 48-line height textarea
- Monospace font for readability

### Visual Indicators:
- 📝 Icon for situation context
- 💬 Icon for live conversation
- 🎯 Icon for real-time practice
- 🔒 Privacy assurance

## Validation

### Required Fields:
1. ✅ Situation context must not be empty
2. ✅ Conversation must not be empty
3. ✅ Must include "I AM" and "SHE/HE IS" identifiers

### Error Messages:
- "Please describe what's happening (context)"
- "Please paste your conversation"

## Integration with Profile

The live conversation feature also uses:
- User's display name from profile
- Narcissist's gender from profile
- Children information (if available)
- Custody arrangement details

This makes responses even more personalized and realistic.

## Comparison Table

| Feature | Custom Context | Live Conversation |
|---------|---------------|-------------------|
| **Purpose** | Learn patterns | Continue ongoing chat |
| **Context** | From conversation only | Conversation + situation |
| **Use Case** | Practice similar scenarios | Prepare for next response |
| **Awareness** | Pattern-based | Situation-aware |
| **Best For** | General practice | Specific current situation |

## Example Scenarios

### Scenario 1: Document Gaslighting
**Situation:**
```
She sent a torn deposit slip and is being vague about what it's for.
She took the kids last week and I'm trying to get clarity on finances.
```

**Conversation:**
```
I AM Syed naqvi AND SHE IS Begum New

[11:59 AM] Syed naqvi: یہ رسید ملی لیکن پتہ نہیں کس چیز کی رسید ہے
[11:59 AM] Begum New: Yehi hai
[12:01 PM] Begum New: Ali Bhai Ko dikha lain
```

**AI Response:**
Will be aware of:
- The custody situation (kids taken)
- The document confusion
- Her dismissive pattern
- The financial context

### Scenario 2: Custody Discussion
**Situation:**
```
We're supposed to arrange custody schedule but she keeps 
changing the subject and making excuses.
```

**Conversation:**
```
[Recent messages about scheduling]
```

**AI Response:**
Will continue her avoidance tactics while being aware of the custody context.

## Tips for Best Results

### 1. **Be Specific in Context**
```
Good: "She took my 2-year-old and 4-year-old last Tuesday without notice"
Bad: "She took the kids"
```

### 2. **Include Recent Events**
```
Good: "This started after I asked for receipts last week"
Bad: "We're arguing about money"
```

### 3. **Mention Stakes**
```
Good: "I need this for court next month"
Bad: "This is important"
```

### 4. **Describe Patterns**
```
Good: "She always deflects when I ask about documents"
Bad: "She's being difficult"
```

## Privacy & Security

- ✅ Situation context is NOT saved to database
- ✅ Only used for current session
- ✅ Conversation is private
- ✅ No data sharing
- ✅ Deleted after session ends

## Status: ✅ READY TO USE

The Live Conversation feature is fully implemented and ready for users!

## Quick Start

1. Go to Narcissist Simulator
2. Select "Live Conversation" scenario
3. Describe what's happening in "Situation Context"
4. Paste your ongoing conversation
5. Start practicing!

The AI will continue the conversation with full awareness of your situation.
