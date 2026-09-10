import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: entries } = await supabase
      .from('acceptance_journal')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(30);

    if (!entries || entries.length < 3) {
      return NextResponse.json({ error: 'Need at least 3 entries for pattern detection' }, { status: 400 });
    }

    const { data: profile } = await supabase.from('profiles').select('language_preference').eq('id', user.id).single();
    const language = profile?.language_preference || 'en';

    const hopeTriggers = entries.flatMap(e => e.hope_triggers || []).filter(Boolean);
    const struggles = entries.map(e => e.daily_struggle).filter(Boolean);

    const prompt = `Analyze these hope triggers and struggles from narcissistic abuse recovery journal:

Hope Triggers (${hopeTriggers.length} instances):
${hopeTriggers.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Recent Struggles:
${struggles.slice(0, 10).map((s, i) => `${i + 1}. ${s}`).join('\n')}

Provide in ${language}:
1. Top 3 Recurring Hope Triggers: What patterns appear most?
2. Warning Signs: How to recognize these triggers early
3. Coping Strategies: Specific actions when triggered
4. Reality Anchors: Suggested grounding statements for each trigger

Be specific and actionable.`;

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
    const patterns = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ 
      patterns,
      totalTriggers: hopeTriggers.length,
      entriesAnalyzed: entries.length
    });
  } catch (err) {
    console.error('Pattern detection error:', err);
    return NextResponse.json({ error: 'Failed to detect patterns' }, { status: 500 });
  }
}
