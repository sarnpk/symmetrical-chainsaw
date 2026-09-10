import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateAIResponse } from '@/lib/gemini-ai'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const tier = profile?.subscription_tier || 'foundation'
    
    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('usage_count')
      .eq('user_id', user.id)
      .eq('feature_name', 'urge_surfing_ai_analysis')
      .gte('usage_date', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
      .single()

    const currentUsage = usageData?.usage_count || 0
    const limits: Record<string, number> = {
      foundation: 0,
      recovery: 5,
      empowered: 20
    }

    if (currentUsage >= limits[tier]) {
      return NextResponse.json({ 
        error: `Daily limit reached. ${tier === 'foundation' ? 'Upgrade to Recovery tier for AI analysis.' : `You have ${limits[tier]} analyses per day.`}`,
        requiresUpgrade: tier === 'foundation'
      }, { status: 403 })
    }

    const { data: sessions } = await supabase
      .from('urge_surfing_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(14)

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ error: 'No sessions to analyze' }, { status: 400 })
    }

    const latestSession = sessions[0]
    const successRate = sessions.filter(s => !s.gave_in).length / sessions.length * 100
    const avgIntensityStart = sessions.reduce((sum, s) => sum + s.urge_intensity_start, 0) / sessions.length
    const avgIntensityEnd = sessions.reduce((sum, s) => sum + (s.urge_intensity_end || s.urge_intensity_start), 0) / sessions.length

    const prompt = `You are a compassionate DBT therapist specializing in urge surfing and impulse control. Analyze this person's urge surfing practice.

LATEST SESSION:
Urge Type: ${latestSession.urge_type}
Trigger: ${latestSession.trigger_description}
Intensity: ${latestSession.urge_intensity_start} â†’ ${latestSession.urge_intensity_peak || 'N/A'} â†’ ${latestSession.urge_intensity_end || 'N/A'}
Body Sensations: ${latestSession.body_sensations || 'Not recorded'}
Duration: ${latestSession.duration_minutes || 'N/A'} minutes
Gave In: ${latestSession.gave_in ? 'Yes' : 'No'}
Alternative Action: ${latestSession.alternative_action || 'None'}

OVERALL STATS (Last 14 sessions):
- Total Sessions: ${sessions.length}
- Success Rate: ${successRate.toFixed(1)}%
- Avg Starting Intensity: ${avgIntensityStart.toFixed(1)}/10
- Avg Ending Intensity: ${avgIntensityEnd.toFixed(1)}/10
- Most Common Urge: ${sessions.reduce((acc, s) => { acc[s.urge_type] = (acc[s.urge_type] || 0) + 1; return acc; }, {} as Record<string, number>)}

Provide a JSON response with:
{
  "overallAssessment": "Brief compassionate assessment (2-3 sentences)",
  "strengths": ["2-3 specific strengths in their practice"],
  "areasToFocus": ["2-3 areas needing attention"],
  "triggerPatterns": ["2-3 recurring trigger themes"],
  "bodySensationInsights": "What their body sensations reveal about their urges",
  "optimalSurfTime": "Recommended duration based on their patterns",
  "personalizedTechniques": [
    {
      "name": "Technique name",
      "description": "What to do",
      "whenToUse": "When this helps most"
    }
  ],
  "alternativeActions": ["3 specific alternatives for their urge type"],
  "preventiveMeasures": ["2-3 proactive steps to reduce urge frequency"],
  "celebrationMessage": "Warm, validating message about their progress",
  "nextChallenge": "Next skill level to work toward"
}

Be specific, trauma-informed, and focus on the temporary nature of urges.`

    const aiResponse = await generateAIResponse(prompt)
    const analysis = JSON.parse(aiResponse)

    await supabase.rpc('record_feature_usage', {
      p_user_id: user.id,
      p_feature_name: 'urge_surfing_ai_analysis'
    })

    return NextResponse.json({
      analysis,
      usageRemaining: limits[tier] - currentUsage - 1
    })

  } catch (error: any) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ 
      error: 'Failed to analyze progress',
      details: error.message 
    }, { status: 500 })
  }
}
