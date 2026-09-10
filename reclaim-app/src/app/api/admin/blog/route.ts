import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug),
        tags:blog_post_tags(tag:blog_tags(id, name, slug))
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const transformedPosts = posts?.map(post => ({
      ...post,
      tags: post.tags?.map((t: any) => t.tag) || []
    }))

    return NextResponse.json({ posts: transformedPosts })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { post, tagIds } = body

    const { data: newPost, error: postError } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single()

    if (postError) throw postError

    if (tagIds && tagIds.length > 0) {
      const tagRelations = tagIds.map((tagId: string) => ({
        post_id: newPost.id,
        tag_id: tagId
      }))

      const { error: tagError } = await supabase
        .from('blog_post_tags')
        .insert(tagRelations)

      if (tagError) throw tagError
    }

    return NextResponse.json({ post: newPost })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, post, tagIds } = body

    const { data: updatedPost, error: postError } = await supabase
      .from('blog_posts')
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (postError) throw postError

    if (tagIds !== undefined) {
      await supabase.from('blog_post_tags').delete().eq('post_id', id)

      if (tagIds.length > 0) {
        const tagRelations = tagIds.map((tagId: string) => ({
          post_id: id,
          tag_id: tagId
        }))

        const { error: tagError } = await supabase
          .from('blog_post_tags')
          .insert(tagRelations)

        if (tagError) throw tagError
      }
    }

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
