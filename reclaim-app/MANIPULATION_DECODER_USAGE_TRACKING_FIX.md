# Manipulation Decoder Usage Tracking Fix

## Issue
The Manipulation Decoder feature was missing AI usage tracking on its API endpoints, allowing unlimited AI interactions regardless of subscription tier.

## Root Cause
Two API routes were missing the `checkAndRecordAIUsage` function:
1. `/api/manipulation-decoder/analyze` - AI analysis of manipulation tactics
2. `/api/manipulation-decoder/transcribe` - Audio transcription via Gladia API

## Solution Applied

### 1. Added Usage Tracking to AI Analysis Route
**File**: `reclaim-app/src/app/api/manipulation-decoder/analyze/route.ts`

Added import and usage check:
```typescript
import { checkAndRecordAIUsage } from '@/lib/usage-tracking';

export async function POST(request: Request) {
  // Check usage and authenticate
  const usageCheck = await checkAndRecordAIUsage('message_analysis');
  if ('error' in usageCheck) {
    return NextResponse.json({ error: usageCheck.error }, { status: usageCheck.status });
  }
  // ... rest of the code
}
```

### 2. Added Usage Tracking to Transcription Route
**File**: `reclaim-app/src/app/api/manipulation-decoder/transcribe/route.ts`

Added import and usage check:
```typescript
import { checkAndRecordAIUsage } from '@/lib/usage-tracking';

export async function POST(request: Request) {
  // Check usage and authenticate
  const usageCheck = await checkAndRecordAIUsage('audio_transcription');
  if ('error' in usageCheck) {
    return NextResponse.json({ error: usageCheck.error }, { status: usageCheck.status });
  }
  // ... rest of the code
}
```

## Usage Limits by Tier
- **Foundation**: 5 AI interactions per month
- **Recovery**: 200 AI interactions per month
- **Empowerment**: 500 AI interactions per month

## What's Tracked
Both routes now track usage under the `ai_interactions` feature with specific metadata:
- AI Analysis: `{ feature: 'narcissist_detector', type: 'message_analysis' }`
- Transcription: `{ feature: 'narcissist_detector', type: 'audio_transcription' }`

## Testing
After deployment, verify:
1. Foundation tier users are limited to 5 AI analyses per month
2. Users receive proper error message when limit is reached
3. Usage is properly recorded in `usage_tracking` table
4. Both AI analysis and transcription count toward the limit

## Status
✅ Fixed and ready for deployment
