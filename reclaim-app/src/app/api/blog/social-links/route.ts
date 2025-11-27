import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: links, error } = await supabase
      .from('social_media_links')
      .select('platform, url, icon')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Error fetching social media links:', error)
      return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 })
    }

    return NextResponse.json({ links })
  } catch (error) {
    console.error('Social links API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}