import { NextResponse } from 'next/server'

// POST /api/ai/suggest-coping-strategies
// Body: { context?: { mood?: number; anxiety?: number; energy?: number; preferred_categories?: string[] } }
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { context } = body || {}

    const preferred = Array.isArray(context?.preferred_categories) && context.preferred_categories.length > 0
      ? `Preferred categories: ${context.preferred_categories.join(', ')}`
      : 'Preferred categories: none specified'

    const moodLine = typeof context?.mood === 'number' ? `Mood: ${context.mood}/10` : 'Mood: n/a'
    const anxietyLine = typeof context?.anxiety === 'number' ? `Anxiety: ${context.anxiety}/10` : 'Anxiety: n/a'
    const energyLine = typeof context?.energy === 'number' ? `Energy: ${context.energy}/10` : 'Energy: n/a'

    const noteLine = context?.note ? `User note: ${String(context.note).slice(0, 500)}` : 'User note: n/a'

    const prompt = `
You are a trauma-informed coach. Suggest practical coping strategies tailored to the user's current state.
${moodLine}; ${anxietyLine}; ${energyLine}; ${preferred}. ${noteLine}.

Return STRICT JSON with this shape:
{
  "suggestions": [
    {
      "strategy_name": "string",
      "description": "1–3 short sentences with concrete steps",
      "category": "breathing|grounding|physical|creative|emotional|other",
      "effectiveness_rating": 1-5,
      "rationale": "why this may help"
    }
  ]
}
Keep items actionable and safe. Avoid clinical claims or diagnoses. Limit to 3-5 items.`

    const apiKey = process.env.GOOGLE_AI_API_KEY || ''
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOOGLE_AI_API_KEY' }, { status: 500 })
    }

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

    const resp = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1024 }
      })
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: `AI error: ${resp.status} ${text}` }, { status: 500 })
    }

    const data = await resp.json()
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI did not return structured data' }, { status: 500 })
    }

    let parsed: any
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    if (!parsed || !Array.isArray(parsed.suggestions)) {
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    const suggestions = parsed.suggestions
      .slice(0, 5)
      .map((s: any) => ({
        strategy_name: String(s.strategy_name || 'Suggested Strategy'),
        description: String(s.description || 'A practical coping step.'),
        category: ['breathing','grounding','physical','creative','emotional','other'].includes(String(s.category)) ? String(s.category) : 'other',
        effectiveness_rating: Math.min(5, Math.max(1, Number(s.effectiveness_rating || 3))),
        rationale: s.rationale ? String(s.rationale) : undefined
      }))

    return NextResponse.json({ suggestions }, { status: 200 })
  } catch (error) {
    console.error('AI suggestions error:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
