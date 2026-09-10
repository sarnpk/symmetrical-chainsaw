import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return { error: 'Missing Supabase env', client: null as any }
  return { error: null as string | null, client: createClient(url, serviceKey) }
}

async function checkAdminAccess(token: string) {
  const { client: supabase } = getServerSupabase()
  const { data: auth } = await supabase.auth.getUser(token)
  if (!auth?.user) return false

  const { data: admin } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', auth.user.id)
    .eq('is_active', true)
    .single()

  return admin?.role === 'super_admin'
}

export async function GET(req: Request) {
  const { client: supabase, error } = getServerSupabase()
  if (error) return NextResponse.json({ error }, { status: 500 })

  const authHeader = req.headers.get('authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = authHeader.replace('Bearer ', '')
  const isAdmin = await checkAdminAccess(token)
  if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  try {
    // Get all users from profiles table (which are linked to auth.users)
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, display_name, subscription_tier, created_at, updated_at, is_active, timezone')
      .order('created_at', { ascending: false })

    if (usersError) throw usersError

    // Get feedback separately and join with profiles manually
    const { data: feedback, error: feedbackError } = await supabase
      .from('user_feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (feedbackError) throw feedbackError

    // Get payments with user emails
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (paymentsError) throw paymentsError

    // Get user emails for feedback
    let feedbackWithEmails = feedback || []
    if (feedback && feedback.length > 0) {
      const userIds = [...new Set(feedback.map(f => f.user_id))]
      const { data: feedbackUsers } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds)
      
      feedbackWithEmails = feedback.map(f => ({
        ...f,
        user_email: feedbackUsers?.find(u => u.id === f.user_id)?.email || 'Unknown'
      }))
    }

    // Get user emails for payments
    let paymentsWithEmails = payments || []
    if (payments && payments.length > 0) {
      const paymentUserIds = [...new Set(payments.map(p => p.user_id))]
      const { data: paymentUsers } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', paymentUserIds)
      
      paymentsWithEmails = payments.map(p => ({
        ...p,
        user_email: paymentUsers?.find(u => u.id === p.user_id)?.email || 'Unknown'
      }))
    }

    // Calculate stats
    const totalUsers = users?.length || 0
    const activeUsers = users?.filter(u => u.is_active).length || 0
    const foundationUsers = users?.filter(u => u.subscription_tier === 'foundation').length || 0
    const recoveryUsers = users?.filter(u => u.subscription_tier === 'recovery').length || 0
    const empowermentUsers = users?.filter(u => u.subscription_tier === 'empowerment').length || 0
    const totalFeedback = feedbackWithEmails?.length || 0
    const avgRating = feedbackWithEmails?.length ? 
      feedbackWithEmails.reduce((sum, f) => sum + f.rating, 0) / feedbackWithEmails.length : 0

    const stats = {
      total_users: totalUsers,
      active_users: activeUsers,
      foundation_users: foundationUsers,
      recovery_users: recoveryUsers,
      empowerment_users: empowermentUsers,
      total_feedback: totalFeedback,
      avg_rating: Math.round(avgRating * 10) / 10
    }

    console.log('API Response:', { 
      usersCount: users?.length, 
      feedbackCount: feedback?.length,
      stats 
    })

    return NextResponse.json({ 
      users: users || [], 
      feedback: feedbackWithEmails || [],
      payments: paymentsWithEmails || [],
      stats 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const { client: supabase, error } = getServerSupabase()
  if (error) return NextResponse.json({ error }, { status: 500 })

  const authHeader = req.headers.get('authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = authHeader.replace('Bearer ', '')
  const isAdmin = await checkAdminAccess(token)
  if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  try {
    const { userId, updates } = await req.json()
    
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (userError) throw userError

    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}