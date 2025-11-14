import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { acceptance_level, daily_struggle, hope_triggers, reality_anchors, emotional_state } = await request.json();

  // Get user's language preference
  const { data: profile } = await supabase.from('profiles').select('language_preference').eq('id', user.id).single();
  const language = profile?.language_preference || 'en';

  const prompt = `You are an AI therapist specializing in narcissistic abuse recovery and acceptance therapy. Analyze this daily acceptance journal entry and provide therapeutic insights.

Entry Details:
- Acceptance Level: ${acceptance_level}/10
- Daily Struggle: ${daily_struggle}
- Hope Triggers: ${hope_triggers?.join(', ') || 'None'}
- Reality Anchors: ${reality_anchors?.join(', ') || 'None'}
- Emotional State: ${emotional_state}

Provide a therapeutic response in ${language} with:
1. Validation of their current acceptance level
2. Insight about their struggle pattern
3. Analysis of hope triggers (if any)
4. Reinforcement of reality anchors
5. Gentle guidance for tomorrow

Keep response supportive, professional, and focused on acceptance rather than change.`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      })
    });

    const data = await response.json();
    const insight = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate insights at this time.';

    return NextResponse.json({ insight });
  } catch (error) {
    return NextResponse.json({
      insight: `Your acceptance level of ${acceptance_level}/10 shows you're on a healing journey. ${daily_struggle ? 'The struggles you faced today are part of the process.' : ''} Remember that acceptance comes in waves - be gentle with yourself.`
    });
  }
}