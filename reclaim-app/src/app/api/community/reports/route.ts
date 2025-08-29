import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// POST /api/community/reports
// body: { target_type: 'post'|'comment'|'user', target_id: string, reason: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const target_type = String(body?.target_type || '') as 'post'|'comment'|'user'
    const target_id = String(body?.target_id || '')
    const reason = String(body?.reason || '').trim()

    if (!target_type || !target_id || !reason) {
      return NextResponse.json({ error: 'target_type, target_id, and reason are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('community_reports')
      .insert({ target_type, target_id, reason, reporter_id: user.id })
      .select('*')
      .single()

    if (error) {
      console.error('Create report error:', error)
      return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/reports exception:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
