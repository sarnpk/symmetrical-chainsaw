import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check tier access
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profile?.subscription_tier !== 'recovery') {
      return NextResponse.json({ 
        error: 'This feature requires Recovery tier',
        requiredTier: 'recovery'
      }, { status: 403 });
    }

    const body = await request.json();
    const { condition_type, current_intensity, time_of_day, context } = body;

    // Get user's history
    const { data: logs } = await supabase
      .from('crisis_toolkit_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('condition_type', condition_type)
      .order('created_at', { ascending: false })
      .limit(10);

    // Calculate skill effectiveness
    const skillStats: any = {};
    logs?.forEach(log => {
      log.skills_used?.forEach((skill: string) => {
        if (!skillStats[skill]) {
          skillStats[skill] = { uses: 0, totalRating: 0, count: 0 };
        }
        skillStats[skill].uses++;
        if (log.helpful_rating) {
          skillStats[skill].totalRating += log.helpful_rating;
          skillStats[skill].count++;
        }
      });
    });

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' });
    
    const prompt = `You are an expert trauma-informed mental health coach specializing in narcissistic abuse recovery.

User is experiencing: ${condition_type.replace('_', ' ')}
Current intensity: ${current_intensity}/10
Time: ${time_of_day}
Context: ${context || 'Not specified'}

User's skill history:
${Object.entries(skillStats).map(([skill, stats]: [string, any]) => 
  `- ${skill}: Used ${stats.uses} times, avg rating ${stats.count > 0 ? (stats.totalRating / stats.count).toFixed(1) : 'N/A'}`
).join('\n') || 'No history yet'}

Generate 3 unique, personalized coping skill recommendations:

1. One based on their successful history (if available)
2. One innovative technique they haven't tried
3. One specifically for narcissistic abuse survivors

For each skill provide:
- Name (creative, memorable)
- Description (2-3 sentences, actionable)
- Why it works for this situation
- Estimated time (seconds)

Format as JSON array:
[{
  "name": "Skill Name",
  "description": "What to do",
  "why": "Why this works now",
  "duration": 60
}]

Return ONLY valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const recommendations = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
