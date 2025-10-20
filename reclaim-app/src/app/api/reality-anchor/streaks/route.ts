import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { searchParams } = new URL(request.url)
    const routineType = searchParams.get('routineType') || 'morning_intention'
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('routine_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('routine_type', routineType)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Streaks error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ streak: data || null })
  } catch (error) {
    console.error('GET streaks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streak' },
      { status: 500 }
    )
  }
}
