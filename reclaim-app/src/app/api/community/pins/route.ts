import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/pins — list user's pinned messages
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('room_id')
    const conversationId = searchParams.get('conversation_id')

    let query = supabase
      .from('pinned_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('pinned_at', { ascending: false })

    if (roomId) query = query.eq('room_id', roomId)
    if (conversationId) query = query.eq('conversation_id', conversationId)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (err) {
    console.error('GET /community/pins:', err)
    return NextResponse.json({ error: 'Failed to load pins' }, { status: 500 })
  }
}

// POST /api/community/pins — pin a message
// body: { content: string, room_id?: string, conversation_id?: string, original_message_id?: string, author_name?: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const content = String(body?.content || '').trim()
    const room_id = body?.room_id || null
    const conversation_id = body?.conversation_id || null
    const original_message_id = body?.original_message_id || null
    const author_name = body?.author_name || null

    if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 })

    const { data, error } = await supabase
      .from('pinned_messages')
      .insert({
        user_id: user.id,
        room_id,
        conversation_id,
        original_message_id,
        content,
        author_name,
      })
      .select()
      .single()

    if (error) throw error

    // Notify the original message author if pinning in a room (fire-and-forget)
    if (room_id && original_message_id && data) {
      try {
        const { data: origMsg } = await supabase
          .from('community_room_messages')
          .select('user_id')
          .eq('id', original_message_id)
          .maybeSingle()

        if (origMsg && origMsg.user_id !== user.id) {
          const { data: room } = await supabase
            .from('community_chat_rooms')
            .select('name')
            .eq('id', room_id)
            .maybeSingle()

          if (room) {
            const pinnerName = user.user_metadata?.display_name || user.user_metadata?.first_name || 'Someone'
            const { notifyMessagePinned } = await import('@/lib/notifications')
            notifyMessagePinned(origMsg.user_id, room.name || 'your group', pinnerName).catch(() => {})
          }
        }
      } catch {}
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/pins:', err)
    return NextResponse.json({ error: 'Failed to pin message' }, { status: 500 })
  }
}

// DELETE /api/community/pins?id=<uuid>
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const { error } = await supabase
      .from('pinned_messages')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /community/pins:', err)
    return NextResponse.json({ error: 'Failed to unpin' }, { status: 500 })
  }
}
