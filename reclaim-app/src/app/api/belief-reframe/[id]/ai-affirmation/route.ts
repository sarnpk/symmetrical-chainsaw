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
    .select('belief_text, counter_evidence(evidence_text)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!belief) {
    return NextResponse.json({ error: 'Belief not found' }, { status: 404 })
  }

  const evidenceList = belief.counter_evidence?.map((e: any) => e.evidence_text).join('\n- ') || 'No evidence yet'

  const prompt = `Create a believable, grounded affirmation for someone recovering from narcissistic abuse.

FALSE BELIEF: "${belief.belief_text}"

COUNTER-EVIDENCE COLLECTED:
- ${evidenceList}

Create an affirmation that:
1. Is believable (not toxic positivity like "I am perfect")
2. Acknowledges the healing journey ("I am learning...")
3. References their actual counter-evidence
4. Is 1-2 sentences
5. Feels empowering but realistic

Return ONLY the affirmation text, nothing else.`

  try {
    const affirmation = await geminiAI.chat(prompt, [], 'mind-reset')
    
    const { data: saved } = await supabase
      .from('belief_affirmations')
      .insert({
        user_id: user.id,
        belief_id: params.id,
        affirmation_text: affirmation.trim(),
        is_ai_generated: true
      })
      .select()
      .single()

    return NextResponse.json({ affirmation: saved })
  } catch (error: any) {
    console.error('AI affirmation error:', error)
    return NextResponse.json({ error: 'Failed to generate affirmation' }, { status: 500 })
  }
}
