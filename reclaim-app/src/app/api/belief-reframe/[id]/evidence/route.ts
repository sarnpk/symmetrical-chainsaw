import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

function getSupabase() {
  const cookieStore = cookies()
  return createServerClient(
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
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { evidence_text, evidence_source, evidence_strength, related_journal_entry_id } = body

  const { data: evidence, error } = await supabase
    .from('counter_evidence')
    .insert({
      belief_id: params.id,
      user_id: user.id,
      evidence_text,
      evidence_source: evidence_source || 'manual',
      evidence_strength: evidence_strength || 3,
      related_journal_entry_id
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ evidence })
}

export async function DELETE(request: Request) {
  const supabase = getSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const evidenceId = searchParams.get('evidenceId')

  if (!evidenceId) {
    return NextResponse.json({ error: 'Evidence ID required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('counter_evidence')
    .delete()
    .eq('id', evidenceId)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
