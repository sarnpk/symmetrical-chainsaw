import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// POST /api/community/reports — report a post/user/comment
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { target_user_id, target_post_id, target_comment_id, target_message_id, reason, description } = body

    if (!reason) return NextResponse.json({ error: 'reason is required' }, { status: 400 })

    const { data, error } = await supabase
      .from('community_reports')
      .insert({
        reporter_id: user.id,
        target_user_id: target_user_id || null,
        target_post_id: target_post_id || null,
        target_comment_id: target_comment_id || null,
        target_message_id: target_message_id || null,
        reason,
        description: description || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/reports:', err)
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
  }
}

// GET /api/community/reports — list user's own reports
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('community_reports')
      .select('*')
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (err) {
    console.error('GET /community/reports:', err)
    return NextResponse.json({ error: 'Failed to load reports' }, { status: 500 })
  }
}
