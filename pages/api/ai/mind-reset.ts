// Next.js API route for AI mind reset tool
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { geminiAI } from '../../../lib/gemini-ai'
import { createMindResetSession, checkFeatureLimit, recordFeatureUsage } from '../../../lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { 
      original_thought, 
      session_type = 'thought_reframe',
      context = {},
      mood_before 
    } = req.body

    if (!original_thought) {
      return res.status(400).json({ error: 'Original thought is required' })
    }

    // Get user from session/auth header
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization required' })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid authorization' })
    }

    // Check if user can use AI features
    const { data: canUseAI } = await checkFeatureLimit(user.id, 'ai_interactions')
    if (!canUseAI) {
      return res.status(429).json({ 
        error: 'AI interaction limit reached for your subscription tier',
        code: 'LIMIT_EXCEEDED'
      })
    }

    // Perform AI mind reset
    const mindResetResult = await geminiAI.mindReset(original_thought, context)

    // Save mind reset session to database
    const { data: savedSession, error: saveError } = await createMindResetSession({
      user_id: user.id,
      session_type,
      original_thought,
      reframed_thought: mindResetResult.reframed_thought,
      techniques_used: mindResetResult.techniques_suggested,
      mood_before,
      effectiveness_rating: mindResetResult.effectiveness_prediction,
      notes: `AI-generated reframe using ${session_type} technique`
    })

    if (saveError) {
      console.error('Failed to save mind reset session:', saveError)
      // Continue anyway, return the result even if save fails
    }

    // Record usage for billing
    await recordFeatureUsage(user.id, 'ai_interactions', 'monthly_count', 1, {
      feature: 'mind_reset',
      session_type,
      effectiveness_prediction: mindResetResult.effectiveness_prediction
    })

    res.status(200).json({
      success: true,
      session_id: savedSession?.id,
      result: mindResetResult,
      metadata: {
        session_type,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Mind reset API error:', error)
    res.status(500).json({ 
      error: 'Mind reset failed',
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
