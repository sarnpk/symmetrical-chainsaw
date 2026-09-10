import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/gemini-ai';

export async function POST(request: NextRequest) {
  try {
    const { incomingMessage, draftResponse } = await request.json();

    const prompt = `You are a BIFF communication expert helping someone deal with a high-conflict narcissistic co-parent.

${incomingMessage ? `THEIR MESSAGE: "${incomingMessage}"` : ''}
${draftResponse ? `USER'S DRAFT: "${draftResponse}"` : ''}

Analyze and provide:
1. Manipulation tactics detected (gaslighting, blame-shifting, DARVO, etc.)
2. Suggested BIFF response (Brief, Informative, Friendly, Firm - max 3 sentences)
3. Emotional triggers to watch for
4. JADE warning (if draft contains Justify, Argue, Defend, Explain)

Format as JSON:
{
  "manipulationTactics": ["tactic1", "tactic2"],
  "suggestedResponse": "Hi [Name], ...",
  "emotionalTriggers": ["trigger1"],
  "jadeWarning": "Remove justifications like...",
  "biffScore": 8
}`;

    const analysis = await generateAIResponse(prompt);
    
    try {
      const parsed = JSON.parse(analysis);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        manipulationTactics: [],
        suggestedResponse: analysis,
        emotionalTriggers: [],
        jadeWarning: null,
        biffScore: 5
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
