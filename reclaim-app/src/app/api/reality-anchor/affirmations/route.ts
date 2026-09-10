import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('affirmations')
      .select('*')
      .eq('is_default', true)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('RANDOM()')

    if (error) {
      console.error('Affirmations error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ affirmations: data || [] })
  } catch (error) {
    console.error('Affirmations exception:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affirmations' },
      { status: 500 }
    )
  }
}
