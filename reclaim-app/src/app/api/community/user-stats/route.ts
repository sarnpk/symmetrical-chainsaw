import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/user-stats - Get current user's stats and badges
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user stats
    const { data: stats } = await supabase
      .from('community_user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get earned badges
    const { data: earnedBadges } = await supabase
      .from('community_user_badges')
      .select('badge_id, earned_at, community_badges(*)')
      .eq('user_id', user.id)

    // Get all available badges
    const { data: allBadges } = await supabase
      .from('community_badges')
      .select('*')
      .order('points_required')

    return NextResponse.json({
      stats: stats || { level: 1, points: 0, posts_count: 0, comments_count: 0 },
      earned_badges: earnedBadges || [],
      all_badges: allBadges || []
    })
  } catch (err) {
    console.error('GET /community/user-stats error:', err)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
