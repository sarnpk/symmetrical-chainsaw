import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { data, error } = await supabase
      .from('profiles')
      .select('ui_preferences')
      .eq('id', user.id)
      .single()

    if (error) return NextResponse.json({ error: 'Failed to load preferences' }, { status: 500 })

    const prefs = (data as any)?.ui_preferences || {}
    return NextResponse.json({ prefs: prefs?.affirmations || {} })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', message: e?.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')
    const body = await req.json().catch(() => ({}))

    const { playlist_id, affirmation_index, auto_play } = body || {}

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // Merge into profiles.ui_preferences.affirmations
    const { data: current } = await supabase
      .from('profiles')
      .select('ui_preferences')
      .eq('id', user.id)
      .single()

    const ui = (current as any)?.ui_preferences || {}
    ui.affirmations = {
      ...(ui.affirmations || {}),
      ...(playlist_id !== undefined ? { playlist_id } : {}),
      ...(affirmation_index !== undefined ? { affirmation_index } : {}),
      ...(auto_play !== undefined ? { auto_play: !!auto_play } : {}),
    }

    const { error: updErr } = await supabase
      .from('profiles')
      .update({ ui_preferences: ui })
      .eq('id', user.id)

    if (updErr) return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', message: e?.message }, { status: 500 })
  }
}
