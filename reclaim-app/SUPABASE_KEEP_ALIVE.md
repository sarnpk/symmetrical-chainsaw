# Keep Supabase Awake on Free Tier

## Problem
Supabase free tier pauses after 7 days of inactivity.

## Solution
Netlify scheduled function pings Supabase every 5 minutes.

## Files Created

### 1. `netlify/functions/keep-alive.ts`
Serverless function that pings Supabase REST API.

### 2. `netlify.toml` (updated)
Added scheduled function configuration:
```toml
[[functions.keep-alive.schedule]]
  cron = "*/5 * * * *"  # Every 5 minutes
```

## How It Works

1. **Netlify deploys** the scheduled function
2. **Every 5 minutes**, Netlify runs `keep-alive.ts`
3. **Function pings** Supabase REST API
4. **Supabase stays active** (no 7-day pause)

## Setup (Automatic)

Once deployed to Netlify, the scheduled function runs automatically. No additional setup needed!

## Verify It's Working

### Check Netlify Logs
1. Go to Netlify Dashboard
2. Click your site
3. Go to **Functions** tab
4. Click **keep-alive**
5. See execution logs every 5 minutes

### Manual Test
Visit: `https://your-site.netlify.app/.netlify/functions/keep-alive`

Expected response:
```json
{
  "success": true,
  "timestamp": "2025-01-15T10:00:00.000Z",
  "supabaseStatus": "active"
}
```

## Cost

**Free!** Netlify includes:
- 125,000 function invocations/month
- This uses ~8,640/month (every 5 min)
- Well within free tier

## Alternative: Adjust Frequency

Edit `netlify.toml` to change frequency:

```toml
# Every 10 minutes (uses less invocations)
cron = "*/10 * * * *"

# Every hour (minimal usage)
cron = "0 * * * *"

# Every 30 minutes (balanced)
cron = "*/30 * * * *"
```

## Disable Keep-Alive

Remove from `netlify.toml`:
```toml
[[functions.keep-alive.schedule]]
  cron = "*/5 * * * *"
```

## Notes

- Function runs even when site has no traffic
- Prevents Supabase from pausing
- No impact on site performance
- Logs available in Netlify dashboard
