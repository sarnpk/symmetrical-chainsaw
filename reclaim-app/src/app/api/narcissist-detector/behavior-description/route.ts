import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { checkAndRecordAIUsage } from '@/lib/usage-tracking'

interface BehaviorAnalysis {
  primaryType: string
  primaryConfidence: number
  detectedPatterns: string[]
  traits: Record<string, number>
  severityScore: number
  manipulationTactics: string[]
  analysis: string
  recommendations: string[]
}

const BEHAVIOR_ANALYSIS_PROMPT = `You are an expert in narcissistic personality patterns and manipulation tactics.

A user has described the following behaviors they've observed:
{DESCRIPTION}

Analyze these behaviors and provide a JSON response with this exact structure:
{
  "primaryType": "Overt|Covert|Malignant|Vulnerable|Communal",
  "primaryConfidence": 0-100,
  "detectedPatterns": ["pattern1", "pattern2"],
  "traits": {
    "gaslighting": 0-100,
    "love_bombing": 0-100,
    "hoovering": 0-100,
    "triangulation": 0-100,
    "projection": 0-100,
    "devaluation": 0-100,
    "victim_mentality": 0-100,
    "passive_aggression": 0-100,
    "lack_of_empathy": 0-100,
    "entitlement": 0-100
  },
  "severityScore": 1-10,
  "manipulationTactics": ["tactic1", "tactic2"],
  "analysis": "detailed analysis of the behaviors",
  "recommendations": ["recommendation1", "recommendation2"]
}

Look for:
- Patterns of manipulation
- Emotional abuse indicators
- Control behaviors
- Lack of accountability
- Inconsistent behavior
- Boundary violations

Provide confidence scores and severity rating based on the described behaviors.`

export async function POST(request: Request) {
  try {
    // Check usage and authenticate
    const usageCheck = await checkAndRecordAIUsage('behavior_description')
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

    const { description } = await request.json()

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please describe the behaviors you\'ve observed' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' })
    const prompt = BEHAVIOR_ANALYSIS_PROMPT.replace('{DESCRIPTION}', description)
    
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const analysis: BehaviorAnalysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Behavior analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze behaviors', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
