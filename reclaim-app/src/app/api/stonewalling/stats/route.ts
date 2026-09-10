import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: incidents } = await supabase
      .from('stonewalling_incidents')
      .select('*')
      .eq('user_id', user.id)

    if (error || !incidents || incidents.length === 0) {
      return NextResponse.json({ total_incidents: 0 })
    }

    const stats = {
      total_incidents: incidents.length,
      avg_duration: Math.round(
        incidents.filter(i => i.duration_minutes).reduce((sum, i) => sum + i.duration_minutes, 0) / 
        incidents.filter(i => i.duration_minutes).length
      ) || 0,
      most_common_type: incidents.reduce((acc, i) => {
        acc[i.shutdown_type] = (acc[i.shutdown_type] || 0) + 1
        return acc
      }, {} as any),
      escalation_trend: 'stable'
    }

    stats.most_common_type = Object.entries(stats.most_common_type)
      .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0]

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Stonewalling stats error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
