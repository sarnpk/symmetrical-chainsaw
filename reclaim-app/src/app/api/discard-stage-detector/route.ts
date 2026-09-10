import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' })

    const prompt = `Analyze this relationship situation and identify which narcissist discard stage they're experiencing:

SITUATION: "${text}"

Identify which stage:
1. DEVALUATION - Criticism, withdrawal, comparing to others, gaslighting intensifies
2. DISCARD - Abandonment, ghosting, blaming, moving to new supply, smear campaigns
3. POST_DISCARD - After the discard, healing phase, confusion, clarity emerging
4. HOOVERING - Attempts to pull them back in, apologies, love bombing, fake crises

Respond in JSON:
{
  "stage": "devaluation|discard|post_discard|hoovering",
  "stage_name": "Stage 1: Devaluation" (or appropriate stage name),
  "confidence": 85-98,
  "explanation": "2-3 sentence explanation of what this stage means",
  "behaviors": ["behavior1", "behavior2", "behavior3", "behavior4"],
  "what_next": "What to expect in the next phase",
  "recommendations": ["action1", "action2", "action3", "action4"]
}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid AI response')
    }

    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Discard stage analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
