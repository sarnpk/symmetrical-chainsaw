# Chat Feature Simulation - Multiple Conversations

## Updated Logic

### Chat Enable/Disable Toggle
- **ON (default)**: User can receive messages (with mutual interaction)
- **OFF**: User cannot send or receive any messages

### Requirements for Messaging
**BOTH conditions must be true:**
1. ✅ Both users have chat **enabled**
2. ✅ Mutual interaction (both liked/commented on each other's posts)

---

## Scenario: 3 Users with Multiple Conversations

### Users
- **Alice** (chat enabled)
- **Bob** (chat enabled)  
- **Charlie** (chat disabled)

### Interactions
```
Alice ❤️ Bob's post
Bob ❤️ Alice's post
✅ Alice ↔ Bob can message

Alice ❤️ Charlie's post
Charlie ❤️ Alice's post
❌ Alice ↔ Charlie CANNOT message (Charlie has chat disabled)

Bob comments on Charlie's post
Charlie comments on Bob's post
❌ Bob ↔ Charlie CANNOT message (Charlie has chat disabled)
```

---

## Database Structure

### Conversations Table
```sql
id                                  | created_at
------------------------------------|------------------
550e8400-e29b-41d4-a716-446655440000| 2025-01-15 10:00
```

### Participants Table
```sql
conversation_id                     | user_id (Alice)                     | last_read_at
------------------------------------|-------------------------------------|------------------
550e8400-e29b-41d4-a716-446655440000| 123e4567-e89b-12d3-a456-426614174000| 2025-01-15 10:05

conversation_id                     | user_id (Bob)                       | last_read_at
------------------------------------|-------------------------------------|------------------
550e8400-e29b-41d4-a716-446655440000| 789e0123-e89b-12d3-a456-426614174001| 2025-01-15 10:03
```

### Messages Table
```sql
id  | conversation_id                     | sender_id (Alice)                   | content           | created_at
----|-------------------------------------|-------------------------------------|-------------------|------------------
1   | 550e8400-e29b-41d4-a716-446655440000| 123e4567-e89b-12d3-a456-426614174000| "Hi Bob!"         | 2025-01-15 10:00
2   | 550e8400-e29b-41d4-a716-446655440000| 789e0123-e89b-12d3-a456-426614174001| "Hey Alice!"      | 2025-01-15 10:01
3   | 550e8400-e29b-41d4-a716-446655440000| 123e4567-e89b-12d3-a456-426614174000| "How are you?"    | 2025-01-15 10:02
```

---

## UI Flow: Alice's Perspective

### 1. Alice Opens Chat Panel
```
┌─────────────────────────────┐
│ Messages               ⚙ ✕ │
├─────────────────────────────┤
│ 📧 Bob                      │
│ "How are you?"              │
│ 3 minutes ago               │
├─────────────────────────────┤
│ No other conversations      │
└─────────────────────────────┘
```

### 2. Alice Clicks on Bob's Conversation
```
┌─────────────────────────────┐
│ ← Back              ⚙ ✕    │
├─────────────────────────────┤
│                             │
│  ┌─────────────────┐        │
│  │ Hi Bob!         │ Alice  │
│  └─────────────────┘        │
│                             │
│        ┌─────────────────┐  │
│   Bob  │ Hey Alice!      │  │
│        └─────────────────┘  │
│                             │
│  ┌─────────────────┐        │
│  │ How are you?    │ Alice  │
│  └─────────────────┘        │
│                             │
├─────────────────────────────┤
│ [Type a message...    ] 📤 │
└─────────────────────────────┘
```

### 3. Bob Replies (Polling Updates Every 2 Seconds)
```
┌─────────────────────────────┐
│ ← Back              ⚙ ✕    │
├─────────────────────────────┤
│                             │
│  ┌─────────────────┐        │
│  │ Hi Bob!         │ Alice  │
│  └─────────────────┘        │
│                             │
│        ┌─────────────────┐  │
│   Bob  │ Hey Alice!      │  │
│        └─────────────────┘  │
│                             │
│  ┌─────────────────┐        │
│  │ How are you?    │ Alice  │
│  └─────────────────┘        │
│                             │
│        ┌─────────────────┐  │
│   Bob  │ I'm good! You?  │  │ ← NEW
│        └─────────────────┘  │
│                             │
├─────────────────────────────┤
│ [Type a message...    ] 📤 │
└─────────────────────────────┘
```

---

## Multiple Conversations Example

### Alice Has 3 Conversations

**Conversation List:**
```
┌─────────────────────────────┐
│ Messages               ⚙ ✕ │
├─────────────────────────────┤
│ 📧 Bob                      │
│ "I'm good! You?"            │
│ Just now                    │
├─────────────────────────────┤
│ 📧 David                    │
│ "Thanks for the advice"     │
│ 5 minutes ago               │
├─────────────────────────────┤
│ 📧 Emma                     │
│ "See you tomorrow!"         │
│ 1 hour ago                  │
└─────────────────────────────┘
```

Each conversation is **independent**:
- Separate message history
- Separate participants
- Separate last_read_at timestamps

---

## How Polling Works

### Every 2 Seconds (When Chat is Open)
```javascript
// In ChatPanel.tsx
useEffect(() => {
  if (activeConv) {
    loadMessages(activeConv)
    const interval = setInterval(() => {
      loadMessages(activeConv) // Fetch new messages
    }, 2000)
    return () => clearInterval(interval)
  }
}, [activeConv])
```

### API Call
```
GET /api/community/messages?conversation_id=550e8400-e29b-41d4-a716-446655440000
```

### Response
```json
{
  "items": [
    {
      "id": "msg-1",
      "content": "Hi Bob!",
      "sender_id": "alice-id",
      "created_at": "2025-01-15T10:00:00Z"
    },
    {
      "id": "msg-2",
      "content": "Hey Alice!",
      "sender_id": "bob-id",
      "created_at": "2025-01-15T10:01:00Z"
    }
  ]
}
```

---

## Chat Disabled Scenario

### Charlie Disables Chat

**Before:**
```
Charlie's Settings:
✅ Enable Chat [ON]
```

**After:**
```
Charlie's Settings:
❌ Enable Chat [OFF]
```

### What Happens:

1. **Existing conversations** with Charlie remain in database
2. **New messages** cannot be sent to Charlie
3. **Message button** disappears from Charlie's posts
4. **Error message** if someone tries: "Cannot message this user"

### Database Check
```sql
-- can_dm_user() function checks:
SELECT chat_enabled FROM profiles WHERE id = 'charlie-id'
-- Returns: false
-- Result: ❌ Cannot message
```

---

## Summary

### ✅ What Works:
- Multiple independent conversations per user
- Each conversation has unique ID
- Messages are isolated per conversation
- Polling keeps messages updated (2-second refresh)
- Chat enable/disable toggle controls all messaging

### 🔒 Security:
- RLS policies enforce conversation participation
- Can only see messages in your conversations
- Both users must have chat enabled
- Mutual interaction required
- Block feature prevents unwanted contact

### 📊 Scalability:
- Conversations are lightweight (just IDs)
- Messages are paginated (50 per load)
- Polling is efficient (only active conversation)
- No WebSocket overhead (free tier compatible)
