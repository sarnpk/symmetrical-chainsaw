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
  custody: {
    situation: 'custody exchange for children',
    typical_issues: 'late arrivals, rule changes, using kids as messengers, undermining parenting'
  },
  text: {
    situation: 'text message conversation',
    typical_issues: 'baiting, provocative statements, demands for immediate response, emotional manipulation'
  },
  email: {
    situation: 'co-parenting email exchange',
    typical_issues: 'long accusatory emails, cc-ing others, documentation for legal purposes, formal manipulation'
  },
  boundary: {
    situation: 'boundary violation incident',
    typical_issues: 'ignoring boundaries, testing limits, playing innocent, DARVO (Deny, Attack, Reverse Victim and Offender)'
  },
  custom: {
    situation: 'custom context based on real conversation',
    typical_issues: 'patterns identified from provided conversation history'
  },
  live: {
    situation: 'live ongoing conversation with situational context',
    typical_issues: 'real-time interaction with background situation awareness'
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check usage and get user
    const usageResult = await checkAndRecordAIUsage('narcissist_simulator', 'start')
    if ('error' in usageResult) {
      return NextResponse.json({ error: usageResult.error }, { status: usageResult.status })
    }

    const { user, supabase } = usageResult
    const { narcissistType, scenario, customContext, situationContext, userProfile } = await request.json()
    
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

Use this information to make the simulation more realistic and personalized.
`
    }

    const profile = NARCISSIST_PROFILES[narcissistType as keyof typeof NARCISSIST_PROFILES]
    const context = SCENARIO_CONTEXTS[scenario as keyof typeof SCENARIO_CONTEXTS]

    let prompt = ''

    if ((scenario === 'custom' || scenario === 'live') && customContext) {
      // Add situation context if provided (for live conversations)
      const situationInfo = situationContext ? `

SITUATION CONTEXT (BACKGROUND INFORMATION - DO NOT REPEAT THIS IN YOUR RESPONSE):
${situationContext}

IMPORTANT: This is BACKGROUND CONTEXT for you to understand the situation. 
DO NOT include this text in your response. DO NOT repeat "She took my kids" or any context details.
Use this information to inform your narcissistic behavior and responses, but respond naturally as the narcissist would in conversation.
` : ''
      // Custom context: Check if conversation ends with narcissist's message
      // If so, use that as the initial message instead of generating a new one
      
      // Try to extract the last message from the conversation
      const lines = customContext.trim().split('\n').filter((line: string) => line.trim())
      const lastLine = lines[lines.length - 1]
      
      // Check if we can identify who sent the last message
      let useLastMessage = false
      let lastMessageContent = ''
      
      // Look for patterns like "[time] Name: message" or "Name: message"
      const messagePattern = /\[.*?\]\s*([^:]+):\s*(.+)/
      const match = lastLine.match(messagePattern)
      
      if (match) {
        const senderName = match[1].trim()
        lastMessageContent = match[2].trim()
        
        // Check if this is the narcissist's message by looking for "SHE/HE IS [name]" in BOTH fields
        const combinedContext = `${situationContext}\n${customContext}`
        const narcissistPattern = /(?:SHE|HE)\s+IS\s+([^,\n]+)/i
        const narcMatch = combinedContext.match(narcissistPattern)
        
        if (narcMatch) {
          const narcissistName = narcMatch[1].trim()
          // If last message is from narcissist, use it
          if (senderName.toLowerCase().includes(narcissistName.toLowerCase()) || 
              narcissistName.toLowerCase().includes(senderName.toLowerCase())) {
            useLastMessage = true
          }
        }
      }
      
      if (useLastMessage && lastMessageContent) {
        // Use the last message from the conversation as the initial message
        return NextResponse.json({ initialMessage: lastMessageContent })
      }
      
      // Otherwise, generate a new message
      prompt = `You are roleplaying as a narcissist based on this REAL conversation:

${customContext}

${profileContext}
${situationInfo}

CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. IDENTIFY WHO IS WHO:
   - The user will tell you who they are and who the narcissist is in the context
   - Look for phrases like "I AM [name]" and "SHE/HE IS [name]"
   - Example: If context says "I AM Syed naqvi AND SHE IS Begum New", then:
     * Syed naqvi = the victim (the user practicing)
     * Begum New = the narcissist (YOU must roleplay as this person)

2. ANALYZE WHO SPOKE LAST:
   - Look at the LAST message in the conversation
   - If the narcissist spoke last, DO NOT generate a new message - the user should respond first
   - If the victim spoke last, generate the narcissist's response

3. YOU ARE THE NARCISSIST:
   - You must respond AS the narcissist, not as the victim
   - Adopt the narcissist's personality, speech patterns, and manipulation tactics
   - Continue the conversation as THEY would

4. ANALYZE THE NARCISSIST'S PATTERNS:
   - How do they manipulate? (gaslighting, guilt-tripping, playing victim, etc.)
   - What language do they use? (formal, casual, mix of languages, etc.)
   - What are their triggers and hot buttons?
   - How do they deflect blame?
   - What tactics do they repeat?

5. GENERATE THE NEXT MESSAGE (only if victim spoke last):
   - Respond AS the narcissist to continue this conversation
   - Match their exact communication style
   - Use their typical manipulation tactics
   - Reference topics from the conversation if relevant
   - Keep it under 100 words
   - Make it realistic and provocative
   - DO NOT repeat the situation context or background information
   - Respond naturally as if you're the narcissist texting/talking

6. IMPORTANT - WHAT TO RETURN:
   - Return ONLY what the narcissist would SAY or TEXT
   - DO NOT include situation descriptions
   - DO NOT repeat background context
   - DO NOT include meta-commentary
   - Just the actual message they would send

Example of GOOD response: "Oh, so now I'm the problem? I'm just trying to make sure the kids are okay."
Example of BAD response: "Begum New. She took my kids a week ago... [situation description]"

Return ONLY the narcissist's message (as if THEY are speaking).`
    } else {
      // Standard scenario
      prompt = `You are roleplaying as a ${profile.name} narcissist in a ${context.situation}.

${profileContext}

Your character traits: ${profile.traits}
Your communication style: ${profile.communication}
Typical issues in this scenario: ${context.typical_issues}

Generate the FIRST message from the narcissist to start this interaction. This should be a realistic opening that demonstrates narcissistic behavior patterns.

Requirements:
- Stay in character as this specific narcissist type
- Make it realistic and believable
- Include subtle manipulation tactics
- Keep it under 100 words
- Make it provocative enough to challenge the user

Return ONLY the narcissist's message, no explanations or meta-commentary.`
    }

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' })
    const result = await model.generateContent(prompt)
    const initialMessage = result.response.text()

    return NextResponse.json({ initialMessage })
  } catch (error) {
    console.error('Simulator start error:', error)
    return NextResponse.json(
      { error: 'Failed to start simulator' },
      { status: 500 }
    )
  }
}
