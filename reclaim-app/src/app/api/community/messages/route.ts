import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/messages?conversation_id=<uuid>&limit=50&before=<timestamp>
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)
    const before = searchParams.get('before')

    if (!conversationId) return NextResponse.json({ error: 'conversation_id required' }, { status: 400 })

    let query = supabase
      .from('community_messages')
      .select('id, content, sender_id, created_at, edited_at, profiles(id, email)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (before) query = query.lt('created_at', before)

    const { data, error } = await query

    if (error) {
      console.error('List messages error:', error)
      return NextResponse.json({ error: 'Failed to list messages' }, { status: 500 })
    }

    return NextResponse.json({ items: data || [] })
  } catch (err) {
    console.error('GET /community/messages:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/community/messages
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const conversationId = body?.conversation_id
    const content = String(body?.content || '').trim()

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'conversation_id and content required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('community_messages')
      .insert({ conversation_id: conversationId, sender_id: user.id, content })
      .select('id, content, sender_id, created_at')
      .single()

    if (error) {
      console.error('Create message error:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/messages:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
