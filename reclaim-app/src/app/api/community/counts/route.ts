import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/counts?post_ids=uuid1,uuid2,uuid3
// Returns like/comment counts and current user's like status for all requested posts in a single query.
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(req.url)
    const raw = searchParams.get('post_ids')
    if (!raw) return NextResponse.json({ error: 'post_ids is required' }, { status: 400 })

    const ids = raw.split(',').map(s => s.trim()).filter(Boolean)
    if (ids.length === 0) return NextResponse.json({ error: 'No valid post_ids' }, { status: 400 })

    // Batch like counts
    const { data: likeRows, error: likeErr } = await supabase
      .from('community_likes')
      .select('post_id')
      .in('post_id', ids)

    if (likeErr) {
      console.error('Batch like count error:', likeErr)
      return NextResponse.json({ error: 'Failed to count likes' }, { status: 500 })
    }

    // Batch comment counts
    const { data: commentRows, error: commentErr } = await supabase
      .from('community_comments')
      .select('post_id')
      .in('post_id', ids)

    if (commentErr) {
      console.error('Batch comment count error:', commentErr)
      return NextResponse.json({ error: 'Failed to count comments' }, { status: 500 })
    }

    // Current user's liked posts
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    let userLiked = new Set<string>()
    if (user) {
      const { data: likedRows } = await supabase
        .from('community_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', ids)
      if (likedRows) likedRows.forEach(r => userLiked.add(r.post_id))
    }

    // Aggregate
    const likeCounts: Record<string, number> = {}
    const commentCounts: Record<string, number> = {}
    likeRows?.forEach(r => { likeCounts[r.post_id] = (likeCounts[r.post_id] || 0) + 1 })
    commentRows?.forEach(r => { commentCounts[r.post_id] = (commentCounts[r.post_id] || 0) + 1 })

    const result: Record<string, { likes: number; comments: number; liked: boolean }> = {}
    ids.forEach(id => {
      result[id] = {
        likes: likeCounts[id] || 0,
        comments: commentCounts[id] || 0,
        liked: userLiked.has(id),
      }
    })

    return NextResponse.json({ counts: result })
  } catch (err) {
    console.error('GET /community/counts exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
