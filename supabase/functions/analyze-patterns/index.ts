import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const reqBody = await req.json().catch(() => ({}))
    const timeframe: string = reqBody?.timeframe || '6months'

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Compute timeframe window
    const now = new Date()
    const end = now
    const start = new Date(now)
    switch (timeframe) {
      case '1month':
        start.setMonth(start.getMonth() - 1)
        break
      case '3months':
        start.setMonth(start.getMonth() - 3)
        break
      case '6months':
        start.setMonth(start.getMonth() - 6)
        break
      case '1year':
        start.setFullYear(start.getFullYear() - 1)
        break
      default:
        start.setMonth(start.getMonth() - 6)
    }

    // Fetch user's journal entries within window
    const { data: entries, error } = await supabaseClient
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('incident_date', start.toISOString())
      .lte('incident_date', end.toISOString())
      .order('incident_date', { ascending: false })
      .limit(50)

    if (error) throw error

    // Analyze patterns
    const analysis = {
      totalEntries: entries.length,
      abuseTypeFrequency: {},
      safetyRatingTrends: {},
      timePatterns: {},
      escalationIndicators: []
    }

    // Count abuse types
    entries.forEach(entry => {
      entry.abuse_types?.forEach(type => {
        analysis.abuseTypeFrequency[type] = (analysis.abuseTypeFrequency[type] || 0) + 1
      })

      // Safety rating trends
      const rating = entry.safety_rating
      analysis.safetyRatingTrends[rating] = (analysis.safetyRatingTrends[rating] || 0) + 1
    })

    // Time pattern analysis (day of week, time of day)
    entries.forEach(entry => {
      const date = new Date(entry.incident_date)
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
      const hour = date.getHours()

      analysis.timePatterns[dayOfWeek] = (analysis.timePatterns[dayOfWeek] || 0) + 1
    })

    // Generate insights using AI
    const insightPrompt = `Analyze these narcissistic abuse patterns and provide insights:

    Total incidents: ${analysis.totalEntries}
    Abuse types: ${JSON.stringify(analysis.abuseTypeFrequency)}
    Safety ratings: ${JSON.stringify(analysis.safetyRatingTrends)}
    Day patterns: ${JSON.stringify(analysis.timePatterns)}

    Provide 3-5 key insights about patterns, escalation risks, and recovery recommendations.`

    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': Deno.env.get('GEMINI_API_KEY') ?? '',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: insightPrompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 512,
        }
      })
    })

    const geminiData = await geminiResponse.json()
    const insights = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate insights at this time.'

    // Persist analysis to pattern_analysis
    const { data: savedAnalysis, error: saveErr } = await supabaseClient
      .from('pattern_analysis')
      .insert({
        user_id: user.id,
        analysis_type: 'abuse_patterns',
        analysis_period_start: start.toISOString(),
        analysis_period_end: end.toISOString(),
        patterns_identified: analysis.abuseTypeFrequency,
        insights: { text: insights },
        recommendations: [],
        risk_assessment: {},
        confidence_score: null,
        data_points_analyzed: entries.length,
        ai_model_version: 'gemini-pro'
      })
      .select('*')
      .single()

    if (saveErr) throw saveErr

    // Optionally persist a lightweight user insight
    if (insights && insights !== 'Unable to generate insights at this time.') {
      await supabaseClient
        .from('user_insights')
        .insert({
          user_id: user.id,
          insight_type: 'pattern',
          title: 'Pattern analysis update',
          description: insights.slice(0, 800),
          priority: 'medium',
          related_entries: (entries || []).slice(0, 10).map((e: any) => e.id),
          related_patterns: [savedAnalysis.id],
          action_items: [],
          is_read: false,
        })
    }

    return new Response(
      JSON.stringify({
        analysis,
        insights,
        generatedAt: new Date().toISOString(),
        savedAnalysisId: savedAnalysis?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})