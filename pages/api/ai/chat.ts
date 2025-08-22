// Next.js API route for AI chat with subscription tier limits
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { geminiAI, DEFAULT_FREE_TIER_MODEL, DEFAULT_PAID_TIER_MODEL } from '../../../lib/gemini-ai'
import { AI_LIMITS } from '../../../lib/usage-limits'
import { checkFeatureLimit, recordFeatureUsage } from '../../../lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, context = 'general', conversationHistory = [], conversation_id } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Special case: just return usage info without making AI call
    if (message === '__GET_USAGE_INFO__') {
      // Get user from session
      const authHeader = req.headers.authorization
      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' })
      }

      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)

      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      // Get user's subscription tier
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()

      const subscriptionTier = profile?.subscription_tier || 'foundation'

      const limits = {
        foundation: 5,
        recovery: 100,
        empowerment: -1 // unlimited
      }

      const monthlyLimit = limits[subscriptionTier as keyof typeof limits]

      let remaining = monthlyLimit
      if (monthlyLimit !== -1) {
        const { data: limitCheck } = await checkFeatureLimit(
          user.id,
          'ai_interactions',
          'monthly_count'
        )
        remaining = Math.max(0, monthlyLimit - (limitCheck?.current_usage || 0))
      }

      return res.status(200).json({
        success: true,
        usage_info: {
          subscription_tier: subscriptionTier,
          monthly_limit: monthlyLimit,
          remaining: remaining
        }
      })
    }

    // Get user from session
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get user's subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const subscriptionTier = profile?.subscription_tier || 'foundation'

    // Check usage limits based on subscription tier
    const monthlyLimit = AI_LIMITS[subscriptionTier as keyof typeof AI_LIMITS]
    let currentUsage = 0

    if (monthlyLimit !== -1) {
      const { data: limitCheck, error: limitError } = await checkFeatureLimit(
        user.id, 
        'ai_interactions', 
        'monthly_count'
      )

      if (limitError) {
        console.error('Error checking feature limit:', limitError)
        return res.status(500).json({ error: 'Failed to check usage limits' })
      }

      currentUsage = limitCheck?.current_usage || 0

      if (limitCheck && currentUsage >= monthlyLimit) {
        return res.status(429).json({ 
          error: 'Monthly AI interaction limit reached',
          limit: monthlyLimit,
          current_usage: currentUsage,
          upgrade_required: subscriptionTier === 'foundation' ? 'recovery' : 'empowerment'
        })
      }
    }

    // Select model based on subscription tier
    const model = subscriptionTier === 'foundation' ? DEFAULT_FREE_TIER_MODEL : DEFAULT_PAID_TIER_MODEL

    // Create an AbortController to enforce a server-side timeout
    const controller = new AbortController()
    const TIMEOUT_MS = 18000 // 18s server-side timeout
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    // Rolling history cap: keep the most recent messages and cap total chars to avoid token overflow
    const MAX_MESSAGES = 12
    const MAX_CHARS = 8000
    const recentHistory = (Array.isArray(conversationHistory) ? conversationHistory : [])
      .slice(-MAX_MESSAGES)

    // Further trim by total characters if necessary (oldest-first removal)
    const trimmedHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
    let total = 0
    for (const h of recentHistory) {
      const c = typeof h.content === 'string' ? h.content : ''
      if (total + c.length > MAX_CHARS) break
      const role: 'user' | 'assistant' = h.role === 'assistant' ? 'assistant' : 'user'
      trimmedHistory.push({ role, content: c })
      total += c.length
    }

    // Make AI chat request with abort support
    let aiResponse: string
    try {
      aiResponse = await geminiAI.chat(message, trimmedHistory, context, model, { signal: controller.signal })
    } catch (err) {
      if ((err as any).name === 'AbortError') {
        return res.status(504).json({ error: 'AI request timed out' })
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }

    // Resolve conversation ID: use existing if provided (and owned by user), else create new
    let conversationId = conversation_id as string | undefined
    if (conversationId) {
      const { data: existingConv, error: convGetErr } = await supabase
        .from('ai_conversations')
        .select('id, user_id')
        .eq('id', conversationId)
        .single()
      if (convGetErr || !existingConv || existingConv.user_id !== user.id) {
        return res.status(404).json({ error: 'Conversation not found' })
      }
      // Touch updated_at for ordering
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
        return res.status(500).json({ error: 'Failed to create conversation' })
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
        metadata: { context_type: context }
      })

    // Save AI response
    await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'assistant',
        content: aiResponse,
        metadata: { context_type: context }
      })

    // Record usage for billing
    await recordFeatureUsage(user.id, 'ai_interactions', 'monthly_count', 1, {
      feature: 'ai_chat',
      context_type: context,
      message_length: message.length,
      response_length: aiResponse.length
    })

    res.status(200).json({
      success: true,
      response: aiResponse,
      context,
      usage_info: {
        subscription_tier: subscriptionTier,
        monthly_limit: monthlyLimit,
        remaining: monthlyLimit === -1 ? -1 : Math.max(0, monthlyLimit - currentUsage - 1)
      },
      conversation_id: conversationId
    })

  } catch (error) {
    console.error('AI chat API error:', error)
    res.status(500).json({ 
      error: 'AI chat failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
