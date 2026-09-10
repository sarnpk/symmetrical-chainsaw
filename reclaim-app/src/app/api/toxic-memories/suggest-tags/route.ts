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
  const { memory_text } = body

  const prompt = `Analyze this toxic/abusive memory and suggest relevant tags from this list:
gaslighting, manipulation, verbal_abuse, emotional_abuse, control, silent_treatment, love_bombing, triangulation, projection, DARVO, blame_shifting, rage, threats, intimidation, isolation, financial_abuse, coercion, stalking, smear_campaign, hoovering

Memory: "${memory_text}"

Return ONLY a JSON array of 2-5 most relevant tags. Example: ["gaslighting", "DARVO", "projection"]`

  try {
    const aiResponse = await geminiAI.chat(prompt, [], 'mind-reset')
    const tags = JSON.parse(aiResponse)
    return NextResponse.json({ tags })
  } catch (error) {
    return NextResponse.json({ tags: [] })
  }
}
