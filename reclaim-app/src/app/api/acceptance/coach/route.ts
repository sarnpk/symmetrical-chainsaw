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

  const { module_type, user_input, context } = await request.json();

  const prompts: Record<string, string> = {
    mask_visualization: `You are a trauma-informed therapist helping a narcissistic abuse survivor understand "The Mask."

User's reflection: "${user_input}"

Help them understand that the person they married wasn't real - it was a carefully constructed mask. Provide:

{
  "insight": "personalized insight about their specific situation",
  "mask_vs_reality": {
    "what_they_showed": "what the mask presented",
    "what_was_real": "the reality behind the mask"
  },
  "validation": "validate their experience and feelings",
  "affirmations": ["affirmation1", "affirmation2", "affirmation3"],
  "next_step": "gentle next step in acceptance"
}`,

    grief_processing: `You are a grief counselor helping someone mourn the loss of an illusion.

User's feelings: "${user_input}"

Guide them through grief for what they thought they had. Provide:

{
  "grief_stage": "which stage of grief this reflects",
  "validation": "validate their grief as real and necessary",
  "reframe": "help reframe what they're actually grieving",
  "coping_strategies": ["strategy1", "strategy2"],
  "affirmations": ["affirmation1", "affirmation2"],
  "hope_message": "message of hope for the future"
}`,

    acceptance_affirmations: `You are creating personalized acceptance affirmations.

User's struggle: "${user_input}"
Context: ${context || 'General acceptance work'}

Create personalized affirmations that acknowledge NPD is permanent and not their fault:

{
  "personalized_affirmations": ["affirmation1", "affirmation2", "affirmation3", "affirmation4", "affirmation5"],
  "why_these_matter": "brief explanation of why these specific affirmations address their struggle",
  "daily_practice": "how to use these affirmations effectively"
}`,

    expectation_vs_reality: `You are helping someone confront the gap between expectation and reality.

What they expected: "${user_input}"
Context: ${context || ''}

Help them process this gap:

{
  "expectation_analysis": "what this expectation reveals",
  "reality_check": "the actual reality of NPD",
  "why_gap_exists": "why this gap is so painful",
  "acceptance_path": "how to accept this reality",
  "affirmations": ["affirmation1", "affirmation2"],
  "action_step": "one concrete step toward acceptance"
}`,

    trigger_identification: `You are helping identify triggers that cause slipping back into hope.

User's trigger: "${user_input}"

Analyze this trigger and provide strategies:

{
  "trigger_analysis": "what this trigger reveals",
  "why_it_works": "why this particular thing triggers hope",
  "reality_reminder": "gentle reality check about NPD permanence",
  "prevention_strategies": ["strategy1", "strategy2", "strategy3"],
  "in_the_moment_response": "what to do when triggered",
  "affirmations": ["affirmation1", "affirmation2"]
}`
  };

  const prompt = prompts[module_type] || prompts.acceptance_affirmations;

  try {
    const response = await geminiAI.chat(prompt, [], 'acceptance_coaching');
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const coaching = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!coaching) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(coaching);
  } catch (error: any) {
    console.error('AI acceptance coaching error:', error);
    return NextResponse.json({ 
      fallback: {
        insight: 'AI coaching temporarily unavailable',
        validation: 'Your feelings are valid. NPD is permanent, and accepting this is one of the hardest parts of healing.',
        affirmations: [
          'I am not responsible for their disorder',
          'Accepting reality is not giving upâ€”it\'s choosing peace',
          'I deserve a life free from false hope'
        ],
        next_step: 'Take time to process these feelings. Healing is not linear.'
      }
    }, { status: 200 });
  }
}
