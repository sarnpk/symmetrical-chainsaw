import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { geminiAI } from '@/lib/gemini-ai'

export async function POST(request: Request) {
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

  const body = await request.json()
  const { memory_id } = body

  const { data: memory } = await supabase
    .from('toxic_memories')
    .select('*')
    .eq('id', memory_id)
    .eq('user_id', user.id)
    .single()

  if (!memory) {
    return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('language_preference')
    .eq('id', user.id)
    .single()

  const preferredLanguage = profile?.language_preference || 'auto'

  const prompt = `You are a trauma-informed therapist analyzing a toxic/abusive memory from narcissistic abuse.

MEMORY: "${memory.memory_text}"
DATE: ${memory.memory_date}
TAGS: ${memory.tags?.join(', ') || 'none'}

Provide a comprehensive analysis in JSON format:
{
  "npd_tactics": ["list of NPD manipulation tactics identified, e.g., gaslighting, DARVO, triangulation, love bombing, silent treatment"],
  "emotional_impact": "brief assessment of emotional toll (2-3 sentences)",
  "validation": "validating statement acknowledging this was abuse (2 sentences)",
  "suggested_beliefs": ["list of 2-3 false beliefs this memory may have installed, e.g., 'I am not good enough', 'I deserve to be treated badly'"],
  "coping_strategy": "one practical coping strategy for processing this memory"
}

Keep responses warm, empathetic, and under 200 words total.`

  try {
    const aiResponse = await geminiAI.chat(prompt, [], 'mind-reset', undefined, { preferredLanguage })
    const analysis = JSON.parse(aiResponse)

    await supabase
      .from('toxic_memories')
      .update({ ai_analysis: analysis })
      .eq('id', memory_id)
      .eq('user_id', user.id)

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze memory' }, { status: 500 })
  }
}
