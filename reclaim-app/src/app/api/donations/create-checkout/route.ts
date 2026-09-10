import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    console.log('Donation API called with amount:', amount)

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Ko-fi integration (simple redirect)
    // Change 'reclaim' to your actual Ko-fi username
    const kofiUrl = `https://ko-fi.com/reclaim?amount=${amount}`
    
    console.log('Redirecting to Ko-fi:', kofiUrl)
    
    // Optional: Log donation attempt to database
    try {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase.from('donations').insert({
          user_id: user.id,
          amount,
          status: 'pending',
          stripe_session_id: null,
        })
      }
    } catch (dbError) {
      console.error('Database logging failed:', dbError)
      // Continue anyway - don't block donation
    }

    return NextResponse.json({ 
      url: kofiUrl,
      message: 'Redirecting to Ko-fi...'
    })
  } catch (error: any) {
    console.error('Donation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
