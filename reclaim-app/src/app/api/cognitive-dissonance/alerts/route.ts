import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: alerts } = await supabase
      .from('cognitive_dissonance_alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_dismissed', false)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })

    return NextResponse.json({ alerts: alerts || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, is_dismissed, is_resolved, user_notes } = await request.json()

    const { data, error } = await supabase
      .from('cognitive_dissonance_alerts')
      .update({
        is_dismissed,
        is_resolved,
        user_notes,
        resolved_at: is_resolved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ alert: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
