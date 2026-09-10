# Cloudflare Turnstile Integration

## Overview
Cloudflare Turnstile has been integrated into the registration and login pages to prevent bot attacks and automated abuse.

## Implementation Details

### Frontend Integration
- **Location**: `src/app/auth/page.tsx`
- **Library**: `@marsidev/react-turnstile`
- The Turnstile widget appears on both registration and login forms
- Users must complete the challenge before submitting the form
- Token is validated on the client side before submission

### Backend Verification
- **Location**: `src/app/api/verify-turnstile/route.ts`
- Server-side verification ensures tokens are valid
- Prevents bypassing client-side validation

### Configuration
Keys are stored in `.env.local`:
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<from .env.local>
TURNSTILE_SECRET_KEY=<from .env.local>
```

## Features
- ✅ Bot protection on registration
- ✅ Bot protection on login
- ✅ Server-side token verification
- ✅ User-friendly error messages
- ✅ Token expiration handling
- ✅ Disabled submit button until verification completes

## Testing
1. Navigate to `/auth`
2. Complete the Turnstile challenge
3. Submit the form
4. The form will only submit after successful verification

## Security Notes
- Tokens are single-use and expire after a short time
- Server-side verification prevents token replay attacks
- Secret key is never exposed to the client
