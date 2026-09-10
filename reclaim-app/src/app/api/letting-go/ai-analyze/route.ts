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

    // Check usage limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const tier = profile?.subscription_tier || 'foundation'
    
    // Check if user has reached their limit
    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('usage_count')
      .eq('user_id', user.id)
      .eq('feature_name', 'letting_go_ai_analysis')
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

    // Get recent entries for analysis
    const { data: entries } = await supabase
      .from('letting_go_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(7)

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: 'No entries to analyze' }, { status: 400 })
    }

    const latestEntry = entries[0]
    const calculateScore = (entry: any) => {
      const total = (10 - entry.emotional_reactivity) + 
                    (10 - entry.mental_space) + 
                    (10 - entry.hope_for_change) + 
                    (10 - entry.need_for_validation) + 
                    entry.boundary_strength
      return Math.round((total / 50) * 100)
    }

    const currentScore = calculateScore(latestEntry)
    const avgScore = Math.round(entries.reduce((sum, e) => sum + calculateScore(e), 0) / entries.length)
    const trend = entries.length > 1 ? currentScore - calculateScore(entries[1]) : 0

    const prompt = `You are a compassionate trauma-informed therapist specializing in narcissistic abuse recovery. Analyze this person's "Art of Letting Go" 5-step practice and provide personalized insights.

5-STEP COMPLETION:
Step 1 (Raw Thoughts): ${latestEntry.raw_thoughts ? 'Completed' : 'Skipped'}
Step 2 (Gratitude): ${latestEntry.gratitude_list?.filter((g: string) => g).length || 0}/3 items
Step 3 (Mindfulness): ${latestEntry.present_moment_focus ? 'Completed' : 'Skipped'}
Step 4 (Pattern Interrupt): ${latestEntry.pattern_interrupt_action ? 'Completed' : 'Skipped'}
Step 5 (Third Person): ${latestEntry.third_person_perspective ? 'Completed' : 'Skipped'}

MOOD SHIFT: ${latestEntry.emotional_state_before} â†’ ${latestEntry.emotional_state_after} (${latestEntry.emotional_state_after - latestEntry.emotional_state_before > 0 ? '+' : ''}${latestEntry.emotional_state_after - latestEntry.emotional_state_before})

RAW THOUGHTS ANALYSIS:
${latestEntry.raw_thoughts || 'Not provided'}

PATTERN IDENTIFIED:
Old: ${latestEntry.old_pattern || 'Not provided'}
Interrupt: ${latestEntry.pattern_interrupt_action || 'Not provided'}
New: ${latestEntry.new_response || 'Not provided'}

THIRD PERSON VIEW:
${latestEntry.third_person_perspective || 'Not provided'}

PROGRESS OVER TIME:
- Total entries: ${entries.length}
- Average mood shift: ${avgScore > 0 ? '+' : ''}${avgScore}
- Trend: ${trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable'}

Provide a JSON response with:
{
  "overallAssessment": "Brief compassionate assessment of their 5-step practice (2-3 sentences)",
  "strengths": ["2-3 specific strengths in their practice"],
  "areasToFocus": ["2-3 specific steps or areas needing attention"],
  "cognitiveDistortions": ["Identify any cognitive distortions in raw thoughts: all-or-nothing, catastrophizing, mind-reading, etc. If none, return empty array"],
  "attachmentTriggers": ["2-3 core themes/triggers in their raw thoughts"],
  "patternInterruptSuggestions": ["3 specific actions they can try when old pattern emerges"],
  "thirdPersonReframe": "If they're stuck, provide a compassionate third-person perspective on their situation",
  "gratitudePrompts": ["3 specific gratitude prompts based on their struggles"],
  "mostEffectiveStep": "Which of the 5 steps seems to help them most based on mood shifts",
  "personalizedExercises": [
    {
      "title": "Exercise name",
      "description": "What to do",
      "why": "Why this helps them specifically"
    }
  ],
  "affirmationSuggestion": "A personalized affirmation addressing their specific struggle",
  "nextMilestone": "What achievement they're approaching",
  "encouragement": "Warm, validating message (2-3 sentences)"
}

Be specific, compassionate, and trauma-informed. Acknowledge both progress and struggles. Focus on the 5-step methodology.`

    const aiResponse = await generateAIResponse(prompt)
    const analysis = JSON.parse(aiResponse)

    // Record usage
    await supabase.rpc('record_feature_usage', {
      p_user_id: user.id,
      p_feature_name: 'letting_go_ai_analysis'
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
