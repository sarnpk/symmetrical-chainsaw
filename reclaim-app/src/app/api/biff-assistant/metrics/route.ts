import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const currentMonth = new Date().toISOString().slice(0, 7) + '-01'

    const { data: comms } = await supabase
      .from('coparent_communications')
      .select('biff_score, jade_detected, response_time_hours, avoided_engagement')
      .eq('user_id', user.id)
      .gte('created_at', currentMonth)

    const total = comms?.length || 0
    const successful = comms?.filter(c => c.avoided_engagement !== false).length || 0
    const jadeAvoided = comms?.filter(c => !c.jade_detected).length || 0
    const highScores = comms?.filter(c => c.biff_score >= 7).length || 0
    const avgTime = comms?.reduce((sum, c) => sum + (c.response_time_hours || 0), 0) / (total || 1)

    return NextResponse.json({
      total_communications: total,
      successful_disengagements: successful,
      jade_avoided: jadeAvoided,
      high_biff_scores: highScores,
      avg_response_time_hours: avgTime.toFixed(1),
      success_rate: total > 0 ? ((successful / total) * 100).toFixed(0) : 0
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
