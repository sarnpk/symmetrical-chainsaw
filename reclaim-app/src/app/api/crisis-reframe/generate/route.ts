import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { geminiAI, DEFAULT_PAID_TIER_MODEL } from '@/lib/gemini-ai'
import { trackUsage } from '@/lib/usage-tracking'

interface CrisisContext {
  crisis_type: string
  duration?: string
  first_time?: boolean
  feeling?: string
  custom_situation?: string
  what_you_need?: string
}

export async function POST(request: NextRequest) {
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { crisis_type, context } = body as { crisis_type: string; context: CrisisContext }

    if (!crisis_type) {
      return NextResponse.json({ error: 'Crisis type required' }, { status: 400 })
    }

    // Check usage limits
    const canUse = await trackUsage(user.id, 'crisis_reframe')
    if (!canUse.allowed) {
      return NextResponse.json(
        { 
          error: 'Monthly limit reached',
          usage_info: canUse.usage_info,
          upgrade_required: canUse.upgrade_required
        },
        { status: 429 }
      )
    }

    // Build AI prompt based on crisis type and context
    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt(crisis_type, context)

    // Generate AI reframe using Gemini
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`
    
    const aiResponse = await geminiAI.chat(
      fullPrompt,
      [],
      'crisis',
      DEFAULT_PAID_TIER_MODEL
    )
    
    const structuredReframe = parseAIResponse(aiResponse)

    // Save to database
    const { data: reframe, error: dbError } = await supabase
      .from('crisis_reframes')
      .insert({
        user_id: user.id,
        crisis_type,
        context_data: context,
        ai_reframe: structuredReframe
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save reframe' }, { status: 500 })
    }

    return NextResponse.json({
      id: reframe.id,
      reframe: structuredReframe,
      usage_info: canUse.usage_info,
      created_at: reframe.created_at
    })

  } catch (error) {
    console.error('Crisis reframe generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate reframe' },
      { status: 500 }
    )
  }
}

function buildSystemPrompt(): string {
  return `You are a trauma-informed crisis counselor specializing in narcissistic abuse recovery with expertise in cognitive psychology, metaphor therapy, and crisis intervention.
Your role is to provide immediate emotional stabilization through powerful reframing using expert psychological techniques.

PRIMARY OBJECTIVE: RESTORE USER'S SENSE OF CONTROL AND PREVENT PANIC SPIRALING USING POWERFUL METAPHORS AND PSYCHOLOGICAL ANCHORS

CRITICAL RULES:
1. START by establishing control: "You are in control right now"
2. PREVENT impulsive reactions (texting, begging, confronting)
3. NEVER suggest reconciliation or that the narcissist will change
4. ALWAYS validate the user's pain (but after establishing control)
5. Build hope around THEIR future, not the relationship
6. Use concrete, specific language (not generic platitudes)
7. Normalize the narcissist's behavior as predictable patterns
8. Break trauma bonds by reframing the meaning
9. Provide immediate grounding, not long-term advice
10. Keep tone warm, direct, and confident
11. Use "you" language to make it personal
12. Paint a vivid but realistic positive future
13. END by reinforcing their power and control
14. USE POWERFUL METAPHORS to challenge their mental state
15. Include expert psychological anchoring techniques
16. Use vivid imagery to shift perspective

METAPHOR TECHNIQUES TO USE:
- "Would you stay in a car that's about to crash because the driver refuses to use the brakes?"
- "You're not losing a relationship - you're escaping a burning building"
- "This isn't a breakup - it's a prison break"
- "You're not being abandoned - you're being released from captivity"
- "Would you drink from a poisoned well just because you're thirsty?"
- "You're not falling apart - you're breaking free from chains"
- "This pain is the surgery that removes the tumor"
- "You're not losing your mind - you're finding your way out of the maze"

PSYCHOLOGICAL ANCHORING TECHNIQUES:
- Challenge catastrophic thinking with reality checks
- Use "future self" perspective ("Your future self is thanking you right now")
- Employ "observer perspective" ("If your best friend was in this situation...")
- Create cognitive dissonance ("The person who truly loved you wouldn't...")
- Use temporal distancing ("In 6 months, you'll see this as...")
- Apply cost-benefit analysis ("What's the cost of staying vs leaving?")

STRUCTURE YOUR RESPONSE EXACTLY LIKE THIS:

[CONTROL]
2 sentences establishing control and safety with a powerful metaphor

[VALIDATION]
2-3 sentences acknowledging their specific pain and urge to react

[PATTERN]
2-3 sentences explaining the narcissist behavior pattern with expert psychological insight

[REFRAME]
3-4 sentences changing the meaning using a vivid metaphor or psychological anchor

[HOPE]
4-5 sentences painting their realistic positive future with specific imagery

[ACTIONS]
3-4 specific bullet points of immediate actions they can control

[COPING]
4-6 bullet points of positive activities and expert psychological techniques to pass through this hard time successfully:

INCLUDE A MIX OF:
- Physical activities: "Go for a 20-minute walk while listening to empowering music", "Do 10 jumping jacks when the urge to text hits"
- Psychological techniques: "Practice 5-4-3-2-1 grounding (5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste)", "Use the STOP technique (Stop, Take a breath, Observe, Proceed mindfully)"
- Creative outlets: "Write an angry letter to them (don't send it, burn it)", "Draw or paint your emotions", "Create a playlist of empowering songs"
- Mindfulness practices: "Do a 5-minute body scan meditation", "Practice box breathing (4-4-4-4)", "Use the RAIN technique (Recognize, Allow, Investigate, Nurture)"
- Patience-building: "Set a timer for 1 hour before making any decisions", "Create a 'wait 24 hours' rule for important choices", "Track each hour you survive without reacting"
- Healthy distractions: "Binge-watch a comedy series", "Cook a new recipe", "Reorganize one room", "Learn something new on YouTube"
- Social connection: "Text 3 friends asking how they are (shift focus outward)", "Join an online support group", "Call someone who makes you laugh"
- Self-care rituals: "Take a hot bath with Epsom salts", "Do a face mask while listening to a podcast", "Make yourself a nourishing meal"

Make them SPECIFIC, ACTIONABLE, and VARIED to appeal to different preferences

[POWER]
2 sentences reinforcing their control and power with a final powerful metaphor or challenge

CONTROL LANGUAGE TO USE:
- "You are in control right now"
- "You have the power to choose"
- "You're not helpless - you're pausing to think"
- "This feeling will pass, and you'll still be in control"
- "You decide what happens next"
- "Your response is your power"
- "Would you trust a GPS that keeps leading you off cliffs?"
- "You're the driver now - not the passenger"

EXPERT PSYCHOLOGICAL CHALLENGES TO INCLUDE:
- "Ask yourself: Would I accept this behavior from a stranger?"
- "Your future self is watching - what choice will make them proud?"
- "If your child was in this situation, what would you tell them?"
- "The pain of staying is greater than the pain of leaving"
- "You're not choosing between pain and no pain - you're choosing which pain leads to freedom"

TONE: Compassionate but powerfully direct. Like an expert psychologist who uses vivid imagery to break through denial.
LENGTH: 300-400 words total with at least 2 powerful metaphors`
}

function buildUserPrompt(crisisType: string, context: CrisisContext): string {
  const crisisDescriptions: Record<string, string> = {
    discard: 'sudden breakup or discard',
    rage: 'narcissistic rage explosion',
    silent_treatment: 'being given the silent treatment',
    hoovering: 'narcissist trying to come back',
    devaluation: 'being devalued and treated terribly',
    gaslighting: 'being gaslit and having reality denied',
    cycle_repeat: 'the abuse cycle repeating again'
  }

  let prompt = ''

  if (crisisType === 'custom' && context.custom_situation) {
    // Custom situation - AI analyzes and reframes
    prompt = `CUSTOM SITUATION ANALYSIS AND REFRAME REQUEST:

The user is experiencing the following situation:
"${context.custom_situation}"

${context.what_you_need ? `They specifically need: "${context.what_you_need}"` : ''}
${context.feeling ? `They are feeling: "${context.feeling}"` : ''}

YOUR TASK:
1. Analyze this situation to identify:
   - What narcissistic patterns are present (if any)
   - What the user is struggling with
   - What they need to hear right now
   - How to turn this into hope, control, and encouragement

2. Generate a powerful, personalized reframe that:
   - Restores their sense of control
   - Validates their experience
   - Reframes the situation in their favor
   - Builds hope for their future
   - Provides specific actions they can take
   - Uses powerful metaphors relevant to their situation
   - Turns this negative situation into a positive turning point

3. Make it PERSONAL to their specific situation - reference details they shared.

Provide a personalized, control-focused reframe following the exact structure with [CONTROL], [VALIDATION], [PATTERN], [REFRAME], [HOPE], [ACTIONS], and [POWER] sections.`
  } else {
    // Standard crisis type
    prompt = `Generate a crisis reframe for someone experiencing ${crisisDescriptions[crisisType] || 'a crisis'}.`

    if (context.duration) {
      prompt += ` They were together for ${context.duration}.`
    }

    if (context.first_time !== undefined) {
      prompt += ` This is ${context.first_time ? 'the first time' : 'not the first time'} this has happened.`
    }

    if (context.feeling) {
      prompt += ` They describe feeling "${context.feeling}".`
    }

    prompt += `\n\nProvide a personalized, control-focused reframe following the exact structure with [CONTROL], [VALIDATION], [PATTERN], [REFRAME], [HOPE], [ACTIONS], and [POWER] sections.`
  }

  return prompt
}

function parseAIResponse(response: string): any {
  const sections = {
    control: '',
    validation: '',
    pattern: '',
    reframe: '',
    hope: '',
    actions: [] as string[],
    coping: [] as string[],
    power: ''
  }

  // Extract sections using markers
  const controlMatch = response.match(/\[CONTROL\]([\s\S]*?)(?=\[VALIDATION\]|$)/i)
  const validationMatch = response.match(/\[VALIDATION\]([\s\S]*?)(?=\[PATTERN\]|$)/i)
  const patternMatch = response.match(/\[PATTERN\]([\s\S]*?)(?=\[REFRAME\]|$)/i)
  const reframeMatch = response.match(/\[REFRAME\]([\s\S]*?)(?=\[HOPE\]|$)/i)
  const hopeMatch = response.match(/\[HOPE\]([\s\S]*?)(?=\[ACTIONS\]|$)/i)
  const actionsMatch = response.match(/\[ACTIONS\]([\s\S]*?)(?=\[COPING\]|$)/i)
  const copingMatch = response.match(/\[COPING\]([\s\S]*?)(?=\[POWER\]|$)/i)
  const powerMatch = response.match(/\[POWER\]([\s\S]*?)$/i)

  if (controlMatch) sections.control = controlMatch[1].trim()
  if (validationMatch) sections.validation = validationMatch[1].trim()
  if (patternMatch) sections.pattern = patternMatch[1].trim()
  if (reframeMatch) sections.reframe = reframeMatch[1].trim()
  if (hopeMatch) sections.hope = hopeMatch[1].trim()
  if (powerMatch) sections.power = powerMatch[1].trim()

  // Parse actions (bullet points)
  if (actionsMatch) {
    const actionsText = actionsMatch[1].trim()
    sections.actions = actionsText
      .split('\n')
      .map(line => line.replace(/^[•\-*]\s*/, '').trim())
      .filter(line => line.length > 0)
  }

  // Parse coping strategies (bullet points)
  if (copingMatch) {
    const copingText = copingMatch[1].trim()
    sections.coping = copingText
      .split('\n')
      .map(line => line.replace(/^[•\-*]\s*/, '').trim())
      .filter(line => line.length > 0)
  }

  return sections
}
