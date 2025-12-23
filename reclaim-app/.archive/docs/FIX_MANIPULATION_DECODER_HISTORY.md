# Fix Manipulation Decoder History Issue

## Problem

The Manipulation Decoder was not saving AI analyses to history. Basic analyses were saving, but AI analyses were not.

## Root Causes

1. **Database Schema Issue**:
   - Foreign key referenced `profiles(id)` instead of `auth.users(id)`
   - Same issue as Narcissist Detector

2. **AI Analysis Not Saving**:
   - The AI analysis endpoint (`/api/manipulation-decoder/analyze`) only returned results
   - It never saved to the database
   - Only the basic analysis endpoint (`/api/manipulation-decoder`) was saving

## Solutions Applied

### 1. Fixed Database Schema

**File**: `supabase/migrations/fix_manipulation_analysis_schema.sql`

Changes:
- ✅ Fixed foreign key: `profiles(id)` → `auth.users(id)`
- ✅ Added `updated_at` field with trigger
- ✅ Improved RLS policies
- ✅ Added proper indexes

### 2. Added Saving to AI Analysis Endpoint

**File**: `src/app/api/manipulation-decoder/analyze/route.ts`

Changes:
- ✅ Now saves AI analysis results to database
- ✅ Maps AI-identified tactics to trait IDs
- ✅ Stores full AI analysis in `notes` field as JSON
- ✅ Includes context if provided
- ✅ Comprehensive error logging
- ✅ Doesn't fail request if save fails (graceful degradation)

### 3. Improved Basic Analysis Endpoint

**File**: `src/app/api/manipulation-decoder/route.ts`

Changes:
- ✅ Better error handling
- ✅ Comprehensive logging
- ✅ Proper data validation
- ✅ Detailed error messages

## How It Works Now

### Basic Analysis Flow

1. User enters message and clicks "Analyze"
2. POST to `/api/manipulation-decoder`
3. Keyword matching identifies tactics
4. Saves to database with:
   - `message_text`
   - `identified_tactics` (trait IDs)
   - `emotional_impact`
   - `is_my_fault`
   - `notes`
5. Returns saved data
6. Frontend refreshes history

### AI Analysis Flow

1. User enters message and clicks "AI Analyze"
2. POST to `/api/manipulation-decoder/analyze`
3. AI analyzes message and returns:
   - `tactics` (names)
   - `emotional_hooks`
   - `hidden_agenda`
   - `grey_rock_responses`
   - `explanation`
4. **NEW**: Maps tactic names to trait IDs
5. **NEW**: Saves to database with:
   - `message_text`
   - `identified_tactics` (mapped trait IDs)
   - `emotional_impact` (default: 'moderate')
   - `is_my_fault` (default: false)
   - `notes` (full AI analysis as JSON)
6. Returns AI analysis to frontend
7. Frontend refreshes history

## Database Schema

```sql
CREATE TABLE manipulation_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  identified_tactics UUID[] DEFAULT '{}',
  emotional_impact TEXT CHECK (emotional_impact IN ('none', 'mild', 'moderate', 'severe')),
  is_my_fault BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notes Field Structure (for AI analyses)

```json
{
  "ai_analysis": true,
  "tactics": ["Gaslighting", "DARVO"],
  "emotional_hooks": ["Guilt", "Fear"],
  "hidden_agenda": "Control the narrative",
  "explanation": "They're using...",
  "context": "optional conversation context"
}
```

## How to Apply the Fix

### Step 1: Run Database Migration

```bash
supabase db push
```

Or manually:
```bash
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/fix_manipulation_analysis_schema.sql
```

### Step 2: Verify Table Structure

```sql
-- Check table structure
\d manipulation_analysis

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'manipulation_analysis';

-- Test insert
INSERT INTO manipulation_analysis (
  user_id,
  message_text,
  emotional_impact
) VALUES (
  auth.uid(),
  'Test message',
  'moderate'
);
```

### Step 3: Test in Application

**Test Basic Analysis:**
1. Go to Manipulation Decoder
2. Enter a message
3. Click "Analyze"
4. Check browser console for logs
5. Verify history updates

**Test AI Analysis:**
1. Go to Manipulation Decoder
2. Enter a message
3. Click "AI Analyze"
4. Check browser console for:
   - "Saving AI manipulation analysis to database"
   - "Saving AI analysis: {...}"
   - "AI analysis saved successfully: {...}"
5. Verify history updates with AI analysis

## Debugging

### Check Browser Console

**For Basic Analysis:**
```
Saving manipulation analysis: { user_id: '...', message_text: '...' }
Insert data: { user_id: '...', ... }
Analysis saved successfully: {...}
```

**For AI Analysis:**
```
Saving AI manipulation analysis to database
Saving AI analysis: { user_id: '...', ... }
AI analysis saved successfully: {...}
```

### Check Database

```sql
-- View all analyses
SELECT * FROM manipulation_analysis 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC;

-- View AI analyses specifically
SELECT * FROM manipulation_analysis 
WHERE notes::jsonb->>'ai_analysis' = 'true'
ORDER BY created_at DESC;

-- Check tactics mapping
SELECT 
  id,
  message_text,
  identified_tactics,
  notes::jsonb->'tactics' as ai_tactics
FROM manipulation_analysis
WHERE notes IS NOT NULL;
```

### Common Errors

**Error: "relation does not exist"**
- Solution: Run the migration

**Error: "foreign key constraint"**
- Solution: Ensure user exists in auth.users

**Error: "Failed to save AI analysis to database"**
- Check: Console logs for specific error
- Check: RLS policies are correct
- Check: User is authenticated

## Testing Checklist

- [ ] Basic analysis saves to database
- [ ] AI analysis saves to database
- [ ] History updates after basic analysis
- [ ] History updates after AI analysis
- [ ] Can view saved analyses
- [ ] AI analysis includes full details in notes
- [ ] Tactics are mapped correctly
- [ ] Console logs show successful saves
- [ ] No errors in browser console
- [ ] No errors in server logs

## Expected Behavior

### Basic Analysis
- Saves immediately after analysis
- History updates automatically
- Shows in history sidebar
- Includes identified tactics

### AI Analysis
- Saves after AI completes
- History updates automatically
- Shows in history sidebar
- Includes AI tactics in notes
- Can view full AI analysis details

## Differences Between Basic and AI Analysis

| Feature | Basic Analysis | AI Analysis |
|---------|---------------|-------------|
| Endpoint | `/api/manipulation-decoder` | `/api/manipulation-decoder/analyze` |
| Method | Keyword matching | AI analysis |
| Tactics | Trait IDs from keywords | Mapped from AI tactic names |
| Notes | User-provided | Full AI analysis JSON |
| Emotional Impact | User-selected | Default 'moderate' |
| Is My Fault | User-selected | Default false |
| Context | Not used | Optional conversation context |

## Future Improvements

1. **Better Tactic Mapping**
   - Improve AI tactic name to trait ID mapping
   - Handle partial matches better
   - Add fuzzy matching

2. **Enhanced History Display**
   - Show AI vs Basic analysis badge
   - Display AI insights in history
   - Allow viewing full AI analysis from history

3. **Unified Analysis**
   - Combine basic and AI analysis
   - Show both results side-by-side
   - Compare accuracy

4. **Better Error Handling**
   - Retry failed saves
   - Queue analyses offline
   - Better user feedback

## Summary

Both basic and AI analyses now save to the database correctly. The fix includes:

- ✅ Corrected database schema (foreign key)
- ✅ AI analysis now saves to database
- ✅ Proper tactic mapping for AI analyses
- ✅ Full AI analysis stored in notes
- ✅ Comprehensive error logging
- ✅ Graceful error handling

Test both analysis types and check console logs if any issues persist!
