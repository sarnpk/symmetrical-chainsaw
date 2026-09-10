import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import { checkAndRecordAIUsage } from '@/lib/usage-tracking'

interface TraitChecklistAnalysis {
  primaryType: string
  primaryConfidence: number
  secondaryTypes: Array<{ type: string; confidence: number }>
  traits: Record<string, boolean>
  severityScore: number
  description: string
  recommendations: string[]
}

const TRAIT_ANALYSIS_PROMPT = `You are an expert in narcissistic personality patterns.

Based on the following traits that a user has identified in someone:
{TRAITS}

Analyze and provide a JSON response with this exact structure:
{
  "primaryType": "Overt|Covert|Malignant|Vulnerable|Communal",
  "primaryConfidence": 0-100,
  "secondaryTypes": [
    {"type": "string", "confidence": 0-100}
  ],
  "severityScore": 1-10,
  "description": "detailed description of the narcissist profile",
  "recommendations": ["recommendation1", "recommendation2"]
}

Analyze based on:
- Overt: Grandiosity, entitlement, dominance, explicit superiority
- Covert: Victim mentality, passive-aggression, hidden superiority
- Malignant: Sadism, cruelty, lack of empathy, vindictiveness
- Vulnerable: Extreme sensitivity, shame-based, defensive
- Communal: False altruism, hidden superiority, moral superiority

Provide confidence scores and a severity rating.`

export async function POST(request: Request) {
  try {
    // Check usage and authenticate
    const usageCheck = await checkAndRecordAIUsage('trait_checklist')
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

    const { traits } = await request.json()

    if (!traits || Object.keys(traits).length === 0) {
      return NextResponse.json(
        { error: 'At least one trait must be selected' },
        { status: 400 }
      )
    }

    // Format traits for analysis
    const selectedTraits = Object.entries(traits)
      .filter(([_, selected]) => selected)
      .map(([trait]) => trait)
      .join(', ')

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' })
    const prompt = TRAIT_ANALYSIS_PROMPT.replace('{TRAITS}', selectedTraits)
    
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const analysis: TraitChecklistAnalysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Trait checklist analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze traits', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
