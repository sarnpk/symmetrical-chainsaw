import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// POST /api/community/blocks — block a user
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const blocked_id = String(body?.blocked_id || '')
    if (!blocked_id) return NextResponse.json({ error: 'blocked_id is required' }, { status: 400 })
    if (blocked_id === user.id) return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 })

    const { data, error } = await supabase
      .from('community_blocks')
      .insert({ blocker_id: user.id, blocked_id })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, message: 'Already blocked' })
      }
      throw error
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/blocks:', err)
    return NextResponse.json({ error: 'Failed to block user' }, { status: 500 })
  }
}

// GET /api/community/blocks — list blocked users
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('community_blocks')
      .select('id, blocked_id, created_at')
      .eq('blocker_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (err) {
    console.error('GET /community/blocks:', err)
    return NextResponse.json({ error: 'Failed to load blocks' }, { status: 500 })
  }
}

// DELETE /api/community/blocks — unblock a user
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const blocked_id = String(body?.blocked_id || '')
    if (!blocked_id) return NextResponse.json({ error: 'blocked_id is required' }, { status: 400 })

    const { error } = await supabase
      .from('community_blocks')
      .delete()
      .eq('blocker_id', user.id)
      .eq('blocked_id', blocked_id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /community/blocks:', err)
    return NextResponse.json({ error: 'Failed to unblock' }, { status: 500 })
  }
}
