import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/ai/threads?limit=20&cursor=<iso>
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)
    const cursor = searchParams.get('cursor') // ISO string of updated_at to paginate

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    let query = supabase
      .from('ai_conversations')
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      // paginate: fetch items older than cursor
      query = query.lt('updated_at', cursor)
    }

    const { data: items, error } = await query
    if (error) {
      console.error('threads list error:', error)
      return NextResponse.json({ error: 'Failed to load threads' }, { status: 500 })
    }

    const nextCursor = items && items.length === limit ? items[items.length - 1].updated_at : null

    return NextResponse.json({ items, next_cursor: nextCursor })
  } catch (e: any) {
    console.error('threads route error:', e)
    return NextResponse.json({ error: 'Unexpected error', message: e?.message || 'Unknown' }, { status: 500 })
  }
}
