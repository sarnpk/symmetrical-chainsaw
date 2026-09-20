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

    // Query feature_limits table for this tier
    const { data: limits } = await supabase
      .from('feature_limits')
      .select('feature_name, limit_type, limit_value')
      .eq('subscription_tier', tier)

    const limitMap: Record<string, number> = {}
    for (const row of limits || []) {
      limitMap[`${row.feature_name}:${row.limit_type}`] = row.limit_value
    }

    const getLimit = (feature: string, type: string = 'monthly_count') =>
      limitMap[`${feature}:${type}`] ?? 0

    const periodStart = startOfMonthISODate()

    // AI interactions: count from usage_tracking this month
    const aiLimit = getLimit('ai_interactions')
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

    // Transcription: minutes from evidence_files this month
    const txMinutesLimit = getLimit('transcription_minutes')
    const { data: audioFiles } = await supabase
      .from('evidence_files')
      .select('duration_seconds')
      .eq('user_id', user.id)
      .gte('uploaded_at', new Date(periodStart).toISOString())
      .in('storage_bucket', ['evidence-audio'])
      .limit(5000)
    const usedSeconds = (audioFiles || []).reduce((s: number, f: any) => s + (Number(f.duration_seconds) || 0), 0)
    const usedMinutes = Math.ceil(usedSeconds / 60)

    // Pattern analysis: count from pattern_analysis this month
    const patternLimit = getLimit('pattern_analysis')
    let patternCurrent = 0
    {
      const { data: pas } = await supabase
        .from('pattern_analysis')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', new Date(periodStart).toISOString())
      patternCurrent = (pas || []).length
    }

    const unlimited = (v: number) => v === -1

    return NextResponse.json({
      ok: true,
      subscription_tier: tier,
      period_start: periodStart,
      ai_interactions: {
        current: aiCurrent,
        limit: aiLimit,
        remaining: unlimited(aiLimit) ? -1 : Math.max(0, aiLimit - aiCurrent),
      },
      audio_transcription: {
        current: usedMinutes,
        limit: txMinutesLimit,
        remaining: unlimited(txMinutesLimit) ? -1 : Math.max(0, txMinutesLimit - usedMinutes),
        duration_minutes: usedMinutes,
        minutes_limit: txMinutesLimit,
        minutes_remaining: unlimited(txMinutesLimit) ? -1 : Math.max(0, txMinutesLimit - usedMinutes),
      },
      pattern_analysis: {
        current: patternCurrent,
        limit: patternLimit,
        remaining: unlimited(patternLimit) ? -1 : Math.max(0, patternLimit - patternCurrent),
      },
    })
  } catch (e) {
    console.error('usage/limits error:', e)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}