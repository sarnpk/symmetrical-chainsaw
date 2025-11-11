import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

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

  const body = await request.json()
  const { evidence_for, evidence_against, alternative_explanation, source_analysis, strength_before, strength_after, insights } = body

  const { data: session, error } = await supabase
    .from('reality_testing_sessions')
    .insert({
      belief_id: params.id,
      user_id: user.id,
      evidence_for,
      evidence_against,
      alternative_explanation,
      source_analysis,
      strength_before,
      strength_after,
      insights
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (strength_after && strength_after !== strength_before) {
    await supabase
      .from('false_beliefs')
      .update({ current_strength: strength_after, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', user.id)
  }

  return NextResponse.json({ session })
}
