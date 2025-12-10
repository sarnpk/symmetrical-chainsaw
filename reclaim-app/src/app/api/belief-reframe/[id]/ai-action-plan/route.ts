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

Generate a personalized action plan with:
1. 3 specific, small action steps they can take TODAY
2. 3 specific support resources/people they should reach out to

CRITICAL: Be specific and actionable. No vague advice. Consider legal, therapeutic, and practical support.

Return JSON:
{
  "action_steps": [
    "specific action 1",
    "specific action 2",
    "specific action 3"
  ],
  "support_resources": [
    "specific resource/person 1",
    "specific resource/person 2",
    "specific resource/person 3"
  ],
  "priority_action": "the most important first step"
}`

  try {
    const response = await geminiAI.chat(prompt, [], 'general')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')
    
    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json({ plan: result })
  } catch (error: any) {
    console.error('AI action plan error:', error)
    return NextResponse.json({ error: 'Failed to generate action plan' }, { status: 500 })
  }
}
