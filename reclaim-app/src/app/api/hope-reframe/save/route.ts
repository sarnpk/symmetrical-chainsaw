import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
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
    const { input, reframe, mantra } = body

    if (!input || !reframe) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const journalContent = `**Original Thought:**\n${input}\n\n**Hope-Focused Reframe:**\n${reframe}\n\n**Mantra:**\n${mantra || 'You are stronger than you know.'}`

    const { error: insertError } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        title: 'Hope Reframe',
        content: journalContent,
        emotional_state: 'hopeful',
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json({ error: 'Failed to save to journal' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json(
      { error: 'Failed to save' },
      { status: 500 }
    )
  }
}
