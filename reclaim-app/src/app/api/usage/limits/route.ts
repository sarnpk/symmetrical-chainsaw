import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
  return start.toISOString().slice(0, 10) // YYYY-MM-DD
}

export async function GET(req: Request) {
  try {
    const { client: supabase, error: cfgErr } = getServerSupabase()
    if (cfgErr) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

    // Auth
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // User tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const tier = (profile?.subscription_tier as 'foundation' | 'recovery' | 'empowerment') || 'foundation'

    // Helper: read limit from feature_limits
    const getLimit = async (feature_name: string, limit_type: string): Promise<number> => {
      const { data: row } = await supabase
        .from('feature_limits')
        .select('limit_value')
        .eq('subscription_tier', tier)
        .eq('feature_name', feature_name)
        .eq('limit_type', limit_type)
        .single()
      return typeof row?.limit_value === 'number' ? row!.limit_value : -1
    }

    const periodStart = startOfMonthISODate()

    // AI interactions usage (monthly_count via usage_tracking)
    const aiLimit = await getLimit('ai_interactions', 'monthly_count')
    let aiCurrent = 0
    if (aiLimit !== -1) {
      const { data: usageRows } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_name', 'ai_interactions')
        .eq('usage_type', 'monthly_count')
        .eq('billing_period_start', periodStart)
      aiCurrent = (usageRows || []).reduce((s: number, r: any) => s + (r.usage_count || 0), 0)
    } else {
      // still compute for display if present
      const { data: usageRows } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_name', 'ai_interactions')
        .eq('usage_type', 'monthly_count')
        .eq('billing_period_start', periodStart)
      aiCurrent = (usageRows || []).reduce((s: number, r: any) => s + (r.usage_count || 0), 0)
    }

    // Transcription minutes and count (evidence_files)
    const txMinutesLimit = await getLimit('transcription_minutes', 'minutes')
    const { data: audioFiles, error: filesErr } = await supabase
      .from('evidence_files')
      .select('duration_seconds, uploaded_at, storage_bucket, user_id')
      .eq('user_id', user.id)
      .gte('uploaded_at', new Date(periodStart).toISOString())
      .in('storage_bucket', ['evidence-audio'])
      .limit(5000)
    if (filesErr) {
      return NextResponse.json({ error: 'Failed to read transcription usage' }, { status: 500 })
    }
    const transcriptionsCount = (audioFiles || []).length
    const usedSeconds = (audioFiles || []).reduce((s: number, f: any) => s + (Number(f.duration_seconds) || 0), 0)
    const usedMinutes = Math.ceil(usedSeconds / 60)
    const txMinutesRemaining = txMinutesLimit === -1 ? -1 : Math.max(0, txMinutesLimit - usedMinutes)

    // Pattern analysis usage (count rows this month)
    const patternLimit = await getLimit('pattern_analysis', 'monthly_count')
    let patternCurrent = 0
    {
      const { data: pas } = await supabase
        .from('pattern_analysis')
        .select('id, created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(periodStart).toISOString())
      patternCurrent = (pas || []).length
    }

    // Compose response
    return NextResponse.json({
      ok: true,
      subscription_tier: tier,
      period_start: periodStart,
      ai_interactions: {
        current: aiCurrent,
        limit: aiLimit,
        remaining: aiLimit === -1 ? -1 : Math.max(0, aiLimit - aiCurrent),
      },
      audio_transcription: {
        current: transcriptionsCount,
        limit: -1, // count limit not currently configured; keep -1 and use minutes for gating
        remaining: -1,
        duration_minutes: usedMinutes,
        minutes_limit: txMinutesLimit,
        minutes_remaining: txMinutesRemaining,
      },
      pattern_analysis: {
        current: patternCurrent,
        limit: patternLimit,
        remaining: patternLimit === -1 ? -1 : Math.max(0, patternLimit - patternCurrent),
      },
    })
  } catch (e) {
    console.error('usage/limits error:', e)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
