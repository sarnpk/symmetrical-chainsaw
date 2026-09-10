import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// POST /api/community/room-participants - Join room
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { room_id } = body

    if (!room_id) {
      return NextResponse.json({ error: 'room_id required' }, { status: 400 })
    }

    // Check room capacity
    const { data: room } = await supabase
      .from('community_chat_rooms')
      .select('max_participants')
      .eq('id', room_id)
      .single()

    if (room) {
      const { count } = await supabase
        .from('community_room_participants')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', room_id)

      if (count && count >= room.max_participants) {
        return NextResponse.json({ error: 'Room is full' }, { status: 403 })
      }
    }

    const { error } = await supabase
      .from('community_room_participants')
      .insert({ room_id, user_id: user.id })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ ok: true })
      }
      throw error
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('POST /community/room-participants error:', err)
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 })
  }
}

// DELETE /api/community/room-participants?room_id=<uuid> - Leave room
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const room_id = searchParams.get('room_id')

    if (!room_id) {
      return NextResponse.json({ error: 'room_id required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('community_room_participants')
      .delete()
      .eq('room_id', room_id)
      .eq('user_id', user.id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /community/room-participants error:', err)
    return NextResponse.json({ error: 'Failed to leave room' }, { status: 500 })
  }
}
