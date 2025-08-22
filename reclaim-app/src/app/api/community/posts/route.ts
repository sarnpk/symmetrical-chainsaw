import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/community/posts?limit=20&cursor=<created_at_iso>&category=<text>&q=<search>
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { searchParams } = new URL(req.url)

    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)
    const cursor = searchParams.get('cursor') // ISO string of created_at for keyset pagination
    const category = searchParams.get('category') || undefined
    const q = searchParams.get('q') || undefined

    let query = supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      // keyset pagination: fetch records created before cursor
      query = query.lt('created_at', cursor)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (q) {
      // simple ILIKE match on title/content
      query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('List posts error:', error)
      return NextResponse.json({ error: 'Failed to list posts' }, { status: 500 })
    }

    return NextResponse.json({ items: data ?? [] })
  } catch (err) {
    console.error('GET /community/posts exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/community/posts
// body: { title: string, content: string, is_anonymous?: boolean, category?: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()

    // get user
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const title = String(body?.title || '').trim()
    const content = String(body?.content || '').trim()
    const is_anonymous = Boolean(body?.is_anonymous) || false
    const category = body?.category ? String(body.category).trim() : null

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert({ author_id: user.id, title, content, is_anonymous, category })
      .select('*')
      .single()

    if (error) {
      console.error('Create post error:', error)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/posts exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// DELETE /api/community/posts?id=<uuid>
// or body: { id: string }
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    let id: string | null = searchParams.get('id')
    if (!id) {
      try {
        const body = await req.json()
        id = body?.id ?? null
      } catch (_) {
        // ignore JSON parse errors
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id)

    if (error) {
      console.error('Delete post error:', error)
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /community/posts exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
