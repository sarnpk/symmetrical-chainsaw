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

  const { template_text, their_message, tone_preference } = await request.json();

  const prompt = `You are helping someone respond to a manipulative ex-partner using the Grey Rock method. 

Grey Rock principles:
- Keep responses BRIEF (1-2 sentences max)
- Stay NEUTRAL and emotionless
- Don't defend, explain, or justify
- Don't give them emotional fuel
- Be boring and uninteresting

Template response: "${template_text}"
Their message: "${their_message || 'N/A'}"
Tone preference: ${tone_preference || 'neutral'}

Generate 3 variations of this Grey Rock response that:
1. Follow Grey Rock principles strictly
2. Sound natural and conversational (not robotic)
3. Match the ${tone_preference || 'neutral'} tone
4. Are contextually appropriate for their message
5. Stay under 20 words each

Format as JSON:
{
  "variations": ["response1", "response2", "response3"]
}`;

  try {
    const response = await geminiAI.chat(prompt, [], 'template_customization');
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!result) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI customization error:', error);
    return NextResponse.json({ 
      error: 'AI customization failed',
      variations: [template_text, 'Noted.', 'I understand.']
    }, { status: 200 });
  }
}
