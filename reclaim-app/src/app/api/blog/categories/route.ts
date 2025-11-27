import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('id, name, slug, color')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Error fetching blog categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Blog categories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}