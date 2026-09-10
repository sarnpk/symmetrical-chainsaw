import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        author_name,
        reading_time,
        view_count,
        published_at,
        category:blog_categories(name, slug, color),
        tags:blog_post_tags(tag:blog_tags(name, slug))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    // Transform the data to flatten tags
    const transformedPosts = posts?.map(post => ({
      ...post,
      tags: post.tags?.map((tagRelation: any) => tagRelation.tag) || []
    }))

    return NextResponse.json({ posts: transformedPosts })
  } catch (error) {
    console.error('Blog posts API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}