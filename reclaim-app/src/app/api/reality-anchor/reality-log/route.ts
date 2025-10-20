import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    let query = supabase
      .from('reality_log_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (dateFrom) {
      query = query.gte('date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('date', dateTo)
    }

    const offset = (page - 1) * limit
    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error('Reality log error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      entries: data,
      total: count,
      page,
      limit,
    })
  } catch (error) {
    console.error('GET reality log error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reality log entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const body = await request.json()
    const { user_id, date, event, fact, npd_trait, is_consistent, pattern_note } = body

    if (!user_id || !date || !event || !fact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('reality_log_entries')
      .insert({
        user_id,
        date,
        event,
        fact,
        npd_trait,
        is_consistent,
        pattern_note,
      })
      .select()
      .single()

    if (error) {
      console.error('POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ entry: data }, { status: 201 })
  } catch (error) {
    console.error('POST reality log error:', error)
    return NextResponse.json(
      { error: 'Failed to create reality log entry' },
      { status: 500 }
    )
  }
}
