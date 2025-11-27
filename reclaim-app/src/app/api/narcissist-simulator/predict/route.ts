import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { checkAndRecordAIUsage } from '@/lib/usage-tracking'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

const NARCISSIST_PROFILES = {
  overt: {
    name: 'Overt (Grandiose)',
    traits: 'Openly arrogant, demands attention, brags constantly, expects special treatment, dismissive of others',
    patterns: 'Escalates when ignored, demands compliance, uses intimidation, expects admiration'
  },
  covert: {
    name: 'Covert (Vulnerable)',
    traits: 'Plays victim, passive-aggressive, guilt-trips, martyrdom, subtle manipulation, appears sensitive',
    patterns: 'Uses guilt and shame, plays victim when confronted, passive-aggressive retaliation, emotional manipulation'
  },
  malignant: {
    name: 'Malignant',
    traits: 'Cruel, vindictive, sadistic, enjoys causing pain, threatening, controlling, paranoid',
    patterns: 'Threatens and intimidates, seeks revenge, enjoys causing distress, uses fear and control'
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check usage and get user
    const usageResult = await checkAndRecordAIUsage('narcissist_simulator_predict')
    if ('error' in usageResult) {
      return NextResponse.json({ error: usageResult.error }, { status: usageResult.status })
    }

    const { user, supabase } = usageResult
    const { narcissistType, scenario, conversationHistory, customContext } = await request.json()

    const profile = NARCISSIST_PROFILES[narcissistType as keyof typeof NARCISSIST_PROFILES]

    // Build conversation history for context
    const historyText = conversationHistory
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Narcissist'}: ${msg.content}`)
      .join('\n')

    let prompt = ''

    if (scenario === 'custom' && customContext) {
      // Custom context: predict based on their established patterns
      prompt = `You are an expert in narcissistic behavior patterns. Analyze this conversation and predict the narcissist's next likely moves.

ORIGINAL CONVERSATION (their established patterns):
${customContext}

CRITICAL: Identify who is who:
- Look for phrases like "I AM [name]" and "SHE/HE IS [name]" in the context
- Example: If context says "I AM Syed naqvi AND SHE IS Begum New", then:
  * Syed naqvi = the victim (the user)
  * Begum New = the narcissist (the person whose behavior you're predicting)

PRACTICE CONVERSATION SO FAR:
${historyText}

Based on the narcissist's established patterns from the original conversation and how the practice conversation has gone, predict their next 3 most likely moves.

For each predicted move, provide:
1. What the NARCISSIST will likely say or do (not the victim)
2. Probability (0.0 to 1.0)
3. Why they'll do this (based on their patterns)
4. How the user should respond

Also provide:
- Overall strategy the narcissist is using
- Any warning signs to watch for

Return ONLY a JSON object:
{
  "likelyMoves": [
    {
      "move": "specific thing the narcissist will say or do",
      "probability": 0.75,
      "reasoning": "why they'll do this based on their patterns",
      "howToRespond": "recommended response strategy"
    }
  ],
  "overallStrategy": "the narcissist's overall manipulation strategy",
  "warningSign": "any escalation or danger signs"
}

No other text, just the JSON.`
    } else {
      // Standard scenario
      prompt = `You are an expert in narcissistic behavior patterns. Analyze this conversation and predict the narcissist's next likely moves.

Narcissist Type: ${profile.name}
Traits: ${profile.traits}
Typical Patterns: ${profile.patterns}

CONVERSATION SO FAR:
${historyText}

Based on this narcissist type and the conversation flow, predict their next 3 most likely moves.

For each predicted move, provide:
1. What they'll likely say or do
2. Probability (0.0 to 1.0)
3. Why they'll do this (based on narcissist type)
4. How the user should respond

Also provide:
- Overall strategy they're using
- Any warning signs to watch for

Return ONLY a JSON object:
{
  "likelyMoves": [
    {
      "move": "specific thing they'll say or do",
      "probability": 0.75,
      "reasoning": "why they'll do this based on narcissist type",
      "howToRespond": "recommended response strategy"
    }
  ],
  "overallStrategy": "their overall manipulation strategy",
  "warningSign": "any escalation or danger signs"
}

No other text, just the JSON.`
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
    const result = await model.generateContent(prompt)
    let predictionText = result.response.text().trim()

    // Clean up JSON response
    predictionText = predictionText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const prediction = JSON.parse(predictionText)

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to predict next move' },
      { status: 500 }
    )
  }
}
