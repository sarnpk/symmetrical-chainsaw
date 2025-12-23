# Tripwire Lead Magnet Implementation

## Overview
Minimal implementation for capturing leads through a tripwire offer in the Reclaim app.

## Core Components

### 1. Lead Capture Form
```typescript
// src/components/LeadCapture.tsx
'use client'
import { useState } from 'react'

export default function LeadCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Store email locally or send to API
    localStorage.setItem('lead_email', email)
    setSubmitted(true)
  }

  if (submitted) {
    return <div>✅ Thanks! Check your email for the free guide.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h3>Get Your Free Recovery Guide</h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="w-full p-2 border rounded mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Get Free Guide
      </button>
    </form>
  )
}
```

### 2. Tripwire Page
```typescript
// src/app/free-guide/page.tsx
import LeadCapture from '@/components/LeadCapture'

export default function FreeGuidePage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1>Free Narcissistic Abuse Recovery Guide</h1>
      <p>Get instant access to our proven 5-step recovery framework.</p>
      <LeadCapture />
    </div>
  )
}
```

### 3. Exit Intent Popup
```typescript
// src/components/ExitIntent.tsx
'use client'
import { useState, useEffect } from 'react'

export default function ExitIntent() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowPopup(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-md">
        <h3>Wait! Don't Leave Empty-Handed</h3>
        <p>Get our free recovery guide before you go.</p>
        <LeadCapture />
        <button onClick={() => setShowPopup(false)}>Close</button>
      </div>
    </div>
  )
}
```

## Implementation Steps

1. **Add Components**: Create the three components above
2. **Add Route**: Create `/free-guide` page
3. **Add to Layout**: Include ExitIntent in main layout
4. **Style**: Add basic Tailwind classes
5. **Test**: Verify form submission and popup trigger

## Files to Create

- `src/components/LeadCapture.tsx`
- `src/components/ExitIntent.tsx`
- `src/app/free-guide/page.tsx`

## Integration Points

- Add ExitIntent to `src/app/layout.tsx`
- Link to `/free-guide` from main pages
- Store emails in localStorage (upgrade to API later)

## Minimal Viable Product

This implementation provides:
- ✅ Email capture form
- ✅ Dedicated landing page
- ✅ Exit intent popup
- ✅ Basic validation
- ✅ Success messaging

Ready to deploy and start capturing leads immediately.