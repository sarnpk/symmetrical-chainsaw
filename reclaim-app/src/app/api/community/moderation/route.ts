import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return { error: 'Missing Supabase env', client: null as any }
  return { error: null as string | null, client: createClient(url, serviceKey) }
}

async function checkAdminAccess(token: string) {
  const { client: supabase } = getServerSupabase()
  const { data: auth } = await supabase.auth.getUser(token)
  if (!auth?.user) return { isAdmin: false, userId: null }

  const { data: admin } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', auth.user.id)
    .eq('is_active', true)
    .single()

  return { isAdmin: admin?.role === 'super_admin', userId: auth.user.id }
}

// GET /api/community/moderation — list reports
export async function GET(req: NextRequest) {
  try {
    const { client: supabase, error: envErr } = getServerSupabase()
    if (envErr) return NextResponse.json({ error: envErr }, { status: 500 })

    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { isAdmin } = await checkAdminAccess(token)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'pending'

    const { data, error } = await supabase
      .from('community_reports')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (err) {
    console.error('GET /community/moderation:', err)
    return NextResponse.json({ error: 'Failed to load reports' }, { status: 500 })
  }
}

// PATCH /api/community/moderation — update report status, ban user, delete content
export async function PATCH(req: NextRequest) {
  try {
    const { client: supabase, error: envErr } = getServerSupabase()
    if (envErr) return NextResponse.json({ error: envErr }, { status: 500 })

    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { isAdmin, userId } = await checkAdminAccess(token)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { report_id, status, ban_user, delete_content, target_user_id } = body

    if (report_id && status) {
      const { error } = await supabase
        .from('community_reports')
        .update({ status, reviewed_by: userId, reviewed_at: new Date().toISOString() })
        .eq('id', report_id)
      if (error) throw error
    }

    if (ban_user && target_user_id) {
      const { error } = await supabase
        .from('community_bans')
        .upsert({ user_id: target_user_id, banned_by: userId, reason: 'Community moderation' })
      if (error) throw error
    }

    if (delete_content) {
      const { report_id: rid } = body
      if (rid) {
        const { data: report } = await supabase
          .from('community_reports')
          .select('target_post_id, target_comment_id')
          .eq('id', rid)
          .single()

        if (report?.target_post_id) {
          await supabase.from('community_posts').delete().eq('id', report.target_post_id)
        }
        if (report?.target_comment_id) {
          await supabase.from('community_comments').delete().eq('id', report.target_comment_id)
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PATCH /community/moderation:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
