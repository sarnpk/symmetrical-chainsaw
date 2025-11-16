import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: entries } = await supabase
      .from('acceptance_journal')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_date', sevenDaysAgo.toISOString().split('T')[0])
      .order('entry_date', { ascending: true });

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: 'Need at least 1 entry for analysis' }, { status: 400 });
    }

    const { data: profile } = await supabase.from('profiles').select('language_preference').eq('id', user.id).single();
    const language = profile?.language_preference || 'en';

    const prompt = `Analyze this week's acceptance journal entries for narcissistic abuse recovery:

${entries.map((e, i) => `Day ${i + 1} (${e.entry_date}):
- Acceptance Level: ${e.acceptance_level}/10
- Struggle: ${e.daily_struggle || 'None'}
- Hope Triggers: ${e.hope_triggers?.join(', ') || 'None'}
- Reality Anchors: ${e.reality_anchors?.join(', ') || 'None'}
- Emotional State: ${e.emotional_state || 'Not specified'}`).join('\n\n')}

Provide in ${language}:
1. Acceptance Trend: Are they progressing, stable, or struggling?
2. Key Patterns: What recurring struggles or triggers appear?
3. Strengths: What reality anchors are working?
4. Recommendations: 2-3 specific actions for next week
5. Encouragement: Brief supportive message

Keep response concise and actionable.`;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ 
      analysis,
      entries: entries.length,
      avgAcceptance: (entries.reduce((sum, e) => sum + e.acceptance_level, 0) / entries.length).toFixed(1)
    });
  } catch (err) {
    console.error('Weekly analysis error:', err);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
