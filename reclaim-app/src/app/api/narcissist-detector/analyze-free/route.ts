import { NextRequest, NextResponse } from 'next/server'
import { geminiAI, DEFAULT_FREE_TIER_MODEL } from '@/lib/gemini-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Simple AI prompt for free analysis
    const prompt = `Analyze this text for narcissistic behavior patterns:

"${text}"

Provide a JSON response with:
{
  "narcissist_type": "type name (e.g., Covert Narcissist, Overt Narcissist)",
  "confidence": 85,
  "severity_score": 7,
  "traits": ["trait1", "trait2", "trait3", "trait4"],
  "summary": "brief explanation"
}

Identify the narcissist type, confidence level (0-100), severity (1-10), and 4-6 manipulation traits detected.`

    const aiResponse = await geminiAI.chat(
      prompt,
      [],
      'pattern-analysis',
      DEFAULT_FREE_TIER_MODEL
    )

    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Free analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
