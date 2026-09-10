import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { geminiAI } from '@/lib/gemini-ai';

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
  }

  const { percentages, reflection, guilt_feeling } = await request.json();

  const prompt = `You are a trauma-informed therapist helping a narcissistic abuse survivor redirect their empathy in healthier ways.

Current Empathy Distribution:
- Ex-Partner: ${percentages.ex_partner}%
- Children: ${percentages.children}%
- Self: ${percentages.self}%
- Others: ${percentages.others}%

User's Reflection: "${reflection || 'No reflection provided'}"
${guilt_feeling ? `User feels guilty about: "${guilt_feeling}"` : ''}

Provide personalized guidance as JSON:
{
  "assessment": "brief assessment of their empathy distribution",
  "red_flags": ["concern1", "concern2"],
  "rebalancing_strategies": [
    {"target": "ex_partner|children|self|others", "action": "specific action", "why": "explanation"}
  ],
  "guilt_buster": "personalized response to address their guilt",
  "affirmations": ["affirmation1", "affirmation2", "affirmation3"],
  "next_steps": ["step1", "step2"]
}

Focus on:
- Validating their current state without judgment
- Explaining why redirecting empathy from ex is healthy
- Emphasizing children need emotionally available parent
- Building self-compassion
- Addressing guilt about detachment`;

  try {
    const response = await geminiAI.chat(prompt, [], 'empathy_analysis');
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!analysis) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('AI empathy analysis error:', error);
    return NextResponse.json({ 
      fallback: {
        assessment: 'AI analysis temporarily unavailable',
        red_flags: ['High empathy toward ex-partner may drain your emotional resources'],
        rebalancing_strategies: [
          {target: 'self', action: 'Practice daily self-compassion', why: 'You deserve the same kindness you give others'},
          {target: 'children', action: 'Focus emotional energy on being present with kids', why: 'They need a stable, emotionally available parent'}
        ],
        guilt_buster: 'Detaching from your ex is not cruelâ€”it\'s survival. Your children need you emotionally healthy.',
        affirmations: [
          'I deserve to redirect my empathy to those who reciprocate',
          'Protecting my peace is protecting my children',
          'I am not abandoning anyoneâ€”I am choosing myself'
        ],
        next_steps: ['Set one boundary this week', 'Practice saying no without explanation']
      }
    }, { status: 200 });
  }
}
