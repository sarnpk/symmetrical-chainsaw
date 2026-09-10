import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/room-messages?room_id=<uuid>&limit=50&cursor=<created_at>
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('room_id')
    
    if (!roomId) {
      return NextResponse.json({ error: 'room_id required' }, { status: 400 })
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)
    const cursor = searchParams.get('cursor')

    let query = supabase
      .from('community_room_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ messages: data || [] })
  } catch (err) {
    console.error('GET /community/room-messages error:', err)
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  }
}

// POST /api/community/room-messages - Send message
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { room_id, content, is_anonymous = true } = body

    if (!room_id || !content?.trim()) {
      return NextResponse.json({ error: 'room_id and content required' }, { status: 400 })
    }

    // Check if user is participant
    const { data: participant } = await supabase
      .from('community_room_participants')
      .select('*')
      .eq('room_id', room_id)
      .eq('user_id', user.id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: 'Must join room first' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('community_room_messages')
      .insert({
        room_id,
        user_id: user.id,
        content: content.trim(),
        is_anonymous
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/room-messages error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// DELETE /api/community/room-messages?id=<uuid>
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('community_room_messages')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /community/room-messages error:', err)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
