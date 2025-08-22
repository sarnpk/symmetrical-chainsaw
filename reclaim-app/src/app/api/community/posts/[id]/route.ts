import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/community/posts/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabase()
    const id = params?.id
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get post by id error:', error)
      return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ item: data })
  } catch (err) {
    console.error('GET /community/posts/[id] exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
