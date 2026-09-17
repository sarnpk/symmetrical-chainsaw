import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return { error: 'Server misconfigured: missing Supabase env vars', client: null as any }
  }
  return { error: null as string | null, client: createClient(url, serviceKey) }
}

// Daily limits from pricing page — multiply by 30 for monthly equivalents
const TIER_DAILY_LIMITS: Record<string, { ai_daily: number; pattern_daily: number; tx_monthly: number; storage_mb: number }> = {
  foundation: { ai_daily: 2, pattern_daily: 1, tx_monthly: 0, storage_mb: 100 },
  recovery:   { ai_daily: 25, pattern_daily: 10, tx_monthly: 60, storage_mb: 1024 },
  empowerment:{ ai_daily: 50, pattern_daily: 30, tx_monthly: 300, storage_mb: 5120 },
}

function startOfMonthISODate(): string {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  return start.toISOString().slice(0, 10)
}

export async function GET(req: Request) {
  try {
    const { client: supabase, error: cfgErr } = getServerSupabase()
    if (cfgErr) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const tier = (profile?.subscription_tier as string) || 'foundation'
    const tierLimits = TIER_DAILY_LIMITS[tier] || TIER_DAILY_LIMITS.foundation

    const periodStart = startOfMonthISODate()

    // AI interactions: monthly usage from usage_tracking
    const aiMonthlyLimit = tierLimits.ai_daily === -1 ? -1 : tierLimits.ai_daily * 30
    let aiCurrent = 0
    {
      const { data: rows } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_name', 'ai_interactions')
        .eq('usage_type', 'monthly_count')
        .gte('billing_period_start', periodStart)
      aiCurrent = (rows || []).reduce((s: number, r: any) => s + (r.usage_count || 0), 0)
    }

    // Transcription: monthly minutes from evidence_files
    const txMinutesLimit = tierLimits.tx_monthly
    const { data: audioFiles } = await supabase
      .from('evidence_files')
      .select('duration_seconds')
      .eq('user_id', user.id)
      .gte('uploaded_at', new Date(periodStart).toISOString())
      .in('storage_bucket', ['evidence-audio'])
      .limit(5000)
    const usedSeconds = (audioFiles || []).reduce((s: number, f: any) => s + (Number(f.duration_seconds) || 0), 0)
    const usedMinutes = Math.ceil(usedSeconds / 60)

    // Pattern analysis: monthly rows
    const patternMonthlyLimit = tierLimits.pattern_daily === -1 ? -1 : tierLimits.pattern_daily * 30
    let patternCurrent = 0
    {
      const { data: pas } = await supabase
        .from('pattern_analysis')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', new Date(periodStart).toISOString())
      patternCurrent = (pas || []).length
    }

    return NextResponse.json({
      ok: true,
      subscription_tier: tier,
      period_start: periodStart,
      ai_interactions: {
        current: aiCurrent,
        limit: aiMonthlyLimit,
        remaining: aiMonthlyLimit === -1 ? -1 : Math.max(0, aiMonthlyLimit - aiCurrent),
        daily_limit: tierLimits.ai_daily,
      },
      audio_transcription: {
        duration_minutes: usedMinutes,
        minutes_limit: txMinutesLimit,
        minutes_remaining: txMinutesLimit === -1 ? -1 : Math.max(0, txMinutesLimit - usedMinutes),
      },
      pattern_analysis: {
        current: patternCurrent,
        limit: patternMonthlyLimit,
        remaining: patternMonthlyLimit === -1 ? -1 : Math.max(0, patternMonthlyLimit - patternCurrent),
        daily_limit: tierLimits.pattern_daily,
      },
    })
  } catch (e) {
    console.error('usage/limits error:', e)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
