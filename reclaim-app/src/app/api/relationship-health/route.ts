import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, return a default health score
    // In the future, this would calculate based on journal entries and assessments
    return NextResponse.json({
      score: 50,
      trend: 'stable',
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching relationship health:', error)
    return NextResponse.json(
      { error: 'Failed to fetch relationship health' },
      { status: 500 }
    )
  }
}
