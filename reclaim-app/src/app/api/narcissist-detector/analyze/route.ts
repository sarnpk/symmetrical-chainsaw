import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { checkAndRecordAIUsage } from '@/lib/usage-tracking'

interface AnalysisResult {
  primaryType: string
  primaryConfidence: number
  traits: Record<string, number>
  manipulationTactics: string[]
  severityScore: number
  keyPhrases: Array<{
    phrase: string
    tactic: string
    explanation: string
  }>
  recommendedStrategies: string[]
}

const ANALYSIS_PROMPT = `You are an expert in narcissistic personality patterns and manipulation tactics.

Analyze the following text for narcissistic traits and behaviors.

Text to analyze:
"{TEXT}"

Provide a JSON response with this exact structure:
{
  "primaryType": "Overt|Covert|Malignant",
  "primaryConfidence": 0-100,
  "traits": {
    "gaslighting": 0-100,
    "love_bombing": 0-100,
    "hoovering": 0-100,
    "triangulation": 0-100,
    "projection": 0-100
  },
  "manipulationTactics": ["tactic1", "tactic2"],
  "severityScore": 1-10,
  "discardStage": "devaluation|discard|post_discard|hoovering|none",
  "discardStageConfidence": 0-100,
  "discardStageNote": "Brief note if in discard phase",
  "keyPhrases": [
    {
      "phrase": "exact phrase from text",
      "tactic": "tactic name",
      "explanation": "why this is concerning"
    }
  ],
  "recommendedStrategies": ["strategy1", "strategy2"]
}

Be specific with examples from the text. Provide confidence scores 0-100 for all detections.`

export async function POST(request: Request) {
  try {
    // Check usage and authenticate
    const usageCheck = await checkAndRecordAIUsage('message_analysis')
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

    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text input is required' },
        { status: 400 }
      )
    }

    // Call Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' })
    
    const prompt = ANALYSIS_PROMPT.replace('{TEXT}', text)
    
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const analysis: AnalysisResult = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze text', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
