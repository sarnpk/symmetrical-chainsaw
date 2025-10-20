import type { NextApiRequest, NextApiResponse } from 'next'
import { geminiAI } from '@/lib/gemini-ai'

// Suggests 3-5 coping strategies in a structured format
// Request: POST { context?: { mood?: number; anxiety?: number; energy?: number; preferred_categories?: string[] } }
// Response: { suggestions: Array<{ strategy_name: string; description: string; category: string; effectiveness_rating: number; rationale?: string }> }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { context } = req.body || {}

    const preferred = Array.isArray(context?.preferred_categories) && context.preferred_categories.length > 0
      ? `Preferred categories: ${context.preferred_categories.join(', ')}`
      : 'Preferred categories: none specified'

    const moodLine = typeof context?.mood === 'number' ? `Mood: ${context.mood}/10` : 'Mood: n/a'
    const anxietyLine = typeof context?.anxiety === 'number' ? `Anxiety: ${context.anxiety}/10` : 'Anxiety: n/a'
    const energyLine = typeof context?.energy === 'number' ? `Energy: ${context.energy}/10` : 'Energy: n/a'

    const rawNote: string | undefined = typeof context?.note === 'string' ? context.note : undefined
    const noteLine = rawNote && rawNote.trim().length > 0
      ? `Context note: "${rawNote.trim().slice(0, 500)}"\n`
      : ''

    const prompt = `
You are a trauma-informed coach. Suggest practical coping strategies tailored to the user's current state.
${moodLine}; ${anxietyLine}; ${energyLine}; ${preferred}.
${noteLine}
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

    const text = await geminiAI.chat(prompt)

    // Extract JSON from the model response safely
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'AI did not return structured data' })
    }

    let parsed: any
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse AI response' })
    }

    if (!parsed || !Array.isArray(parsed.suggestions)) {
      return res.status(500).json({ error: 'Invalid AI response format' })
    }

    // Basic sanitization and fallback values
    const suggestions = parsed.suggestions
      .slice(0, 5)
      .map((s: any) => ({
        strategy_name: String(s.strategy_name || 'Suggested Strategy'),
        description: String(s.description || 'A practical coping step.'),
        category: ['breathing','grounding','physical','creative','emotional','other'].includes(String(s.category)) ? String(s.category) : 'other',
        effectiveness_rating: Math.min(5, Math.max(1, Number(s.effectiveness_rating || 3))),
        rationale: s.rationale ? String(s.rationale) : undefined
      }))

    return res.status(200).json({ suggestions })
  } catch (error) {
    console.error('AI suggestions error:', error)
    return res.status(500).json({ error: 'Failed to generate suggestions' })
  }
}
