import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { condition_type, affirmation } = body;

    // Get user's history with this condition
    const { data: logs } = await supabase
      .from('crisis_toolkit_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('condition_type', condition_type)
      .order('created_at', { ascending: false })
      .limit(5);

    const usageCount = logs?.length || 0;
    const lastUsed = logs?.[0]?.created_at;

    // Generate personalized message
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a compassionate mental health support assistant. 

The user is experiencing ${condition_type.replace('_', ' ')} and has used this toolkit ${usageCount} times before.

Base affirmation: "${affirmation}"

Create a brief, personalized variation (1-2 sentences) that:
- Acknowledges their resilience if they've used it before
- Keeps the core message of the original affirmation
- Feels warm and supportive
- Uses "you" language

Return ONLY the personalized affirmation, nothing else.`;

    const result = await model.generateContent(prompt);
    const personalizedAffirmation = result.response.text().trim();

    return NextResponse.json({ 
      personalizedAffirmation,
      usageCount,
      lastUsed 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
