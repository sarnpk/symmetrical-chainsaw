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

  const { situation, decision_type } = await request.json();

  const prompt = `You are a co-parenting advisor helping someone reframe their relationship with a narcissistic ex from "spouse" to "difficult project manager."

Situation: "${situation}"
Decision Type: ${decision_type || 'general'}

Analyze this situation and provide clear guidance:

{
  "is_my_responsibility": true/false,
  "reasoning": "clear explanation of why this is or isn't their responsibility",
  "boundary_statement": "suggested boundary statement if not their responsibility",
  "emotional_vs_logical": {
    "emotional_response": "what emotions might be driving this",
    "logical_response": "what logic says about this responsibility"
  },
  "project_manager_approach": "how to handle this as a project manager, not a spouse",
  "red_flags": ["any manipulation attempts in this situation"],
  "action_steps": ["concrete step1", "concrete step2"],
  "affirmation": "affirmation to reinforce healthy boundaries"
}

Focus on:
- Clear responsibility boundaries
- Distinguishing emotional obligation from actual responsibility
- Protecting their peace and energy
- Co-parenting logistics vs emotional caretaking
- Not being manipulated by guilt`;

  try {
    const response = await geminiAI.chat(prompt, [], 'role_reframing');
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!analysis) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('AI role reframing error:', error);
    return NextResponse.json({ 
      fallback: {
        is_my_responsibility: false,
        reasoning: 'AI analysis temporarily unavailable. When in doubt, if it doesn\'t directly affect your children\'s safety or wellbeing, it\'s likely not your responsibility.',
        boundary_statement: 'That\'s not something I can help with.',
        emotional_vs_logical: {
          emotional_response: 'You may feel obligated due to past patterns',
          logical_response: 'You are not responsible for their problems or emotions'
        },
        project_manager_approach: 'Keep communication brief, factual, and focused only on co-parenting logistics.',
        red_flags: ['Unable to analyze - use your gut feeling'],
        action_steps: ['Set a clear boundary', 'Don\'t explain or justify'],
        affirmation: 'I am not responsible for their problems. My responsibility is to my children and myself.'
      }
    }, { status: 200 });
  }
}
