# Audio Transcription Bug Fix

## Problem Description

The audio transcription feature in the journal app was getting stuck in "processing" state even though Gladia API had completed the transcription successfully. This happened because:

1. **Short polling timeout**: The Edge Function only polls Gladia for ~15 seconds, then gives up
2. **No background job**: There was no mechanism to check for completed transcriptions later
3. **Frontend didn't poll**: The UI would show "processing" indefinitely

## Solution Implemented

### 1. Enhanced Edge Function (`supabase/functions/transcribe-audio/index.ts`)

- Added `checkGladiaStatus()` function for better status checking
- Improved error handling for failed transcriptions
- Enhanced status check endpoint to properly handle completed/failed states

### 2. Frontend Polling (`reclaim-app/src/app/journal/new/page.tsx`)

- Added `pollForTranscriptionCompletion()` function
- Implements client-side polling every 5 seconds for up to 5 minutes
- Properly handles completed, failed, and timeout scenarios
- Shows user-friendly progress messages

### 3. Cleanup Script (`scripts/fix-stuck-transcriptions.js`)

- Utility script to fix existing stuck transcriptions
- Checks Gladia API status for all "processing" files
- Updates database with completed transcriptions
- Records usage tracking for completed transcriptions

## How to Use

### For New Transcriptions
The fix is automatic - new audio transcriptions will now properly complete or show appropriate error messages.

### For Existing Stuck Transcriptions

1. **Set environment variables:**
   ```bash
   export GLADIA_API_KEY="your_gladia_api_key"
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   ```

2. **Run the cleanup script:**
   ```bash
   cd reclaim-app
   npm run fix-transcriptions
   ```

   Or directly:
   ```bash
   node scripts/fix-stuck-transcriptions.js
   ```

### Manual Check via Edge Function

You can also manually check transcription status by calling the Edge Function with `check_status: true`:

```javascript
const { data, error } = await supabase.functions.invoke('transcribe-audio', {
  body: { 
    evidence_file_id: 'your-file-id',
    job_id: 'gladia-job-id', 
    check_status: true 
  }
})
```

## Technical Details

### Edge Function Improvements

- **Better error handling**: Failed transcriptions are now properly marked as failed
- **Enhanced status checking**: Uses dedicated `checkGladiaStatus()` function
- **Proper response codes**: Returns appropriate HTTP status codes for different scenarios

### Frontend Improvements

- **Robust polling**: Polls every 5 seconds for up to 5 minutes (60 attempts)
- **User feedback**: Shows progress messages and completion status
- **Error handling**: Properly handles timeouts and API errors
- **State management**: Updates UI state correctly for all scenarios

### Database Updates

The fix ensures proper database state management:
- `transcription_status`: 'pending' → 'processing' → 'completed'/'failed'
- `processing_status`: 'pending' → 'processing' → 'completed'/'failed'
- `processed_at`: Set when transcription completes
- `metadata`: Includes transcription details and timestamps

## Testing

To test the fix:

1. **Upload an audio file** in the journal new page
2. **Click "Transcribe"** - should show "Transcription started - checking for completion..."
3. **Wait for completion** - should show "Transcription completed successfully!" within a few minutes
4. **Check the transcription text** appears in the UI

For stuck transcriptions:
1. Run the cleanup script
2. Check the console output for results
3. Verify transcriptions are now completed in the UI

## Monitoring

The script provides detailed output:
- ✅ Fixed transcriptions
- ⏳ Still processing
- ❌ Failed transcriptions
- 📊 Usage tracking recorded

## Future Improvements

Consider implementing:
1. **Webhook endpoint** for Gladia to notify completion
2. **Background cron job** to periodically check stuck transcriptions
3. **Real-time updates** using Supabase realtime subscriptions
4. **Retry mechanism** for failed transcriptions

## Environment Variables Required

```bash
GLADIA_API_KEY=your_gladia_api_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
```