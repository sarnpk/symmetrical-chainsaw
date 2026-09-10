import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { checkAndRecordAIUsage } from '@/lib/usage-tracking'

interface ConversationAnalysis {
  overallAnalysis: {
    primaryType: string
    primaryConfidence: number
    traits: Record<string, number>
    severityScore: number
  }
  patterns: {
    recurringTactics: string[]
    cycleDetected: string
    escalationIndicators: string[]
    triggers: string[]
  }
  predictions: {
    likelyResponses: Array<{
      response: string
      probability: number
      reasoning: string
      emotionalImpact: string
    }>
    nextPhase: string
    timing: string
  }
}

const CONVERSATION_ANALYSIS_PROMPT = `You are an expert in narcissistic personality patterns and manipulation tactics.

Analyze the following conversation for narcissistic patterns, cycles, and likely next moves.

Conversation:
{CONVERSATION}

Provide a JSON response with this exact structure:
{
  "overallAnalysis": {
    "primaryType": "Overt|Covert|Malignant",
    "primaryConfidence": 0-100,
    "traits": {
      "gaslighting": 0-100,
      "love_bombing": 0-100,
      "hoovering": 0-100,
      "triangulation": 0-100,
      "projection": 0-100
    },
    "severityScore": 1-10
  },
  "patterns": {
    "recurringTactics": ["tactic1", "tactic2"],
    "cycleDetected": "description of cycle",
    "escalationIndicators": ["indicator1"],
    "triggers": ["trigger1"]
  },
  "predictions": {
    "likelyResponses": [
      {
        "response": "predicted response text",
        "probability": 0-100,
        "reasoning": "why this response is likely",
        "emotionalImpact": "HIGH|MEDIUM|LOW"
      }
    ],
    "nextPhase": "predicted next phase",
    "timing": "when it might happen"
  }
}

Analyze the conversation for:
1. Recurring manipulation tactics
2. Narcissistic cycles (love-bombing â†’ devaluation â†’ hoovering)
3. Escalation patterns
4. Emotional triggers
5. Likely next responses based on patterns

Be specific with examples from the conversation.`

export async function POST(request: Request) {
  try {
    // Check usage and authenticate
    const usageCheck = await checkAndRecordAIUsage('conversation_analysis')
    if ('error' in usageCheck) {
      return NextResponse.json({ error: usageCheck.error }, { status: usageCheck.status })
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      console.error('GOOGLE_AI_API_KEY environment variable not set')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    const { messages } = await request.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Conversation messages are required' },
        { status: 400 }
      )
    }

    // Format conversation for analysis
    const conversationText = messages
      .map((msg: any) => `${msg.role === 'user' ? 'You' : 'Them'}: ${msg.content}`)
      .join('\n')

    // Call Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    
    const prompt = CONVERSATION_ANALYSIS_PROMPT.replace('{CONVERSATION}', conversationText)
    
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const analysis: ConversationAnalysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Conversation analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze conversation', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
