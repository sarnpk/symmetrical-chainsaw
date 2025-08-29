import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/ai/thread-messages?conversation_id=...&limit=30&cursor=<iso>
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')
    const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100)
    const cursor = searchParams.get('cursor') // ISO created_at for pagination

    if (!conversationId) {
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })
    }

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify ownership of conversation
    const { data: conv, error: convErr } = await supabase
      .from('ai_conversations')
      .select('id, user_id')
      .eq('id', conversationId)
      .single()
    if (convErr || !conv || conv.user_id !== user.id) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    let query = supabase
      .from('ai_messages')
      .select('id, role, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data: items, error } = await query
    if (error) {
      console.error('thread-messages list error:', error)
      return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
    }

    const nextCursor = items && items.length === limit ? items[items.length - 1].created_at : null

    return NextResponse.json({ items, next_cursor: nextCursor })
  } catch (e: any) {
    console.error('thread-messages route error:', e)
    return NextResponse.json({ error: 'Unexpected error', message: e?.message || 'Unknown' }, { status: 500 })
  }
}
