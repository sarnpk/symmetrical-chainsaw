import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/preferences
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('profiles')
      .select('chat_enabled')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Get preferences error:', error)
      return NextResponse.json({ error: 'Failed to get preferences' }, { status: 500 })
    }

    return NextResponse.json({ chat_enabled: data?.chat_enabled !== false })
  } catch (err) {
    console.error('GET /community/preferences:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/community/preferences
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const chatEnabled = Boolean(body?.chat_enabled)

    const { error } = await supabase
      .from('profiles')
      .update({ chat_enabled: chatEnabled })
      .eq('id', user.id)

    if (error) {
      console.error('Update preferences error:', error)
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('POST /community/preferences:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
