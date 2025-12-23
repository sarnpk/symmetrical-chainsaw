# Empowerment Tier Limits

## Overview
Empowerment tier ($24.99/month) has **HIGH but LIMITED** access to prevent abuse and control AI costs.

## Monthly Limits by Category

### Essentials
- Journal Entries: **100/month**
- Reality Anchor: **100/month**
- Toxic Memories: **50/month**
- Letting Go: **50/month**
- Patterns: **50/month**

### Protection Tools
- Grey Rock Templates: **100/month**
- Grey Rock Practice: **100/month**
- BIFF Assistant: **100/month**
- Stonewalling Tracker: **50/month**
- Reactive Abuse Tracker: **50/month**

### Wellness Tools
- Wellness Checks: **100/month**
- Crisis Reframe: **100/month**
- Healing Sessions: **50/month**
- Mind Reset: **100/month**
- Belief Reframe: **50/month**
- Affirmations: **200/month**
- Positive Moments: **100/month**
- No Contact Anchor: **100/month**
- Acceptance: **50/month**
- Role Reframing: **50/month**

### AI Analysis Tools (Most Expensive)
- Narcissist Detector: **50/month**
- Narcissist Simulator: **50/month**
- Manipulation Decoder: **50/month**
- Relationship Health: **30/month**
- NPD Traits: **100/month**
- Gaslighting Tracker: **100/month**
- Empathy Audit: **30/month**

### Support
- AI Coach: **500/month** (most expensive feature)
- Community Posts: **100/month**
- Safety Plan: **Unlimited** (safety critical)
- Feedback: **Unlimited**

### Technical
- Storage: **100 GB**
- Transcription: **600 minutes/month** (10 hours)
- Export Requests: **50/month**

## Cost Analysis

### Estimated Monthly AI Costs per Empowerment User:
- AI Coach (500 uses): ~$1.50
- Narcissist Simulator (50 uses): ~$0.25
- Pattern Analysis (50 uses): ~$0.75
- Other AI features: ~$1.00
- Transcription (600 min): ~$3.60
- **Total: ~$7.10/month**

### Revenue vs Cost:
- Revenue: $24.99/month
- AI Cost: ~$7.10/month
- **Gross Margin: 71.6%**

## Why Not Unlimited?

1. **Cost Control**: Unlimited AI usage could cost $50-100/user/month
2. **Abuse Prevention**: Prevents automated scraping or reselling
3. **Fair Usage**: 500 AI chats/month = 16/day (very generous)
4. **Sustainability**: Ensures platform remains profitable

## Comparison to Recovery Tier

| Feature | Recovery ($15) | Empowerment ($24.99) | Multiplier |
|---------|---------------|---------------------|------------|
| AI Coach | 25/month | 500/month | 20x |
| Simulator | 3/month | 50/month | 16x |
| Transcription | 60 min | 600 min | 10x |
| Storage | 10 GB | 100 GB | 10x |
| Journal | 15/month | 100/month | 6.7x |

## If User Needs More

Users who consistently hit limits can:
1. Contact support for custom enterprise plan
2. Wait for monthly reset
3. Prioritize most important features

## Database Migration

Run this migration to apply limits:
```bash
psql -d your_database -f supabase/migrations/20250202_fix_empowerment_limits.sql
```

Or via Supabase dashboard:
1. Go to SQL Editor
2. Paste contents of `20250202_fix_empowerment_limits.sql`
3. Run migration
