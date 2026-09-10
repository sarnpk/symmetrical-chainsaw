# Narcissist Detector MVP - Setup & Deployment

## What's Been Built

### âœ… Completed Components

1. **Frontend Page** (`/narcissist-detector`)
   - Tab interface for Message vs Conversation analysis
   - Input areas with formatting guidance
   - Results display with traits, tactics, predictions
   - History sidebar
   - Copy/Clear actions

2. **API Endpoints**
   - `POST /api/narcissist-detector/analyze` - Single message analysis
   - `POST /api/narcissist-detector/analyze-conversation` - Full conversation analysis

3. **Database**
   - `narcissist_analyses` table with RLS policies
   - Stores all analyses privately per user

4. **Navigation**
   - Added to DashboardLayout sidebar
   - Accessible from main dashboard

---

## Setup Instructions

### 1. Run Database Migration

```bash
cd reclaim-app
npx supabase migration up
```

Or manually run the SQL in `supabase/migrations/add_narcissist_detector.sql` in your Supabase dashboard.

### 2. Verify Environment Variables

Make sure you have in `.env.local`:
```
GOOGLE_API_KEY=your_google_api_key
```

### 3. Test the Feature

1. Go to `/narcissist-detector` in your app
2. Try analyzing a sample message:
   ```
   "You're too sensitive. That never happened. 
   I would never say something like that. 
   You're making it up."
   ```

3. Try analyzing a conversation:
   ```
   You: I'm hurt by what you said yesterday
   Them: I never said that. You're crazy.
   You: But you literally just said it
   Them: You're making things up. Nobody would believe you.
   ```

---

## Features

### Message Analysis
- Detects 5 core traits:
  - Gaslighting
  - Love-bombing
  - Hoovering
  - Triangulation
  - Projection

- Classifies 3 main types:
  - Overt
  - Covert
  - Malignant

- Provides:
  - Confidence scores
  - Severity rating (1-10)
  - Key phrases with explanations
  - Recommended response strategies

### Conversation Analysis
- Analyzes full conversation threads
- Detects:
  - Recurring manipulation tactics
  - Narcissistic cycles
  - Escalation patterns
  - Emotional triggers

- Predicts:
  - Likely next responses (with probability)
  - Next phase in cycle
  - Timing of escalation

---

## Usage Examples

### Example 1: Single Message Analysis

**Input:**
```
"You're overreacting. I never said that. 
You're too sensitive and you're making things up. 
Nobody would believe you anyway."
```

**Output:**
- Primary Type: Covert Narcissist (85% confidence)
- Severity: 8/10
- Traits: Gaslighting (92%), Victim Mentality (88%), Projection (75%)
- Tactics: Emotional manipulation, Guilt-tripping, Invalidation
- Key Phrases: "You're overreacting", "I never said that", "You're making things up"

### Example 2: Conversation Analysis

**Input:**
```
You: I'm hurt by what you said
Them: I never said that
You: Yes you did, yesterday
Them: You're crazy. I would never say something like that.
You: I have it in writing
Them: That's not what it means. You're misinterpreting it.
```

**Output:**
- Cycle Detected: Gaslighting â†’ Victim Mentality â†’ Reality Distortion
- Recurring Tactics: Denial, Contradiction, Reality Distortion
- Escalation Indicators: Increasing intensity, Defensive language
- Likely Next Response: "You're the problem here, not me" (72% probability)
- Next Phase: Projection/Blame-shifting (in 1-2 messages)

---

## Limitations (MVP)

- Only detects 5 core traits (not all 12)
- Only classifies 3 main types (not all 6)
- Conversation parsing requires specific format
- No voice input yet
- No screenshot upload yet
- No pattern tracking over time yet

---

## Next Steps (Phase 2)

- [ ] Add remaining 7 traits
- [ ] Add remaining 3 narcissist types
- [ ] Implement conversation history tracking
- [ ] Add voice input support
- [ ] Add screenshot OCR
- [ ] Build pattern analysis over time
- [ ] Create narcissist simulator
- [ ] Add educational content for each trait

---

## Troubleshooting

### "Unauthorized" Error
- Make sure user is logged in
- Check auth session is valid

### "Failed to parse AI response"
- Google API might be rate limited
- Check GOOGLE_API_KEY is valid
- Try again in a few seconds

### Conversation not parsing
- Use exact format: "You: message\nThem: message"
- Each message on new line
- No extra spaces or formatting

### Results seem inaccurate
- This is MVP - accuracy improves with more traits
- AI can make mistakes - use as educational tool only
- Always consult professionals for diagnosis

---

## Testing Checklist

- [ ] Can access `/narcissist-detector` page
- [ ] Message analysis tab works
- [ ] Conversation analysis tab works
- [ ] Results display correctly
- [ ] Copy button works
- [ ] Clear button works
- [ ] History sidebar shows recent analyses
- [ ] Data is saved to database
- [ ] Only user can see their own analyses

---

## Performance Notes

- Analysis takes 3-5 seconds (Google API latency)
- Results are cached in browser state
- Database queries are indexed for speed
- RLS policies ensure data privacy

---

## Security

- All analyses are private (RLS enforced)
- User authentication required
- No data shared without consent
- Encrypted in transit (HTTPS)
- Stored securely in Supabase

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the specification documents
3. Check browser console for errors
4. Verify database migration ran successfully

