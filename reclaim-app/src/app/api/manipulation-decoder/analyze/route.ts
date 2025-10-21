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

  const { message_text } = await request.json();

  // Fetch NPD traits for context
  const { data: traits } = await supabase.from('npd_traits').select('*');

  const prompt = `You are an expert in narcissistic abuse patterns and manipulation tactics. Analyze this message from a narcissistic ex-partner and provide:

1. **Manipulation Tactics**: Identify specific NPD manipulation tactics present (reference these: ${traits?.map(t => t.name).join(', ')})
2. **Emotional Hooks**: What emotional buttons are they trying to push?
3. **Hidden Agenda**: What do they really want from this interaction?
4. **Grey Rock Response**: Provide 2-3 brief, neutral response options that don't give them emotional fuel

Message to analyze:
"${message_text}"

Format your response as JSON:
{
  "tactics": ["tactic1", "tactic2"],
  "emotional_hooks": ["hook1", "hook2"],
  "hidden_agenda": "what they really want",
  "grey_rock_responses": ["response1", "response2", "response3"],
  "explanation": "brief explanation of the manipulation pattern"
}`;

  try {
    const response = await geminiAI.chat(prompt, [], 'manipulation_analysis');
    
    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!analysis) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('AI analysis error:', error);
    return NextResponse.json({ 
      error: 'AI analysis failed', 
      details: error.message,
      fallback: {
        tactics: ['Unable to analyze - AI service unavailable'],
        emotional_hooks: ['Please try again later'],
        hidden_agenda: 'AI analysis temporarily unavailable',
        grey_rock_responses: ['Noted.', 'I\'ll consider that.', 'Okay.'],
        explanation: 'AI service is currently unavailable. Use the basic analysis or try again later.'
      }
    }, { status: 200 });
  }
}
