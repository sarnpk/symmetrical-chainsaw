import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/blocks
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('community_blocks')
      .select('blocked_id, created_at, profiles(id, email)')
      .eq('blocker_id', user.id)

    if (error) {
      console.error('List blocks error:', error)
      return NextResponse.json({ error: 'Failed to list blocks' }, { status: 500 })
    }

    return NextResponse.json({ items: data || [] })
  } catch (err) {
    console.error('GET /community/blocks:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/community/blocks
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const blockedId = body?.blocked_id

    if (!blockedId) return NextResponse.json({ error: 'blocked_id required' }, { status: 400 })

    const { error } = await supabase
      .from('community_blocks')
      .insert({ blocker_id: user.id, blocked_id: blockedId })

    if (error) {
      console.error('Block user error:', error)
      return NextResponse.json({ error: 'Failed to block user' }, { status: 500 })
    }

    return new NextResponse(null, { status: 201 })
  } catch (err) {
    console.error('POST /community/blocks:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// DELETE /api/community/blocks?blocked_id=<uuid>
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const blockedId = searchParams.get('blocked_id')

    if (!blockedId) return NextResponse.json({ error: 'blocked_id required' }, { status: 400 })

    const { error } = await supabase
      .from('community_blocks')
      .delete()
      .eq('blocker_id', user.id)
      .eq('blocked_id', blockedId)

    if (error) {
      console.error('Unblock user error:', error)
      return NextResponse.json({ error: 'Failed to unblock user' }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /community/blocks:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
