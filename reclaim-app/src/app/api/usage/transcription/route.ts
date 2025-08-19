import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role client for server-side auth and RLS bypass when needed
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TRANSCRIPTION_LIMITS_MIN = {
  foundation: 0,
  recovery: 300,
  empowerment: 600,
} as const

type Tier = keyof typeof TRANSCRIPTION_LIMITS_MIN

function startOfCurrentMonthUTC(): string {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0))
  return start.toISOString()
}

export async function GET(request: Request) {
  try {
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

    const monthlyLimitMin = TRANSCRIPTION_LIMITS_MIN[tier]

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
    if (monthlyLimitMin <= 0 && tier === 'empowerment') {
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
      limitMinutes: monthlyLimitMin <= 0 && tier === 'empowerment' ? 'unlimited' : monthlyLimitMin,
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
