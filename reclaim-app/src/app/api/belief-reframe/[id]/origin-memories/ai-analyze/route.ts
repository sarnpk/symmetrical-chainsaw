import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { geminiAI } from '@/lib/gemini-ai'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: belief } = await supabase
    .from('false_beliefs')
    .select('belief_text, origin_memories(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!belief || !belief.origin_memories || belief.origin_memories.length === 0) {
    return NextResponse.json({ error: 'No memories to analyze' }, { status: 400 })
  }

  // Get user's language preference
  const { data: profile } = await supabase
    .from('profiles')
    .select('language_preference')
    .eq('id', user.id)
    .single()

  const preferredLanguage = profile?.language_preference || 'auto'

  const memoriesText = belief.origin_memories
    .map((m: any, i: number) => `${i + 1}. ${m.memory_text}${m.memory_date ? ` (${new Date(m.memory_date).toLocaleDateString()})` : ''}`)
    .join('\n')

  const prompt = `Analyze these origin memories where a false belief was installed through narcissistic abuse.

BELIEF: "${belief.belief_text}"

ORIGIN MEMORIES:
${memoriesText}

Provide analysis in JSON format:
{
  "pattern": "What pattern do you see in how this belief was installed?",
  "manipulation_tactics": ["tactic1", "tactic2"],
  "emotional_impact": "How did these moments affect the person?",
  "reality_check": "What's the truth vs what they were told?",
  "healing_insight": "Key insight for healing from this"
}

Focus on:
- Identifying manipulation tactics (gaslighting, projection, etc)
- Recognizing patterns of reinforcement
- Validating the survivor's experience
- Providing therapeutic insight`

  try {
    const response = await geminiAI.chat(prompt, [], 'pattern-analysis', undefined, { preferredLanguage })
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON in response')
    }

    const analysis = JSON.parse(jsonMatch[0])
    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze memories' }, { status: 500 })
  }
}
