import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    const supabase = await createServerSupabaseClient()

    // Get user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // Call the redeem function
    const { data, error } = await supabase.rpc('redeem_trial_code', {
      p_code: code,
      p_user_id: session.user.id,
      p_ip_address: ip,
      p_user_agent: userAgent
    })

    if (error) {
      console.error('Redeem code error:', error)
      return NextResponse.json({ error: 'Failed to redeem code' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Redeem API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json({ error: 'Code parameter required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Get user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate the code without redeeming
    const { data, error } = await supabase.rpc('validate_redeem_code', {
      p_code: code,
      p_user_id: session.user.id
    })

    if (error) {
      console.error('Validate code error:', error)
      return NextResponse.json({ error: 'Failed to validate code' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Validate API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}