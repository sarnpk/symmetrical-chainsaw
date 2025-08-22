import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper to safely create a Supabase client at request time.
// Avoids import-time crashes during build when env vars are not present.
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return { error: 'Server misconfigured: missing Supabase env vars', client: null as any }
  }
  return { error: null as string | null, client: createClient(url, serviceKey) }
}

type Tier = 'foundation' | 'recovery' | 'empowerment'

function startOfCurrentMonthUTC(): string {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0))
  return start.toISOString()
}

export async function GET(request: Request) {
  try {
    const { client: supabase, error: cfgError } = getServerSupabase()
    if (cfgError) {
      console.error('usage/transcription config error:', cfgError)
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    // Auth
    const authHeader = request.headers.get('authorization') || ''
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const tier = ((profile as any)?.subscription_tier || 'foundation') as Tier

    // Fetch limit from Supabase feature_limits (minutes)
    const { data: limitRow, error: limitErr } = await supabase
      .from('feature_limits')
      .select('limit_value')
      .eq('subscription_tier', tier)
      .eq('feature_name', 'transcription_minutes')
      .eq('limit_type', 'minutes')
      .single()
    if (limitErr) {
      console.error('transcription limit read error:', limitErr)
      return NextResponse.json({ error: 'Failed to read plan limits' }, { status: 500 })
    }
    const monthlyLimitMin = typeof limitRow?.limit_value === 'number' ? limitRow!.limit_value : -1

    // Sum usage for current month
    const since = startOfCurrentMonthUTC()
    const { data: files, error: filesError } = await supabase
      .from('evidence_files')
      .select('duration_seconds, uploaded_at, user_id, storage_bucket')
      .eq('user_id', user.id)
      .gte('uploaded_at', since)
      .in('storage_bucket', ['evidence-audio'])
      .limit(2000) // safety cap

    if (filesError) {
      return NextResponse.json({ error: 'Failed to load usage' }, { status: 500 })
    }

    const usedSeconds = (files || [])
      .map((f: any) => Number(f.duration_seconds) || 0)
      .reduce((a: number, b: number) => a + b, 0)

    const usedMinutes = Math.ceil(usedSeconds / 60)

    let remainingMinutes: number | 'unlimited' = 0
    if (monthlyLimitMin === -1) {
      remainingMinutes = 'unlimited'
    } else if (monthlyLimitMin <= 0) {
      remainingMinutes = 0
    } else {
      remainingMinutes = Math.max(monthlyLimitMin - usedMinutes, 0)
    }

    return NextResponse.json({
      ok: true,
      tier,
      usedMinutes,
      limitMinutes: monthlyLimitMin === -1 ? 'unlimited' : monthlyLimitMin,
      remainingMinutes,
      since,
    })
  } catch (e) {
    console.error('usage/transcription error:', e)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Allow POST as alias of GET for convenience
  return GET(request)
}
