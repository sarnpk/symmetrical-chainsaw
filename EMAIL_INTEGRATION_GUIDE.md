# Email Integration Guide

## Current Status
Emails from lead magnets are currently **logged to console only**. They are not being sent to users.

## Where Emails Are Captured

### Database Storage
All email captures are stored in the `newsletter_subscriptions` table in Supabase:
- Email address
- Source (tool name)
- Metadata (results, stage, etc.)
- Timestamp

### Console Logs
Check your server console for email capture logs:
```
Lead Magnet Capture: {
  email: "user@example.com",
  tool: "gaslighting-reality-check",
  severity: "moderate",
  timestamp: "2025-01-05T..."
}

EMAIL TO SEND: {
  to: "user@example.com",
  subject: "🎁 Your Free Reality Anchor Kit is Here!",
  content: "...",
  attachments: ["/docs/reality-anchor-kit.pdf"]
}
```

## Lead Magnet Email Types

### 1. Gaslighting Reality Check
- **Tool**: `gaslighting-reality-check`
- **Subject**: "🎁 Your Free Reality Anchor Kit is Here!"
- **Content**: Reality validation kit with checklists
- **Attachment**: `/docs/reality-anchor-kit.pdf`

### 2. Discard Stage Test
- **Tool**: `discard-stage-test` (default)
- **Subject**: "🎁 Your Free [Stage Name] Survival Guide"
- **Content**: Stage-specific survival guide
- **Attachment**: `/docs/[stage]-survival-guide.pdf`

### 3. Other Tools
All other free tools follow the default pattern with survival guides.

## To Enable Actual Email Sending

### Option 1: Resend (Recommended)
```bash
npm install resend
```

Add to `.env.local`:
```
RESEND_API_KEY=your_resend_key
```

Update `/api/lead-magnet/capture/route.ts`:
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// Replace the TODO comment with:
await resend.emails.send({
  from: 'noreply@reclaim.app',
  to: email,
  subject: emailContent.subject,
  html: emailContent.body
})
```

### Option 2: SendGrid
```bash
npm install @sendgrid/mail
```

### Option 3: Mailgun
```bash
npm install mailgun-js
```

## PDF Attachments Needed

Create these PDF files in `/public/docs/`:
- `reality-anchor-kit.pdf` (Gaslighting Reality Check)
- `devaluation-survival-guide.pdf` (Discard Stage Test)
- `discard-survival-guide.pdf` (Discard Stage Test)
- `post-discard-survival-guide.pdf` (Discard Stage Test)
- `hoover-survival-guide.pdf` (Discard Stage Test)

## Email Templates

The current email templates are basic HTML. For better results:
1. Create proper HTML email templates
2. Add branding and styling
3. Include unsubscribe links
4. Add tracking pixels (optional)

## Testing

To test email integration:
1. Take any free tool assessment
2. Enter your email
3. Check server console for logs
4. Verify database entry in Supabase

## Next Steps

1. **Choose email service** (Resend recommended)
2. **Create PDF attachments** for each tool
3. **Update email templates** with proper HTML
4. **Add unsubscribe functionality**
5. **Set up email sequences** for nurturing leads