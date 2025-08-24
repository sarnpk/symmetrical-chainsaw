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
    const { timeframe = '6months', skip_risk = false, skip_insights = false } = await req.json().catch(() => ({}))

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

    // Fetch user subscription tier for gating
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const subscriptionTier = profile?.subscription_tier || 'foundation'

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
      escalationIndicators: [],
      monthlyCounts: {} as Record<string, number>
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

    // Deterministic risk assessment (optional)
    const severeSet = new Set([
      'physical_abuse',
      'sexual_abuse',
      'threats',
      'stalking',
      'financial_abuse',
      'isolation'
    ])
    const coerciveSet = new Set([
      'gaslighting',
      'intimidation',
      'humiliation',
      'stonewalling',
      'love_bombing',
      'devaluation',
      'coercive_control'
    ])

    type EvidenceRef = {
      entry_id: string
      incident_date: string
      matched_signals: string[]
      snippet: string
      attachments?: string[]
    }

    const evidenceRefs: EvidenceRef[] = []

    // Helper: compute monthly counts for escalation trends
    const byMonth: Record<string, number> = {}
    entries.forEach((e: any) => {
      const d = new Date(e.incident_date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      byMonth[key] = (byMonth[key] || 0) + 1
    })
    const monthsSorted = Object.keys(byMonth).sort()
    analysis.monthlyCounts = byMonth
    let escalationDetected = false
    if (monthsSorted.length >= 3) {
      const firstHalf = monthsSorted.slice(0, Math.floor(monthsSorted.length / 2))
      const secondHalf = monthsSorted.slice(Math.floor(monthsSorted.length / 2))
      const avg1 = firstHalf.reduce((a, m) => a + byMonth[m], 0) / firstHalf.length
      const avg2 = secondHalf.reduce((a, m) => a + byMonth[m], 0) / secondHalf.length
      escalationDetected = avg2 > avg1 + 0.5
    }

    // Safety trend
    const safetyValues = entries.map((e: any) => Number(e.safety_rating)).filter((n) => !Number.isNaN(n))
    let safetyLowCount = 0
    let safetyVeryLowInSevere = false

    let score = 0
    const nowIso = new Date().toISOString()
    const recentCutoff = new Date()
    recentCutoff.setDate(recentCutoff.getDate() - 30)
    const ninetyCutoff = new Date()
    ninetyCutoff.setDate(ninetyCutoff.getDate() - 90)

    let recentConcerningEntries = 0
    let recentSevereEntries = 0

    entries.forEach((e: any) => {
      const signals: string[] = []
      const tags: string[] = Array.isArray(e.abuse_types) ? e.abuse_types : []
      let entrySeverePoints = 0
      let entryCoercivePoints = 0

      tags.forEach((t) => {
        if (severeSet.has(t)) {
          entrySeverePoints += 3
          signals.push(t)
        } else if (coerciveSet.has(t)) {
          entryCoercivePoints += 2
          signals.push(t)
        }
      })
      if (entrySeverePoints > 6) entrySeverePoints = 6
      if (entryCoercivePoints > 4) entryCoercivePoints = 4

      const safety = Number(e.safety_rating)
      if (!Number.isNaN(safety)) {
        analysis.safetyRatingTrends[safety] = (analysis.safetyRatingTrends[safety] || 0) + 1
        if (safety <= 2) {
          safetyLowCount += 1
          signals.push('safety<=2')
          score += safety <= 1 ? 3 : 2
          if (entrySeverePoints > 0 && safety <= 1) {
            safetyVeryLowInSevere = true
          }
        }
      }

      const afterMood = Number(e.emotional_state_after)
      if (!Number.isNaN(afterMood) && afterMood <= 3) {
        signals.push('mood_after<=3')
        score += 1
      }

      // Accumulate points from tags
      score += entrySeverePoints + entryCoercivePoints

      // Recency checks
      const incidentDate = new Date(e.incident_date)
      if (incidentDate >= recentCutoff && (entrySeverePoints > 0 || safety <= 2 || entryCoercivePoints > 0)) {
        recentConcerningEntries += 1
      }
      if (incidentDate >= ninetyCutoff && entrySeverePoints > 0) {
        recentSevereEntries += 1
      }

      // Evidence ref
      const snippetSrc: string = (e.description || '').toString()
      const snippet = snippetSrc.length > 160 ? `${snippetSrc.slice(0, 157)}...` : snippetSrc
      evidenceRefs.push({
        entry_id: e.id,
        incident_date: e.incident_date,
        matched_signals: Array.from(new Set(signals)),
        snippet,
        attachments: Array.isArray(e.evidence_files) ? e.evidence_files : undefined
      })
    })

    // Recency boost
    if (recentConcerningEntries >= 2) score += 2
    if (escalationDetected) {
      score += 2
      analysis.escalationIndicators.push('increasing_frequency')
    }

    if (score > 20) score = 20

    // Determine label
    let risk_label: 'low' | 'moderate' | 'high' = 'low'
    if (score >= 9) risk_label = 'high'
    else if (score >= 5) risk_label = 'moderate'

    const binary_summary = (score >= 9 || recentSevereEntries >= 2 || safetyVeryLowInSevere)
      ? 'abusive_patterns_likely'
      : 'insufficient_evidence'

    const monthlyCountsObj = (analysis as any).monthlyCounts || {}
    const monthKeys = Object.keys(monthlyCountsObj).sort()
    let trend: 'rising' | 'stable' | 'falling' = 'stable'
    if (monthKeys.length >= 2) {
      const last = monthKeys[monthKeys.length - 1]
      const prev = monthKeys[monthKeys.length - 2]
      const diff = (monthlyCountsObj as any)[last] - (monthlyCountsObj as any)[prev]
      trend = diff > 0 ? 'rising' : diff < 0 ? 'falling' : 'stable'
    }
    const total = analysis.totalEntries || 0
    const confidence: 'low' | 'medium' | 'high' = total < 5 ? 'low' : total < 13 ? 'medium' : 'high'
    const uncertainty_note = confidence === 'low' ? 'Limited data; interpretation may be less reliable.' : undefined

    const risk_assessment = skip_risk ? null : {
      label: risk_label,
      score,
      binary_summary,
      reasons: [
        recentSevereEntries >= 2 ? { reason: 'Multiple recent severe behaviors', weight: 6 } : null,
        safetyLowCount >= 2 ? { reason: 'Consistently low safety ratings', weight: 3 } : null,
        escalationDetected ? { reason: 'Escalation in incident frequency', weight: 3 } : null
      ].filter(Boolean),
      evidence_refs: evidenceRefs.slice(0, 10),
      timeframe: { start: start.toISOString(), end: end.toISOString() },
      trend,
      confidence,
      uncertainty_note,
      model: 'deterministic_v1',
      disclaimer_version: 'v1'
    }

    // Generate insights using AI (gated below)
    const insightPrompt = `You are generating supportive, trauma-informed insights about patterns from journaled incidents.

    Context
    - Timeframe: ${start.toISOString()} to ${end.toISOString()}
    - Total incidents: ${analysis.totalEntries}
    - Category frequencies: ${JSON.stringify(analysis.abuseTypeFrequency)}
    - Severity/safety distributions: ${JSON.stringify(analysis.safetyRatingTrends)}
    - Temporal patterns: ${JSON.stringify(analysis.timePatterns)}

    Instructions
    - Output in concise Markdown with short bullet points.
    - Avoid clinical language or diagnoses. Be neutral and supportive.
    - Include sections:
      1) Key patterns observed
      2) Possible escalation or concentration (if data suggests)
      3) Practical next steps (boundaries, tracking, resources)
      4) Safety note (one line)
    - Keep it under 180 words.`

    let insights: string | null = null
    let insightsError: string | null = null
    let gated = false
    const gatedFeatures: string[] = []

    // Feature gating: Foundation tier has analysis basic only; insights and risk are premium
    if (subscriptionTier === 'foundation') {
      gated = true
      gatedFeatures.push('insights', 'risk')
    } else if (!skip_insights) {
      const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_API_KEY') || ''
      if (apiKey) {
        const controller = new AbortController()
        const timeoutMs = 12000
        let timedOut = false
        try {
          const timeoutPromise = new Promise<Response>((_resolve, reject) => {
            setTimeout(() => {
              timedOut = true
              controller.abort()
              reject(new Error('TIMEOUT'))
            }, timeoutMs)
          })

          const fetchPromise = fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: insightPrompt }]
              }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 512,
              }
            }),
            signal: controller.signal
          })

          const geminiResponse = await Promise.race([fetchPromise, timeoutPromise])
          if (geminiResponse && (geminiResponse as Response).ok) {
            const geminiData = await (geminiResponse as Response).json()
            insights = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || null
          } else if (geminiResponse) {
            const errText = await (geminiResponse as Response).text().catch(() => '')
            insights = null
            insightsError = `Gemini ${(geminiResponse as Response).status}: ${errText.slice(0, 200)}`
            console.error('[analyze-patterns] Gemini error', { status: (geminiResponse as Response).status, body: errText.slice(0, 500) })
          }
        } catch (e: any) {
          insights = null
          if (timedOut || e?.message === 'TIMEOUT' || e?.name === 'AbortError') {
            insightsError = `TIMEOUT after ${timeoutMs / 1000}s`
            console.error('[analyze-patterns] Gemini fetch timeout', { timeoutMs })
          } else {
            insightsError = `Gemini fetch error: ${String(e?.message || e)}`.slice(0, 200)
            console.error('[analyze-patterns] Gemini fetch error', e)
          }
        }
      } else {
        insights = null
        insightsError = 'MISSING_API_KEY'
      }
    }

    // Persist analysis to pattern_analysis unless this is a lightweight preview
    const { data: savedAnalysis, error: saveErr } = skip_risk && skip_insights ? { data: null, error: null } as any : await supabaseClient
      .from('pattern_analysis')
      .insert({
        user_id: user.id,
        analysis_type: 'abuse_patterns',
        analysis_period_start: start.toISOString(),
        analysis_period_end: end.toISOString(),
        patterns_identified: analysis.abuseTypeFrequency,
        insights: { text: insights || (gated ? 'GATED' : (skip_insights ? 'PREVIEW' : 'UNAVAILABLE')) },
        recommendations: [],
        risk_assessment: gated ? null : risk_assessment,
        confidence_score: null,
        data_points_analyzed: entries.length,
        ai_model_version: 'gemini-1.5-flash'
      })
      .select('*')
      .single()

    if (!skip_risk || !skip_insights) {
      if (saveErr) throw saveErr
    }

    // Optionally persist a lightweight user insight
    if (insights && !skip_insights) {
      await supabaseClient
        .from('user_insights')
        .insert({
          user_id: user.id,
          insight_type: 'pattern',
          title: 'Pattern analysis update',
          description: insights.slice(0, 800),
          priority: 'medium',
          related_entries: (entries || []).slice(0, 10).map((e: any) => e.id),
          related_patterns: savedAnalysis ? [savedAnalysis.id] : [],
          action_items: [],
          is_read: false,
        })
    }

    return new Response(
      JSON.stringify({
        analysis,
        insights,
        risk_assessment: gated ? null : risk_assessment,
        gated,
        gated_features: gatedFeatures,
        subscription_tier: subscriptionTier,
        generatedAt: new Date().toISOString(),
        savedAnalysisId: savedAnalysis?.id,
        insights_error: insightsError || undefined
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