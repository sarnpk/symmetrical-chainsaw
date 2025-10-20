import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { geminiAI, DEFAULT_FREE_TIER_MODEL, DEFAULT_PAID_TIER_MODEL } from '../../../../../../lib/gemini-ai'
import { checkFeatureLimit, recordFeatureUsage } from '../../../../../../lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, context = 'general', conversationHistory = [], conversation_id } = body || {}

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Ensure Gemini API key is available server-side
    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY.trim() === '') {
      console.error('AI chat API misconfiguration: Missing GOOGLE_AI_API_KEY')
      return NextResponse.json({ error: 'Server misconfigured: missing AI provider key' }, { status: 500 })
    }

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    // Special usage info flow
    if (message === '__GET_USAGE_INFO__') {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()
      const subscriptionTier = profile?.subscription_tier || 'foundation'
      // Fetch limit from feature_limits (configurable in Supabase)
      const { data: limitRow } = await supabase
        .from('feature_limits')
        .select('limit_value')
        .eq('subscription_tier', subscriptionTier)
        .eq('feature_name', 'ai_interactions')
        .eq('limit_type', 'monthly_count')
        .single()
      const monthlyLimit = typeof limitRow?.limit_value === 'number' ? limitRow!.limit_value : -1

      let remaining = monthlyLimit
      if (monthlyLimit !== -1) {
        // Compute current usage for the month
        const now = new Date()
        const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10)
        const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString().slice(0, 10)
        const { data: usageRows } = await supabase
          .from('usage_tracking')
          .select('usage_count')
          .eq('user_id', user.id)
          .eq('feature_name', 'ai_interactions')
          .eq('usage_type', 'monthly_count')
          .eq('billing_period_start', periodStart)
        const used = !usageRows ? 0 : usageRows.reduce((sum: number, r: any) => sum + (r.usage_count || 0), 0)
        remaining = Math.max(0, monthlyLimit - used)
      }
      return NextResponse.json({
        success: true,
        usage_info: {
          subscription_tier: subscriptionTier,
          monthly_limit: monthlyLimit,
          remaining,
        },
      })
    }

    // Auth user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Subscription tier and limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const subscriptionTier = profile?.subscription_tier || 'foundation'
    // Fetch limit from feature_limits (configurable)
    const { data: limitRow } = await supabase
      .from('feature_limits')
      .select('limit_value')
      .eq('subscription_tier', subscriptionTier)
      .eq('feature_name', 'ai_interactions')
      .eq('limit_type', 'monthly_count')
      .single()
    const monthlyLimit = typeof limitRow?.limit_value === 'number' ? limitRow!.limit_value : -1

    if (monthlyLimit !== -1) {
      const { data: allowed, error: limitError } = await checkFeatureLimit(
        user.id,
        'ai_interactions',
        'monthly_count'
      )
      if (limitError) {
        console.error('Error checking feature limit:', limitError)
        return NextResponse.json({ error: 'Failed to check usage limits' }, { status: 500 })
      }
      if (allowed === false) {
        return NextResponse.json({
          error: 'Monthly AI interaction limit reached',
          limit: monthlyLimit,
          upgrade_required: subscriptionTier === 'foundation' ? 'recovery' : 'empowerment',
        }, { status: 429 })
      }
    }

    const model = subscriptionTier === 'foundation' ? DEFAULT_FREE_TIER_MODEL : DEFAULT_PAID_TIER_MODEL

    // Server-side timeout
    const controller = new AbortController()
    const TIMEOUT_MS = 18000
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    // Rolling history cap
    const MAX_MESSAGES = 12
    const MAX_CHARS = 8000
    const recentHistory = (Array.isArray(conversationHistory) ? conversationHistory : []).slice(-MAX_MESSAGES)
    const trimmedHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
    let total = 0
    for (const h of recentHistory) {
      const c = typeof h.content === 'string' ? h.content : ''
      if (total + c.length > MAX_CHARS) break
      const role: 'user' | 'assistant' = h.role === 'assistant' ? 'assistant' : 'user'
      trimmedHistory.push({ role, content: c })
      total += c.length
    }

    let aiResponse = ''
    try {
      aiResponse = await geminiAI.chat(message, trimmedHistory, context, model, { signal: controller.signal })
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return NextResponse.json({ error: 'AI request timed out' }, { status: 504 })
      }
      // Model entitlement or bad request: retry with free-tier model
      const msg = String(err?.message || '')
      const shouldFallback = msg.includes('Gemini API error') && (msg.includes('400') || msg.toLowerCase().includes('bad request'))
      if (shouldFallback && model !== DEFAULT_FREE_TIER_MODEL) {
        try {
          aiResponse = await geminiAI.chat(message, trimmedHistory, context, DEFAULT_FREE_TIER_MODEL, { signal: controller.signal })
        } catch (fallbackErr: any) {
          throw fallbackErr
        }
      } else {
        throw err
      }
    } finally {
      clearTimeout(timeout)
    }

    // Conversation resolve/create
    let conversationId: string | undefined = conversation_id as string | undefined
    if (conversationId) {
      const { data: existingConv, error: convGetErr } = await supabase
        .from('ai_conversations')
        .select('id, user_id')
        .eq('id', conversationId)
        .single()
      if (convGetErr || !existingConv || existingConv.user_id !== user.id) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }
      await supabase
        .from('ai_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)
    } else {
      const title = (message as string).slice(0, 60)
      const { data: convIns, error: convErr } = await supabase
        .from('ai_conversations')
        .insert({ user_id: user.id, title, context_type: context })
        .select('id')
        .single()
      if (convErr || !convIns) {
        console.error('Failed to create conversation:', convErr)
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
      }
      conversationId = convIns.id
    }

    // Save user message
    await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'user',
        content: message,
        metadata: { context_type: context },
      })

    // Save AI message
    await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'assistant',
        content: aiResponse,
        metadata: { context_type: context },
      })

    await recordFeatureUsage(user.id, 'ai_interactions', 'monthly_count', 1, {
      feature: 'ai_chat',
      context_type: context,
      message_length: (message as string).length,
      response_length: aiResponse.length,
    })

    // Compute remaining for response
    let remainingForResponse = -1 as number | -1
    if (monthlyLimit !== -1) {
      const now = new Date()
      const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10)
      const { data: usageRows } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_name', 'ai_interactions')
        .eq('usage_type', 'monthly_count')
        .eq('billing_period_start', periodStart)
      const used = !usageRows ? 0 : usageRows.reduce((sum: number, r: any) => sum + (r.usage_count || 0), 0)
      remainingForResponse = Math.max(0, monthlyLimit - used)
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      context,
      usage_info: {
        subscription_tier: subscriptionTier,
        monthly_limit: monthlyLimit,
        remaining: monthlyLimit === -1 ? -1 : remainingForResponse,
      },
      conversation_id: conversationId,
    })
  } catch (error: any) {
    console.error('AI chat API error:', error)
    return NextResponse.json({ error: 'AI chat failed', message: error?.message || 'Unknown error' }, { status: 500 })
  }
}
