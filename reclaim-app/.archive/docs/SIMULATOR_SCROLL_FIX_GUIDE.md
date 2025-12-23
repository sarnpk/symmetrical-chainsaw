# Narcissist Simulator - Scroll Fix Implementation Guide

## Problem
The Narcissist Simulator UI has scroll issues:
- Messages don't stay at bottom when typing
- No scroll-to-bottom button
- Awkward scrolling behavior
- Input sticks to bottom incorrectly

## Solution
Implement the same scroll handling as AI Coach (`src/app/ai-coach/AICoachContent.tsx`)

## Key Changes Needed

### 1. Add Scroll Container Ref
```typescript
const chatContainerRef = useRef<HTMLDivElement>(null)
const [showScrollButton, setShowScrollButton] = useState(false)
const [userHasScrolled, setUserHasScrolled] = useState(false)
```

### 2. Update Scroll Functions
```typescript
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  }
}

const checkIfNearBottom = () => {
  if (!chatContainerRef.current) return true
  const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
  const threshold = 150
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight
  return distanceFromBottom < threshold
}

const handleScroll = () => {
  setShowScrollButton(!checkIfNearBottom())
  if (loading) {
    setUserHasScrolled(true)
  }
}
```

### 3. Update Layout Structure
Change from current structure to:
```tsx
<div className="fixed inset-0 lg:left-64 flex flex-col bg-gray-50">
  {/* Header */}
  <div className="bg-white border-b shrink-0 mt-16 lg:mt-0">
    {/* Header content */}
  </div>

  {/* Chat Messages - Single scroll container */}
  <div
    ref={chatContainerRef}
    onScroll={handleScroll}
    className="flex-1 overflow-y-auto overflow-x-hidden"
  >
    {/* Messages */}
  </div>

  {/* Scroll to Bottom Button */}
  {showScrollButton && (
    <div className="fixed bottom-20 right-4 z-50">
      <button onClick={() => scrollToBottom('smooth')}>
        <ArrowDown />
      </button>
    </div>
  )}

  {/* Input Area - Fixed at bottom */}
  <div className="border-t bg-white p-3 shrink-0">
    {/* Input */}
  </div>
</div>
```

### 4. Import ArrowDown Icon
```typescript
import { ArrowDown } from 'lucide-react'
```

### 5. Update sendMessage Function
```typescript
const sendMessage = async () => {
  // ... existing code ...
  
  setMessages(prev => [...prev, userMessage])
  setInputMessage('')
  setLoading(true)

  // Scroll to bottom after message is added
  requestAnimationFrame(() => {
    requestAnimationFrame(() => scrollToBottom('smooth'))
  })

  // ... rest of code ...
}
```

### 6. Smart Auto-Scroll During Response
```typescript
// In the response handling:
let shouldAutoScroll = checkIfNearBottom()
setUserHasScrolled(false)

// During message updates:
if (shouldAutoScroll && !userHasScrolled && chatContainerRef.current) {
  const isStillNearBottom = checkIfNearBottom()
  if (isStillNearBottom) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  } else {
    shouldAutoScroll = false
  }
}
```

## Complete Implementation Steps

### Step 1: Update Imports
Add `ArrowDown` to lucide-react imports

### Step 2: Add State Variables
```typescript
const chatContainerRef = useRef<HTMLDivElement>(null)
const [showScrollButton, setShowScrollButton] = useState(false)
const [userHasScrolled, setUserHasScrolled] = useState(false)
```

### Step 3: Replace scrollToBottom and Add Helper Functions
Replace the simple `scrollToBottom` with the enhanced version plus `checkIfNearBottom` and `handleScroll`

### Step 4: Update useEffect
Remove the simple useEffect that scrolls on every message change

### Step 5: Restructure JSX
- Wrap everything in `fixed inset-0` container
- Make chat area the scroll container with `ref={chatContainerRef}`
- Add scroll button component
- Ensure input is `shrink-0` and fixed at bottom

### Step 6: Update sendMessage
Add the `requestAnimationFrame` scroll logic after adding user message

### Step 7: Test
- Send messages - should auto-scroll
- Scroll up while typing - should show scroll button
- Click scroll button - should scroll to bottom
- Scroll up during AI response - should not force scroll

## Benefits

### Before (Current):
- ❌ Messages jump around
- ❌ Input area behavior is awkward
- ❌ No way to scroll to bottom easily
- ❌ Forces scroll even when reading above

### After (Fixed):
- ✅ Smooth scrolling
- ✅ Input stays fixed at bottom
- ✅ Scroll-to-bottom button appears when needed
- ✅ Smart scroll - doesn't interrupt reading
- ✅ Same UX as AI Coach

## File to Modify
`reclaim-app/src/app/narcissist-simulator/page.tsx`

## Backup Created
`reclaim-app/src/app/narcissist-simulator/page.tsx.backup`

## Testing Checklist
- [ ] Start new session
- [ ] Send message - auto-scrolls
- [ ] Scroll up - button appears
- [ ] Click button - scrolls to bottom
- [ ] Scroll up during AI response - doesn't force scroll
- [ ] Mobile responsive
- [ ] Input stays at bottom
- [ ] WhatsApp UI still looks good

## Status
Ready to implement. The changes follow the exact pattern from AI Coach which works perfectly.
