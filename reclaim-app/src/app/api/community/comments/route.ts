import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/community/comments?post_id=<uuid>&limit=50&cursor=<created_at_iso>
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('post_id')
    if (!postId) {
      return NextResponse.json({ error: 'post_id is required' }, { status: 400 })
    }
    // Optional: return only count
    if (searchParams.get('count') === '1') {
      const { count, error: countErr } = await supabase
        .from('community_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
      if (countErr) {
        console.error('Count comments error:', countErr)
        return NextResponse.json({ error: 'Failed to count comments' }, { status: 500 })
      }
      return NextResponse.json({ count: count ?? 0 })
    }
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)
    const cursor = searchParams.get('cursor')

    let query = supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }
    const { data, error } = await query
    if (error) {
      console.error('List comments error:', error)
      return NextResponse.json({ error: 'Failed to list comments' }, { status: 500 })
    }

    return NextResponse.json({ items: data ?? [] })
  } catch (err) {
    console.error('GET /community/comments exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/community/comments
// body: { post_id: string, content: string, parent_comment_id?: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const post_id = String(body?.post_id || '')
    const content = String(body?.content || '').trim()
    const parent_comment_id = body?.parent_comment_id ? String(body.parent_comment_id) : null

    if (!post_id || !content) {
      return NextResponse.json({ error: 'post_id and content are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('community_comments')
      .insert({ post_id, author_id: user.id, content, parent_comment_id })
      .select('*')
      .single()

    if (error) {
      console.error('Create comment error:', error)
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/comments exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// PATCH /api/community/comments
// body: { id: string, content: string }
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const id = String(body?.id || '')
    const content = String(body?.content || '').trim()
    if (!id || !content) {
      return NextResponse.json({ error: 'id and content are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('community_comments')
      .update({ content })
      .eq('id', id)
      .eq('author_id', user.id)
      .select('*')
      .single()

    if (error) {
      console.error('Update comment error:', error)
      return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
    }

    return NextResponse.json({ item: data })
  } catch (err) {
    console.error('PATCH /community/comments exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// DELETE /api/community/comments?id=<uuid>
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id)

    if (error) {
      console.error('Delete comment error:', error)
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /community/comments exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
