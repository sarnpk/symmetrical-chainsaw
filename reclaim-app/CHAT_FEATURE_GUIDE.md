# Community Chat Feature - Implementation Guide

## Overview
Direct messaging system with safety controls for community members.

## Features Implemented

### ✅ Direct Messages (DMs)
- 1-on-1 conversations between users
- **Mutual interaction required**: Both users must have liked or commented on each other's posts
- Real-time message delivery using Supabase Realtime
- Message history with pagination

### ✅ Safety & Moderation
- Block users to prevent messaging
- Report button (uses existing community_reports table)
- Blocked users cannot message each other
- Anonymous posts don't show "Message" button

### ✅ UI Components
- Floating chat panel (bottom-right corner)
- Conversation list
- Real-time messaging interface
- "Message" button on community posts (non-anonymous only)

## Database Schema

### Tables Created
1. `community_conversations` - Chat threads
2. `community_conversation_participants` - Who's in each conversation
3. `community_messages` - Individual messages
4. `community_blocks` - Blocked users

### Key Functions
- `can_dm_user(other_user_id)` - Check if user can message another user
- `get_or_create_conversation(other_user_id)` - Get or create DM conversation

## Setup Instructions

### 1. Apply Database Migration
```bash
# Option A: Via Supabase Dashboard
# Go to SQL Editor and paste contents of:
# supabase/migrations/20250906_community_chat.sql

# Option B: Via CLI (if using local Supabase)
supabase db reset
```

### 2. Enable Realtime (Supabase Dashboard)
1. Go to Database → Replication
2. Enable replication for: `community_messages`

### 3. Test the Feature
1. Create two test accounts
2. Have both users like/comment on each other's posts
3. Click "Message" button on a post
4. Send messages back and forth

## How It Works

### Messaging Flow
1. User clicks "Message" on a non-anonymous post
2. System checks `can_dm_user()`:
   - Are they blocked? ❌
   - Have they mutually interacted? ✅
3. Creates or retrieves conversation
4. Opens chat panel
5. Real-time updates via Supabase Realtime

### Mutual Interaction Logic
Both conditions must be true:
- User A liked/commented on User B's post
- User B liked/commented on User A's post

### Block Feature
To implement block button in chat:
```typescript
// In ChatPanel.tsx, add:
const blockUser = async (userId: string) => {
  await fetch('/api/community/blocks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocked_id: userId })
  })
  toast.success('User blocked')
}
```

## API Endpoints

### Conversations
- `GET /api/community/conversations` - List user's conversations
- `POST /api/community/conversations` - Create conversation
  ```json
  { "other_user_id": "uuid" }
  ```

### Messages
- `GET /api/community/messages?conversation_id=<uuid>` - Get messages
- `POST /api/community/messages` - Send message
  ```json
  { "conversation_id": "uuid", "content": "Hello!" }
  ```

### Blocks
- `GET /api/community/blocks` - List blocked users
- `POST /api/community/blocks` - Block user
  ```json
  { "blocked_id": "uuid" }
  ```
- `DELETE /api/community/blocks?blocked_id=<uuid>` - Unblock user

## Future Enhancements (Phase 2)

### Support Groups with Chat
- Group conversations (already in schema, just disabled)
- Group moderators
- Scheduled meetings
- Member approval workflow

### Additional Safety Features
- Message rate limiting
- Auto-flag abusive content
- Moderator message review
- Read receipts
- Typing indicators

### UI Improvements
- Unread message count badge
- Desktop notifications
- Message search
- File/image sharing
- Emoji reactions

## Troubleshooting

### "Cannot message this user" Error
- Users need mutual interaction (likes/comments)
- Check if either user has blocked the other
- Verify both users exist and are active

### Messages Not Appearing in Real-time
- Check Realtime is enabled in Supabase Dashboard
- Verify browser console for WebSocket errors
- Check RLS policies allow message reads

### Chat Panel Not Showing
- Verify user is logged in
- Check `currentUserId` is passed to ChatPanel
- Look for console errors

## Security Notes

- All tables have RLS enabled
- Users can only see their own conversations
- Messages require conversation participation
- Blocks are enforced at database level
- Anonymous posts don't expose author_id

## Support Groups (Coming Soon)

Currently mocked in UI. To implement:
1. Uncomment group tables in migration
2. Create `/api/community/groups` routes
3. Update `CommunityContent.tsx` to use real data
4. Add group chat functionality
