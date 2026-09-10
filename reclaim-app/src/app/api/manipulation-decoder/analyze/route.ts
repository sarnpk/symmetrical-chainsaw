import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { geminiAI } from '@/lib/gemini-ai';
import { checkAndRecordAIUsage } from '@/lib/usage-tracking';

export async function POST(request: Request) {
  // Check usage and authenticate
  const usageCheck = await checkAndRecordAIUsage('message_analysis');
  if ('error' in usageCheck) {
    return NextResponse.json({ error: usageCheck.error }, { status: usageCheck.status });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
  }

  const { message_text, context } = await request.json();

  // Fetch NPD traits for context
  const { data: traits } = await supabase.from('npd_traits').select('*');

  const contextSection = context ? `

**Conversation Context**: ${context}

Use this context to better understand the relationship dynamics and provide more accurate analysis.` : '';

  const prompt = `You are an expert in narcissistic abuse patterns and manipulation tactics. Analyze this message from a narcissistic ex-partner and provide:

1. **Manipulation Tactics**: Identify specific NPD manipulation tactics present (reference these: ${traits?.map(t => t.name).join(', ')})
2. **Emotional Hooks**: What emotional buttons are they trying to push?
3. **Hidden Agenda**: What do they really want from this interaction?
4. **Grey Rock Response**: Provide 2-3 brief, neutral response options that don't give them emotional fuel
${contextSection}

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

    // Save AI analysis to database
    try {
      console.log('Saving AI manipulation analysis to database')
      
      // Map tactics to trait IDs if possible
      const identifiedTactics: string[] = [];
      if (analysis.tactics && Array.isArray(analysis.tactics)) {
        for (const tacticName of analysis.tactics) {
          const matchingTrait = traits?.find(t => 
            t.name.toLowerCase().includes(tacticName.toLowerCase()) ||
            tacticName.toLowerCase().includes(t.name.toLowerCase())
          );
          if (matchingTrait) {
            identifiedTactics.push(matchingTrait.id);
          }
        }
      }

      const insertData = {
        user_id: user.id,
        message_text: message_text || '',
        identified_tactics: identifiedTactics,
        emotional_impact: 'moderate', // Default since AI doesn't specify
        is_my_fault: false,
        notes: JSON.stringify({
          ai_analysis: true,
          tactics: analysis.tactics,
          emotional_hooks: analysis.emotional_hooks,
          hidden_agenda: analysis.hidden_agenda,
          explanation: analysis.explanation,
          context: context || null
        })
      };

      console.log('Saving AI analysis:', insertData);

      const { data: savedData, error: saveError } = await supabase
        .from('manipulation_analysis')
        .insert(insertData)
        .select()
        .single();

      if (saveError) {
        console.error('Failed to save AI analysis to database:', saveError);
        // Don't fail the request, just log the error
      } else {
        console.log('AI analysis saved successfully:', savedData);
      }
    } catch (saveError) {
      console.error('Error saving AI analysis:', saveError);
      // Don't fail the request, just log the error
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
