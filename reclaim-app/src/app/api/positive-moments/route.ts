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

export async function GET() {
  const supabase = getSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: moments, error } = await supabase
    .from('positive_moments')
    .select('*')
    .eq('user_id', user.id)
    .order('moment_date', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ moments })
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { moment_text, moment_date, tags, mood_rating } = body

  const { data: moment, error } = await supabase
    .from('positive_moments')
    .insert({
      user_id: user.id,
      moment_text,
      moment_date: moment_date || new Date().toISOString().split('T')[0],
      tags,
      mood_rating
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ moment })
}

export async function DELETE(request: Request) {
  const supabase = getSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const momentId = searchParams.get('id')

  if (!momentId) {
    return NextResponse.json({ error: 'Moment ID required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('positive_moments')
    .delete()
    .eq('id', momentId)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
