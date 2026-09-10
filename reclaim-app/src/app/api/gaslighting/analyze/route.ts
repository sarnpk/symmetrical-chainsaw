import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { gaslightingAI } from '@/lib/gaslighting-ai'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: statements } = await supabase
      .from('gaslighting_statements')
      .select('*')
      .eq('user_id', user.id)
      .order('statement_date', { ascending: true })

    if (!statements || statements.length < 2) {
      return NextResponse.json({ error: 'Need at least 2 statements' }, { status: 400 })
    }

    const analysis = await gaslightingAI.detectContradictions(statements)
    
    // Save contradictions to database
    for (const contradiction of analysis.contradictions) {
      await supabase.from('statement_contradictions').insert({
        user_id: user.id,
        statement_1_id: contradiction.statement_1.id,
        statement_2_id: contradiction.statement_2.id,
        contradiction_type: contradiction.contradiction_type,
        ai_confidence_score: contradiction.confidence,
        explanation: contradiction.explanation,
        time_between_statements: contradiction.days_apart
      })
    }

    return NextResponse.json(analysis)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
