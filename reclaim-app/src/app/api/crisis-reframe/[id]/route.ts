import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { action, ...updateData } = body

    if (action === 'revisit') {
      // Increment revisit counter - first fetch current value
      const { data: current } = await supabase
        .from('crisis_reframes')
        .select('revisited_count')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      const { data, error } = await supabase
        .from('crisis_reframes')
        .update({
          revisited_count: (current?.revisited_count || 0) + 1,
          last_revisited_at: new Date().toISOString()
        })
        .eq('id', params.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
      }

      return NextResponse.json({ success: true, data })
    }

    if (action === 'rate') {
      // Update rating
      const { data, error } = await supabase
        .from('crisis_reframes')
        .update({ helpful_rating: updateData.rating })
        .eq('id', params.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: 'Failed to rate' }, { status: 500 })
      }

      return NextResponse.json({ success: true, data })
    }

    if (action === 'update_control') {
      // Update control tracking
      const { data, error } = await supabase
        .from('crisis_reframes')
        .update({
          control_checklist: updateData.checklist,
          survived_duration: updateData.survived_duration,
          prevented_contact: updateData.prevented_contact
        })
        .eq('id', params.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
      }

      return NextResponse.json({ success: true, data })
    }

    // General update
    const { data, error } = await supabase
      .from('crisis_reframes')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabase
      .from('crisis_reframes')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
