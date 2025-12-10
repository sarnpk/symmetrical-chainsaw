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

  const prompt = `You are a trauma-informed therapist with access to research on narcissistic abuse recovery.

User's Belief: "${belief.belief_text}"

Generate a personalized recovery story that:

1. **Character**: Create a relatable person (name, age, similar situation)
2. **Crisis Point**: Show when they had this exact belief
3. **Normalization**: Include REAL statistics (research how many people face this - use millions/thousands)
4. **Timeline**: Provide realistic recovery timeline (e.g., "first 3 months were hardest, by month 8...")
5. **Actions Taken**: List 3-4 SPECIFIC actions they took (therapy, legal help, support groups, etc.)
6. **Current State**: Show them thriving now (2-3 years later)
7. **Mentorship**: Show them helping others now

CRITICAL REQUIREMENTS:
- Generate ALL data from your knowledge (statistics, timelines, actions)
- NO generic advice - be SPECIFIC
- Include real numbers: "X million people", "X% recover within Y months"
- Make timeline realistic (not "overnight" - show it took 1-2 years)
- Focus on ACTIONS they took, not just feelings

Return JSON (150-250 words for story):
{
  "story": "Full narrative with character, crisis, actions, timeline, and current thriving state",
  "key_takeaway": "One powerful sentence about what made recovery possible",
  "statistic": "Specific statistic with numbers that normalizes their experience (e.g., 'Research shows 3.2 million people annually...')"
}`

  try {
    const response = await geminiAI.chat(prompt, [], 'general')
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')
    
    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json({ recovery: result })
  } catch (error: any) {
    console.error('AI recovery story error:', error)
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 })
  }
}
