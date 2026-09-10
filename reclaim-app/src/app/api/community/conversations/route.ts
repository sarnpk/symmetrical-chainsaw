import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/conversations
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: participants } = await supabase
      .from('community_conversation_participants')
      .select('conversation_id, last_read_at')
      .eq('user_id', user.id)

    const convIds = participants?.map(p => p.conversation_id) || []
    if (convIds.length === 0) return NextResponse.json({ items: [] })

    const { data: allParticipants } = await supabase
      .from('community_conversation_participants')
      .select('conversation_id, user_id, profiles(id, email)')
      .in('conversation_id', convIds)

    const conversations = await Promise.all(
      convIds.map(async (convId) => {
        const { data: lastMsg } = await supabase
          .from('community_messages')
          .select('content, created_at, sender_id')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        const otherParticipant = allParticipants?.find(
          p => p.conversation_id === convId && p.user_id !== user.id
        )
        const myParticipant = participants?.find(p => p.conversation_id === convId)

        return {
          id: convId,
          other_user: otherParticipant?.profiles || null,
          last_message: lastMsg || null,
          last_read_at: myParticipant?.last_read_at || null
        }
      })
    )

    return NextResponse.json({ items: conversations })
  } catch (err) {
    console.error('GET /community/conversations:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/community/conversations - create conversation with user
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const otherUserId = body?.other_user_id

    if (!otherUserId) return NextResponse.json({ error: 'other_user_id required' }, { status: 400 })

    const { data, error } = await supabase.rpc('get_or_create_conversation', {
      other_user_id: otherUserId
    })

    if (error) {
      console.error('Create conversation error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create conversation' }, { status: 500 })
    }

    return NextResponse.json({ conversation_id: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/conversations:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
