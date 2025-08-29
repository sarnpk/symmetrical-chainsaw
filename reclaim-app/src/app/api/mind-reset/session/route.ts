import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { geminiAI, DEFAULT_FREE_TIER_MODEL, DEFAULT_PAID_TIER_MODEL } from '../../../../../../lib/gemini-ai'
import { checkFeatureLimit, recordFeatureUsage } from '../../../../../../lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('page_size') || '20', 10)))
    const sessionType = searchParams.get('session_type') || undefined

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('mind_reset_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (sessionType) {
      query = query.eq('session_type', sessionType)
    }

    const { data, error, count } = await query
    if (error) {
      console.error('Failed to fetch sessions:', error)
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sessions: data || [],
      pagination: {
        page,
        page_size: pageSize,
        total: count ?? 0,
        has_more: (count ?? 0) > to + 1,
      }
    })
  } catch (error: any) {
    console.error('Mind reset GET error:', error)
    return NextResponse.json({ error: 'Failed to list sessions', message: error?.message || 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const body = await req.json().catch(() => ({}))
    const {
      session_type = 'thought_reframe',
      original_thought,
      context = {},
      duration_minutes,
      mood_before,
      mood_after,
      notes,
    } = body || {}

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Fetch subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const subscriptionTier = (profile as any)?.subscription_tier || 'foundation'

    // Determine monthly limit configured in feature_limits for this tier
    const { data: limitRow } = await supabase
      .from('feature_limits')
      .select('limit_value')
      .eq('subscription_tier', subscriptionTier)
      .eq('feature_name', 'mind_reset_sessions')
      .eq('limit_type', 'monthly_count')
      .single()
    const monthlyLimit = typeof (limitRow as any)?.limit_value === 'number' ? (limitRow as any).limit_value as number : -1

    // Enforce usage limit if not unlimited (-1)
    if (monthlyLimit !== -1) {
      const { data: allowed, error: limitError } = await checkFeatureLimit(
        user.id,
        'mind_reset_sessions',
        'monthly_count'
      )
      if (limitError) {
        console.error('Error checking feature limit:', limitError)
        return NextResponse.json({ error: 'Failed to check usage limits' }, { status: 500 })
      }
      if (allowed === false) {
        return NextResponse.json({
          error: 'Monthly Mind Reset limit reached',
          limit: monthlyLimit,
          upgrade_required: subscriptionTier === 'foundation' ? 'recovery' : 'empowerment',
        }, { status: 429 })
      }
    }

    // If the session is AI-based reframing, require AI key and call Gemini
    let reframed_thought: string | undefined
    let techniques_used: string[] | undefined
    let effectiveness_rating: number | undefined

    if (session_type === 'thought_reframe') {
      if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY.trim() === '') {
        console.error('Mind Reset API misconfiguration: Missing GOOGLE_AI_API_KEY')
        return NextResponse.json({ error: 'Server misconfigured: missing AI provider key' }, { status: 500 })
      }
      if (!original_thought || typeof original_thought !== 'string') {
        return NextResponse.json({ error: 'original_thought is required for thought_reframe' }, { status: 400 })
      }

      const model = subscriptionTier === 'foundation' ? DEFAULT_FREE_TIER_MODEL : DEFAULT_PAID_TIER_MODEL

      const aiResult = await geminiAI.mindReset(original_thought, context, model)
      // Persist key AI outputs
      reframed_thought = aiResult.reframed_thought
      techniques_used = aiResult.techniques_suggested
      effectiveness_rating = aiResult.effectiveness_prediction
    }

    // Insert session row
    const { data: inserted, error: insertErr } = await supabase
      .from('mind_reset_sessions')
      .insert({
        user_id: user.id,
        session_type,
        original_thought,
        reframed_thought,
        techniques_used,
        duration_minutes,
        mood_before,
        mood_after,
        effectiveness_rating,
        notes,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single()

    if (insertErr) {
      console.error('Failed to create session:', insertErr)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    // Record usage only for AI thought reframing. Non-AI sessions (e.g., breathing) shouldn't decrement monthly usage.
    if (session_type === 'thought_reframe') {
      await recordFeatureUsage(user.id, 'mind_reset_sessions', 'monthly_count', 1, {
        session_type,
        used_ai: true,
      })
    }

    return NextResponse.json({
      success: true,
      session: inserted,
    })
  } catch (error: any) {
    console.error('Mind reset POST error:', error)
    return NextResponse.json({ error: 'Failed to create session', message: error?.message || 'Unknown error' }, { status: 500 })
  }
}
