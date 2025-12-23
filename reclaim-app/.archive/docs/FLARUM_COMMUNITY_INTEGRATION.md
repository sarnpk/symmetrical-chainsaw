# Flarum Community Integration Guide

## Why Flarum is Perfect for Reclaim

**Flarum** is an excellent choice for your abuse survivor community:

✅ **Lightweight & Fast** - Modern, responsive design  
✅ **Privacy-Focused** - No tracking, GDPR compliant  
✅ **Anonymous Posting** - Users can post without revealing identity  
✅ **Powerful Moderation** - Auto-flag keywords, manual approval  
✅ **SSO Integration** - Users login with Reclaim account  
✅ **Open Source** - Free, customizable, no vendor lock-in  
✅ **Mobile Responsive** - Works perfectly on all devices  
✅ **Extensions** - Private discussions, reactions, polls, etc.

## Cost Comparison

| Option | Cost | Pros | Cons |
|--------|------|------|------|
| **Self-hosted (DigitalOcean)** | $12-24/month | Full control, cheapest | Requires setup |
| **Managed (FreeFlarum)** | Free | Zero setup | Limited customization |
| **Managed (Flarum.cloud)** | $19-99/month | Professional support | More expensive |

**Recommendation:** Start with FreeFlarum (free) to test, then move to self-hosted ($12/month) when you grow.

---

## Implementation Plan

### Phase 1: Setup Flarum (1-2 hours)

#### Option A: Quick Start with FreeFlarum (Recommended for Testing)
```bash
# No installation needed!
# Just go to: https://freeflarum.com
# Create forum: reclaim-community.freeflarum.com
# Done in 2 minutes!
```

#### Option B: Self-Hosted on DigitalOcean (Production)
```bash
# 1. Create DigitalOcean droplet ($12/month)
# Ubuntu 22.04, 2GB RAM

# 2. SSH into server
ssh root@your-server-ip

# 3. Install Flarum
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
composer create-project flarum/flarum /var/www/flarum

# 4. Configure web server (Nginx)
# Follow: https://docs.flarum.org/install

# 5. Setup SSL with Let's Encrypt
sudo certbot --nginx -d community.reclaim.app
```

---

### Phase 2: Essential Extensions (30 minutes)

Install these Flarum extensions for abuse survivor communities:

```bash
# In your Flarum directory
composer require flarum/tags              # Organize by topic
composer require flarum/suspend           # Ban abusers/trolls
composer require flarum/approval          # Approve first posts
composer require flarum/lock              # Lock sensitive threads
composer require fof/best-answer          # Mark helpful responses
composer require fof/user-directory       # Member profiles
composer require fof/moderator-notes      # Internal mod notes
composer require fof/nightmode            # Dark mode for comfort
composer require askvortsov/flarum-pwa    # Mobile app experience
```

**Key Extensions for Privacy:**
- `flarum/suspend` - Ban trolls/narcissists
- `flarum/approval` - Approve new user posts
- `fof/moderator-notes` - Track concerning users

---

### Phase 3: SSO Integration with Reclaim (2-3 hours)

Allow users to login to Flarum with their Reclaim account.

#### Step 1: Install Flarum SSO Extension
```bash
composer require fof/oauth
```

#### Step 2: Create OAuth Provider in Reclaim

Create `reclaim-app/src/app/api/oauth/authorize/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.redirect('/signin?redirect=/api/oauth/authorize')
  }

  const { searchParams } = new URL(req.url)
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')
  
  // Generate authorization code
  const code = generateAuthCode(user.id)
  
  return NextResponse.redirect(`${redirectUri}?code=${code}&state=${state}`)
}
```

#### Step 3: Configure Flarum OAuth
In Flarum admin panel:
- OAuth Provider: Custom
- Authorization URL: `https://reclaim.app/api/oauth/authorize`
- Token URL: `https://reclaim.app/api/oauth/token`
- User Info URL: `https://reclaim.app/api/oauth/user`

---

### Phase 4: Customize for Abuse Survivors (1-2 hours)

#### A. Create Safe Categories
```
📁 Getting Started
  - Welcome & Guidelines
  - How to Stay Safe Online
  
📁 Recovery Journey
  - Leaving & No Contact
  - Co-Parenting Strategies
  - Legal Support
  
📁 Healing & Growth
  - Therapy & Self-Care
  - Rebuilding Self-Trust
  - Success Stories
  
📁 Private Support (Members Only)
  - Crisis Support
  - Venting Space
  - Ask Moderators
```

#### B. Setup Auto-Moderation
In Flarum settings:
- **Keyword Filters:** Flag posts containing narcissist tactics language
- **First Post Approval:** All new users need approval for first 3 posts
- **Slow Mode:** Limit posts to 1 per hour for new users
- **Report System:** Easy reporting for harassment

#### C. Create Community Guidelines
```markdown
# Reclaim Community Guidelines

## Our Mission
A safe space for narcissistic abuse survivors to heal, share, and grow.

## Core Rules
1. **Respect Privacy** - No sharing others' personal info
2. **No Victim Blaming** - We support, not judge
3. **Anonymous Welcome** - Use pseudonyms if needed
4. **No Narcissist Tactics** - Gaslighting, manipulation = instant ban
5. **Professional Advice** - We're peers, not therapists

## Safety First
- Don't share identifying details about your abuser
- Use private messages for sensitive topics
- Report concerning behavior immediately
- In crisis? Call emergency services first

## Moderation
- First 3 posts require approval
- Violations = warning → suspension → ban
- Moderators are survivors too - be kind
```

---

### Phase 5: Embed in Reclaim App (1 hour)

#### Option A: Separate Subdomain (Recommended)
```
Main App: https://reclaim.app
Community: https://community.reclaim.app
```

Update `reclaim-app/src/app/community/page.tsx`:
```typescript
export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-purple-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Reclaim Community</h1>
        <p className="mb-4">Connect with survivors, share stories, find support</p>
        <a 
          href="https://community.reclaim.app" 
          target="_blank"
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold"
        >
          Join Community →
        </a>
      </div>
      
      {/* Optional: Embed recent posts */}
      <iframe 
        src="https://community.reclaim.app/embed/recent" 
        className="w-full h-screen border-0"
      />
    </div>
  )
}
```

#### Option B: Full Embed (Less Recommended)
```typescript
// Embed entire Flarum in iframe
<iframe 
  src="https://community.reclaim.app" 
  className="w-full h-screen border-0"
  sandbox="allow-same-origin allow-scripts allow-forms"
/>
```

---

## Moderation Strategy

### Moderator Team
- **Hire 2-3 survivor moderators** ($500-1000/month part-time)
- **Use AI pre-screening** (flag keywords before human review)
- **Rotate shifts** (24/7 coverage for crisis posts)

### Auto-Moderation Rules
```
Flag for review:
- Posts mentioning suicide/self-harm → Immediate mod alert
- Keywords: "kill", "die", "end it" → Crisis resources auto-reply
- Narcissist tactics: "you're crazy", "overreacting" → Auto-flag
- Personal info: phone numbers, addresses → Auto-hide
```

### Escalation Process
1. **Auto-flag** → Mod reviews within 1 hour
2. **Warning** → User notified, post edited/removed
3. **Suspension** → 7-day timeout
4. **Ban** → Permanent removal + IP block

---

## Cost Breakdown

### Year 1 Costs
| Item | Cost |
|------|------|
| Flarum hosting (DigitalOcean) | $144/year |
| Domain (community.reclaim.app) | $12/year |
| SSL Certificate | Free (Let's Encrypt) |
| Moderators (2 part-time) | $12,000/year |
| **Total** | **$12,156/year** |

### Alternative: Start Free
- Use FreeFlarum (free hosting)
- Volunteer moderators from community
- **Total: $0** (until you grow)

---

## Launch Checklist

### Pre-Launch (Week 1)
- [ ] Setup Flarum on FreeFlarum or DigitalOcean
- [ ] Install essential extensions
- [ ] Create categories and guidelines
- [ ] Configure auto-moderation
- [ ] Test SSO integration
- [ ] Recruit 2-3 moderators

### Launch (Week 2)
- [ ] Announce in Reclaim app dashboard
- [ ] Email existing users (opt-in)
- [ ] Post on social media
- [ ] Seed with 10-20 initial posts
- [ ] Monitor closely for first 48 hours

### Post-Launch (Week 3-4)
- [ ] Gather feedback from early users
- [ ] Adjust moderation rules
- [ ] Add requested features
- [ ] Create weekly discussion threads
- [ ] Celebrate first 100 members!

---

## Flarum vs Building Your Own

| Feature | Flarum | Custom Build |
|---------|--------|--------------|
| **Setup Time** | 2 hours | 40+ hours |
| **Cost** | $12-99/month | $0 (your time) |
| **Maintenance** | Low | High |
| **Features** | Rich (extensions) | Limited |
| **Mobile App** | PWA ready | Need to build |
| **Moderation** | Built-in | Need to build |
| **Updates** | Automatic | Manual |
| **Community Support** | Large | None |

**Verdict:** Flarum saves you 100+ hours and $5,000+ in development costs.

---

## Next Steps

1. **Test Flarum:** Create free forum at FreeFlarum.com (5 minutes)
2. **Customize:** Add your branding, categories, guidelines (1 hour)
3. **Integrate:** Add SSO with Reclaim (2 hours)
4. **Launch:** Announce to users and monitor (ongoing)

**Want me to help you set this up?** I can:
- Create the OAuth endpoints for SSO
- Write the community guidelines
- Setup auto-moderation rules
- Create the integration page

Let me know what you need!
