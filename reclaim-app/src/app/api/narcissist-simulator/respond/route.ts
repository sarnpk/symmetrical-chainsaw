import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { checkAndRecordAIUsage } from '@/lib/usage-tracking'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

const NARCISSIST_PROFILES = {
  overt: {
    name: 'Overt (Grandiose)',
    traits: 'Openly arrogant, demands attention, brags constantly, expects special treatment, dismissive of others',
    communication: 'Direct, aggressive, condescending, uses "I" statements excessively, interrupts, dominates conversation'
  },
  covert: {
    name: 'Covert (Vulnerable)',
    traits: 'Plays victim, passive-aggressive, guilt-trips, martyrdom, subtle manipulation, appears sensitive',
    communication: 'Indirect, sighs, hints, "poor me" statements, backhanded compliments, emotional manipulation'
  },
  malignant: {
    name: 'Malignant',
    traits: 'Cruel, vindictive, sadistic, enjoys causing pain, threatening, controlling, paranoid',
    communication: 'Threatening, intimidating, gaslighting, blame-shifting, uses fear and control'
  }
}

const SCENARIO_CONTEXTS = {
  custody: 'custody exchange for children',
  text: 'text message conversation',
  email: 'co-parenting email exchange',
  boundary: 'boundary violation incident',
  custom: 'custom context based on real conversation'
}

export async function POST(request: NextRequest) {
  try {
    // Check usage and get user
    const usageResult = await checkAndRecordAIUsage('narcissist_simulator', 'respond')
    if ('error' in usageResult) {
      return NextResponse.json({ error: usageResult.error }, { status: usageResult.status })
    }

    const { user, supabase } = usageResult
    const { narcissistType, scenario, conversationHistory, userMessage, customContext, situationContext, userProfile } = await request.json()
    
    // Get user's profile information for context
    let profileContext = ''
    if (userProfile) {
      const userName = userProfile.display_name || userProfile.first_name || 'the user'
      const narcGender = userProfile.abuser_gender?.toLowerCase() || ''
      const hasChildren = userProfile.has_children
      const childrenInfo = hasChildren && userProfile.children_ages ? 
        `They have children aged ${userProfile.children_ages.join(', ')}` : ''
      
      profileContext = `
PROFILE CONTEXT:
- User's name: ${userName}
- Narcissist's gender: ${narcGender.includes('female') ? 'Female (she/her)' : narcGender.includes('male') ? 'Male (he/him)' : 'Unknown'}
${childrenInfo ? `- ${childrenInfo}` : ''}
${userProfile.custody_arrangement ? `- Custody arrangement: ${userProfile.custody_arrangement}` : ''}
`
    }

    const profile = NARCISSIST_PROFILES[narcissistType as keyof typeof NARCISSIST_PROFILES]
    const context = SCENARIO_CONTEXTS[scenario as keyof typeof SCENARIO_CONTEXTS]

    // Build conversation history for context
    const historyText = conversationHistory
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Narcissist'}: ${msg.content}`)
      .join('\n')

    // Generate narcissist response
    let narcissistPrompt = ''

    if ((scenario === 'custom' || scenario === 'live') && customContext) {
      // Add situation context if provided (for live conversations)
      const situationInfo = situationContext ? `

SITUATION CONTEXT (BACKGROUND INFORMATION - DO NOT REPEAT THIS IN YOUR RESPONSE):
${situationContext}

CRITICAL: This is BACKGROUND CONTEXT for you to understand the situation.
DO NOT include this text in your response. DO NOT repeat "She took my kids" or any context details.
Use this information to inform your narcissistic behavior, but respond naturally as the narcissist would in a real conversation.
Your response should be what the narcissist would SAY, not a description of the situation.
` : ''
      // Custom context: stay true to the real narcissist's patterns
      narcissistPrompt = `You are roleplaying as a narcissist based on this REAL conversation:

ORIGINAL CONVERSATION:
${customContext}

${profileContext}
${situationInfo}

CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. IDENTIFY WHO IS WHO:
   - The user will tell you who they are and who the narcissist is in the context
   - Look for phrases like "I AM [name]" and "SHE/HE IS [name]"
   - Example: If context says "I AM Syed naqvi AND SHE IS Begum New", then:
     * Syed naqvi = the victim (the user you're responding to)
     * Begum New = the narcissist (YOU must roleplay as this person)

2. YOU ARE THE NARCISSIST:
   - You must respond AS the narcissist, not as the victim
   - Adopt the narcissist's personality from the original conversation
   - Use their speech patterns, language style, and manipulation tactics
   - If they mix languages (Urdu/English), do the same
   - If they use specific phrases or words, mirror that style

PRACTICE CONVERSATION SO FAR:
${historyText}

User just said: "${userMessage}"

Generate the narcissist's response staying TRUE to their patterns from the original conversation:
- Match their exact communication style and language
- Use their typical manipulation tactics (gaslighting, guilt-tripping, deflection, etc.)
- React how THEY would based on their established patterns
- Reference the original context if relevant
- If user used grey rock (boring, brief), escalate or try harder to get a reaction
- If user set boundaries, violate them or play victim like the narcissist did before
- If user engaged emotionally, exploit that like the narcissist would
- Address the user by their name if the narcissist typically does that

CRITICAL - WHAT TO RETURN:
- Return ONLY what the narcissist would SAY or TEXT in response
- DO NOT include situation descriptions or background context
- DO NOT repeat "She took my kids" or any context details
- Just the actual message they would send

Example of GOOD response: "Oh please, you're overreacting as usual. The kids are fine with me."
Example of BAD response: "Begum New. She took my kids... [situation description]"

Keep response under 100 words. Return ONLY the narcissist's actual message.`
    } else {
      // Standard scenario
      narcissistPrompt = `You are roleplaying as a ${profile.name} narcissist in a ${context}.

${profileContext}

Your character traits: ${profile.traits}
Your communication style: ${profile.communication}

Conversation so far:
${historyText}

User just said: "${userMessage}"

Generate the narcissist's response. Stay in character. React realistically to what the user said:
- If they used grey rock (boring, brief), you might escalate or try harder to get a reaction
- If they set boundaries, you might violate them or play victim
- If they engaged emotionally, you might exploit that
- If they used BIFF (brief, informative, friendly, firm), you might try to bait them

Keep response under 100 words. Return ONLY the narcissist's message.`
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
    const narcissistResult = await model.generateContent(narcissistPrompt)
    const narcissistResponse = narcissistResult.response.text()

    // Analyze user's technique and provide feedback
    const feedbackPrompt = `You are an expert trauma therapist analyzing communication techniques for dealing with narcissists.

The user is practicing responses to a ${profile.name} narcissist in a ${context}.

User's response: "${userMessage}"

Analyze their technique:

1. Identify which technique they used:
   - Grey Rock: Boring, brief, no emotional content, minimal engagement
   - BIFF: Brief, Informative, Friendly, Firm
   - Boundary Setting: Clear limits, consequences stated
   - Emotional Engagement: Defensive, explaining, justifying (NOT recommended)
   - No Contact: Refusing to engage

2. Rate effectiveness: poor, good, or excellent
   - Poor: Gave narcissist supply, engaged emotionally, JADE (Justify, Argue, Defend, Explain)
   - Good: Some good elements but could improve
   - Excellent: Textbook grey rock/BIFF, no supply given, boundaries maintained

3. Provide specific suggestion for improvement (one sentence)

Return ONLY a JSON object:
{
  "technique": "technique name",
  "effectiveness": "poor|good|excellent",
  "suggestion": "specific actionable suggestion"
}

No other text, just the JSON.`

    const feedbackResult = await model.generateContent(feedbackPrompt)
    let feedbackText = feedbackResult.response.text().trim()
    
    // Clean up JSON response
    feedbackText = feedbackText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const feedback = JSON.parse(feedbackText)

    return NextResponse.json({
      narcissistResponse,
      feedback
    })
  } catch (error) {
    console.error('Simulator respond error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
