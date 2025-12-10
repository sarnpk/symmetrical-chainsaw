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

  const prompt = `You are a trauma-informed therapist creating empowering analogies for abuse survivors.

User's Belief/Situation: "${belief.belief_text}"

Create a powerful, empowering analogy that:
1. Uses a vivid metaphor (captain of ship, phoenix rising, warrior, etc.)
2. Acknowledges the current difficulty/storm
3. Emphasizes THEY ARE IN CONTROL right now
4. Shows the difficulty is temporary
5. Ends with emerging stronger

CRITICAL:
- Generate a UNIQUE analogy (not generic)
- Make it visual and memorable
- Focus on CONTROL and POWER they have NOW
- 3-4 sentences, powerful and direct
- Use "YOU ARE" statements (present tense)

Return JSON:
{
  "title": "Short powerful title (e.g., 'YOU ARE IN CONTROL RIGHT NOW')",
  "analogy": "The full analogy text (3-4 sentences)",
  "core_message": "One sentence core empowerment message"
}`

  try {
    const response = await geminiAI.chat(prompt, [], 'general')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')
    
    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json({ analogy: result })
  } catch (error: any) {
    console.error('AI analogy error:', error)
    return NextResponse.json({ error: 'Failed to generate analogy' }, { status: 500 })
  }
}
