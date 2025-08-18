// Next.js API route for AI pattern analysis
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { geminiAI, DEFAULT_FREE_TIER_MODEL, DEFAULT_PAID_TIER_MODEL } from '../../../lib/gemini-ai'
import { createPatternAnalysis, checkFeatureLimit, recordFeatureUsage } from '../../../lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { date_range_start, date_range_end, analysis_type = 'abuse_patterns' } = req.body

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

    // Check if user can perform pattern analysis
    const { data: canAnalyze } = await checkFeatureLimit(user.id, 'pattern_analysis')
    if (!canAnalyze) {
      return res.status(429).json({ 
        error: 'Pattern analysis limit reached for your subscription tier',
        code: 'LIMIT_EXCEEDED'
      })
    }

    // Get journal entries for analysis
    let query = supabase
      .from('journal_entries')
      .select('title, description, incident_date, abuse_types, safety_rating, emotional_state_before, emotional_state_after, location')
      .eq('user_id', user.id)
      .order('incident_date', { ascending: false })

    if (date_range_start) {
      query = query.gte('incident_date', date_range_start)
    }
    if (date_range_end) {
      query = query.lte('incident_date', date_range_end)
    }

    const { data: journalEntries, error: entriesError } = await query.limit(50) // Limit for API efficiency

    if (entriesError) {
      throw new Error(`Failed to fetch journal entries: ${entriesError.message}`)
    }

    if (!journalEntries || journalEntries.length === 0) {
      return res.status(400).json({ 
        error: 'No journal entries found for analysis',
        code: 'NO_DATA'
      })
    }

    // Determine subscription tier to select model
    const subscriptionTier = (await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .maybeSingle()
    ).data?.subscription_tier || 'foundation'

    const model = subscriptionTier === 'foundation' ? DEFAULT_FREE_TIER_MODEL : DEFAULT_PAID_TIER_MODEL

    // Perform AI pattern analysis
    const analysisResult = await geminiAI.analyzePatterns(journalEntries, model)

    // Save analysis results to database
    const { data: savedAnalysis, error: saveError } = await createPatternAnalysis({
      user_id: user.id,
      analysis_type,
      analysis_period_start: date_range_start || journalEntries[journalEntries.length - 1].incident_date,
      analysis_period_end: date_range_end || journalEntries[0].incident_date,
      patterns_identified: analysisResult.patterns_identified,
      insights: analysisResult.insights,
      recommendations: analysisResult.recommendations,
      risk_assessment: analysisResult.risk_assessment,
      confidence_score: 0.85, // Default confidence score
      data_points_analyzed: journalEntries.length,
      ai_model_version: 'gemini-pro-v1'
    })

    if (saveError) {
      console.error('Failed to save analysis:', saveError)
      // Continue anyway, return the analysis even if save fails
    }

    // Record usage for billing
    await recordFeatureUsage(user.id, 'pattern_analysis', 'monthly_count', 1, {
      analysis_type,
      entries_analyzed: journalEntries.length,
      patterns_found: analysisResult.patterns_identified.length
    })

    res.status(200).json({
      success: true,
      analysis_id: savedAnalysis?.id,
      analysis: analysisResult,
      metadata: {
        entries_analyzed: journalEntries.length,
        analysis_period: {
          start: date_range_start || journalEntries[journalEntries.length - 1].incident_date,
          end: date_range_end || journalEntries[0].incident_date
        }
      }
    })

  } catch (error) {
    console.error('Pattern analysis API error:', error)
    res.status(500).json({ 
      error: 'Pattern analysis failed',
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
