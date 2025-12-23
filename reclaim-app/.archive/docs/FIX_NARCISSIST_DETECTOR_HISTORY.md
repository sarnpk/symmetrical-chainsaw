# Fix Narcissist Detector History Issue

## Problem

The Narcissist Detector analyses were not being saved to the "Recent Analyses" history.

## Root Causes

1. **Database Schema Issues**:
   - Foreign key referenced `profiles(id)` instead of `auth.users(id)`
   - Required fields (`manipulation_tactics`, `key_phrases`, etc.) were NOT NULL but APIs didn't always provide them
   - Field name mismatches between API responses and database schema

2. **Data Mapping Issues**:
   - Different APIs returned different field names
   - No proper mapping between API response and database schema
   - Missing error handling and logging

## Solutions Applied

### 1. Updated Database Schema

**File**: `supabase/migrations/fix_narcissist_analyses_schema.sql`

Changes:
- ✅ Fixed foreign key: `profiles(id)` → `auth.users(id)`
- ✅ Made optional fields have defaults instead of NOT NULL
- ✅ Added proper indexes
- ✅ Added updated_at trigger

### 2. Fixed saveAnalysis Function

**File**: `src/app/narcissist-detector/page.tsx`

Changes:
- ✅ Added proper data mapping for all field name variations
- ✅ Added type conversions (Number() for numeric fields)
- ✅ Added array checks for array fields
- ✅ Added comprehensive error logging
- ✅ Added success/error toast notifications
- ✅ Limited input_text to 500 characters
- ✅ Added fallback values for all fields

### 3. Field Mapping

| API Field | Database Field | Fallback |
|-----------|---------------|----------|
| `primaryType` | `primary_type` | 'Unknown' |
| `primaryConfidence` | `primary_confidence` | 0 |
| `traits` | `traits_detected` | {} |
| `manipulationTactics` or `tactics` | `manipulation_tactics` | [] |
| `severityScore` | `severity_score` | 5 |
| `keyPhrases` | `key_phrases` | [] |
| `recommendedStrategies` or `recommendations` | `recommended_strategies` | [] |

## How to Apply the Fix

### Step 1: Run Database Migration

```bash
# Connect to your Supabase project
supabase db push

# Or manually run the migration
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/fix_narcissist_analyses_schema.sql
```

### Step 2: Verify Table Structure

```sql
-- Check table structure
\d narcissist_analyses

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'narcissist_analyses';

-- Test insert
INSERT INTO narcissist_analyses (
  user_id,
  input_text,
  input_type,
  primary_type,
  primary_confidence
) VALUES (
  auth.uid(),
  'Test analysis',
  'message',
  'Overt',
  85.5
);
```

### Step 3: Test in Application

1. Go to Narcissist Detector
2. Run any analysis (trait checklist, behavior, message, or conversation)
3. Check browser console for logs:
   - "Saving analysis:" - shows what's being saved
   - "Insert data:" - shows mapped data
   - "Analysis saved successfully:" - confirms save
   - "History loaded:" - shows loaded history
4. Check for toast notifications:
   - Success: "Analysis saved to history"
   - Error: Shows specific error message
5. Verify "Recent Analyses" sidebar shows the new analysis

## Debugging

### Check Browser Console

Look for these logs:
```
Saving analysis: { inputType: '...', analysisData: {...} }
Insert data: { user_id: '...', input_text: '...', ... }
Analysis saved successfully: [...]
History loaded: [...]
```

### Check for Errors

Common errors and solutions:

**Error: "relation does not exist"**
- Solution: Run the migration to create the table

**Error: "foreign key constraint"**
- Solution: Ensure user exists in auth.users table

**Error: "null value in column"**
- Solution: Check that all required fields have defaults in schema

**Error: "invalid input syntax for type"**
- Solution: Check data type conversions in saveAnalysis function

### Check Database Directly

```sql
-- Check if analyses are being saved
SELECT * FROM narcissist_analyses 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for failed inserts (if you have logging)
SELECT * FROM pg_stat_activity 
WHERE query LIKE '%narcissist_analyses%';
```

## Testing Checklist

- [ ] Run trait checklist analysis
- [ ] Run behavior description analysis
- [ ] Run single message analysis
- [ ] Run full conversation analysis
- [ ] Check "Recent Analyses" sidebar updates
- [ ] Verify analyses persist after page refresh
- [ ] Check console logs show successful saves
- [ ] Verify toast notifications appear
- [ ] Test with different analysis types
- [ ] Test with long input text (should truncate)

## Expected Behavior After Fix

### Before Analysis
- "Recent Analyses" sidebar shows previous analyses (if any)

### During Analysis
- Loading state shows
- Console logs show "Saving analysis..."
- Console logs show "Insert data..."

### After Analysis
- Toast notification: "Analysis saved to history"
- Console logs show "Analysis saved successfully"
- Console logs show "History loaded"
- "Recent Analyses" sidebar updates immediately
- New analysis appears at top of list
- Can click on history item to view details

## Rollback Plan

If the fix causes issues:

```sql
-- Restore old schema (if you have a backup)
DROP TABLE narcissist_analyses CASCADE;

-- Restore from backup
-- (restore your backup here)
```

## Future Improvements

1. **Better Error Handling**
   - Retry logic for failed saves
   - Offline queue for analyses
   - Better user feedback

2. **Data Validation**
   - Validate data before insert
   - Sanitize input text
   - Check field types

3. **Performance**
   - Batch inserts for multiple analyses
   - Lazy load history
   - Pagination for large history

4. **Features**
   - Export history to PDF
   - Search/filter history
   - Compare analyses over time
   - Delete individual analyses

## Support

If you're still experiencing issues:

1. Check browser console for errors
2. Check Supabase logs
3. Verify database schema matches migration
4. Test with a fresh user account
5. Check RLS policies are correct

## Summary

The history feature should now work correctly. All analyses will be saved to the database and appear in the "Recent Analyses" sidebar. The fix includes:

- ✅ Corrected database schema
- ✅ Proper data mapping
- ✅ Comprehensive error handling
- ✅ Detailed logging for debugging
- ✅ User feedback via toast notifications

Test thoroughly and check console logs if any issues persist!
