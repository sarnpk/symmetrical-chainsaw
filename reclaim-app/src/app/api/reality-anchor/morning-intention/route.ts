import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Morning intention GET request received')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    console.log('User ID:', userId)

    if (!userId) {
      console.log('No userId provided')
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Get today's intention
    const { data: intention, error: intentionError } = await supabase
      .from('morning_intentions')
      .select('*, affirmations(*)')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (intentionError && intentionError.code !== 'PGRST116') {
      console.error('Intention error:', intentionError)
      return NextResponse.json({ error: intentionError.message }, { status: 500 })
    }

    // If no intention exists, get a personalized affirmation
    if (!intention) {
      console.log('No intention found, fetching personalized affirmation')
      
      // Get user preferences and profile
      const { data: preferences } = await supabase
        .from('affirmation_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      const { data: profile } = await supabase
        .from('profiles')
        .select('has_children')
        .eq('id', userId)
        .single()

      let affirmationQuery = supabase
        .from('affirmations')
        .select('*')
        .eq('category', 'morning')
        .eq('is_default', true)

      // Prioritize parent-focused affirmations if user has children
      if (preferences?.has_children || profile?.has_children) {
        affirmationQuery = affirmationQuery.eq('is_parent_focused', true)
      }

      const { data: affirmation, error: affError } = await affirmationQuery.limit(10)

      if (affError) {
        console.error('Affirmation error:', affError)
        // If no affirmations found, return a default one
        return NextResponse.json({
          intention: null,
          suggestedAffirmation: {
            id: 'default',
            text: 'Today I choose peace and clarity',
            category: 'morning'
          },
        })
      }

      // Get random affirmation from results or use default
      const affirmations = Array.isArray(affirmation) ? affirmation : [affirmation]
      const selectedAffirmation = affirmations?.[Math.floor(Math.random() * affirmations.length)]
      
      return NextResponse.json({
        intention: null,
        suggestedAffirmation: selectedAffirmation || {
          id: 'default',
          text: 'Today I choose peace and clarity',
          category: 'morning'
        },
      })
    }

    return NextResponse.json({ intention })
  } catch (error) {
    console.error('GET morning intention error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch morning intention' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const body = await request.json()
    const { affirmation_id, user_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('morning_intentions')
      .upsert({
        user_id,
        date: today,
        affirmation_id,
      })
      .select('*, affirmations(*)')
      .single()

    if (error) {
      console.error('POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ intention: data })
  } catch (error) {
    console.error('POST morning intention error:', error)
    return NextResponse.json(
      { error: 'Failed to create morning intention' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('morning_intentions')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)
      .eq('date', today)
      .select('*, affirmations(*)')
      .single()

    if (error) {
      console.error('PUT error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update streak
    await updateStreak(supabase, user_id, 'morning_intention')

    return NextResponse.json({ intention: data })
  } catch (error) {
    console.error('PUT morning intention error:', error)
    return NextResponse.json(
      { error: 'Failed to complete morning intention' },
      { status: 500 }
    )
  }
}

async function updateStreak(supabase: any, userId: string, routineType: string) {
  const today = new Date().toISOString().split('T')[0]

  const { data: streak } = await supabase
    .from('routine_streaks')
    .select('*')
    .eq('user_id', userId)
    .eq('routine_type', routineType)
    .single()

  if (!streak) {
    await supabase.from('routine_streaks').insert({
      user_id: userId,
      routine_type: routineType,
      current_streak: 1,
      longest_streak: 1,
      last_completed_date: today,
    })
    return
  }

  const lastDate = new Date(streak.last_completed_date)
  const todayDate = new Date(today)
  const daysDiff = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  let newStreak = streak.current_streak
  if (daysDiff === 1) {
    newStreak = streak.current_streak + 1
  } else if (daysDiff > 1) {
    newStreak = 1
  }

  const longestStreak = Math.max(newStreak, streak.longest_streak)

  await supabase
    .from('routine_streaks')
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_completed_date: today,
    })
    .eq('user_id', userId)
    .eq('routine_type', routineType)
}
