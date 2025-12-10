import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { geminiAI } from '@/lib/gemini-ai'

export const dynamic = 'force-dynamic'

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
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!belief) {
    return NextResponse.json({ error: 'Belief not found' }, { status: 404 })
  }

  const prompt = `You are a trauma-informed therapist helping a survivor of narcissistic abuse.

Belief: "${belief.belief_text}"

Generate 3 realistic, grounded hope statements that:
1. Acknowledge the difficulty but emphasize it's temporary
2. Remind them of concrete actions they can take
3. Reference real recovery stories/statistics

CRITICAL: NO fantasy thinking. Be realistic but hopeful. Focus on empowerment through action.

Return JSON:
{
  "hope_statements": [
    "statement 1",
    "statement 2", 
    "statement 3"
  ],
  "recovery_insight": "brief insight about recovery from this belief"
}`

  try {
    const response = await geminiAI.chat(prompt, [], 'general')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')
    
    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json({ hope: result })
  } catch (error: any) {
    console.error('AI hope generation error:', error)
    return NextResponse.json({ error: 'Failed to generate hope statements' }, { status: 500 })
  }
}
