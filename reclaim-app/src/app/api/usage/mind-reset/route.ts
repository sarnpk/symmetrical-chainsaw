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

    // Tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const tier = (profile?.subscription_tier as 'foundation' | 'recovery' | 'empowerment') || 'foundation'

    // Configured limit
    const { data: limitRow } = await supabase
      .from('feature_limits')
      .select('limit_value')
      .eq('subscription_tier', tier)
      .eq('feature_name', 'mind_reset_sessions')
      .eq('limit_type', 'monthly_count')
      .single()
    const limit = typeof limitRow?.limit_value === 'number' ? limitRow!.limit_value : -1

    // Current usage this billing month (usage_tracking via record_feature_usage)
    const periodStart = startOfMonthISODate()
    const { data: usageRows } = await supabase
      .from('usage_tracking')
      .select('usage_count')
      .eq('user_id', user.id)
      .eq('feature_name', 'mind_reset_sessions')
      .eq('usage_type', 'monthly_count')
      .eq('billing_period_start', periodStart)
    const current = (usageRows || []).reduce((s: number, r: any) => s + (r.usage_count || 0), 0)

    const remaining = limit === -1 ? -1 : Math.max(0, limit - current)

    return NextResponse.json({
      ok: true,
      subscription_tier: tier,
      period_start: periodStart,
      mind_reset_sessions: {
        current,
        limit,
        remaining,
      }
    })
  } catch (e) {
    console.error('usage/mind-reset error:', e)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
