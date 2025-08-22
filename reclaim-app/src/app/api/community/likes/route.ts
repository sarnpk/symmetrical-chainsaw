import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/community/likes?post_id=<uuid>
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('post_id')
    if (!postId) return NextResponse.json({ error: 'post_id is required' }, { status: 400 })

    // Count total likes
    const { count, error: countErr } = await supabase
      .from('community_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    if (countErr) {
      console.error('Count likes error:', countErr)
      return NextResponse.json({ error: 'Failed to load likes' }, { status: 500 })
    }

    // Whether current user liked
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    let liked = false
    if (user) {
      const { data: likeRow, error: likedErr } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()
      if (likedErr) {
        console.error('Liked check error:', likedErr)
      }
      liked = !!likeRow
    }

    return NextResponse.json({ count: count ?? 0, liked })
  } catch (err) {
    console.error('GET /community/likes exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST /api/community/likes  body: { post_id: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const post_id = String(body?.post_id || '')
    if (!post_id) return NextResponse.json({ error: 'post_id is required' }, { status: 400 })

    const { error } = await supabase
      .from('community_likes')
      .insert({ post_id, user_id: user.id })

    if (error) {
      // ignore duplicate like attempts gracefully
      if (error.code === '23505') {
        return NextResponse.json({ ok: true }, { status: 200 })
      }
      console.error('Like post error:', error)
      return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('POST /community/likes exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// DELETE /api/community/likes  body: { post_id: string }
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const post_id = String(body?.post_id || '')
    if (!post_id) return NextResponse.json({ error: 'post_id is required' }, { status: 400 })

    const { error } = await supabase
      .from('community_likes')
      .delete()
      .eq('post_id', post_id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Unlike post error:', error)
      return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /community/likes exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
