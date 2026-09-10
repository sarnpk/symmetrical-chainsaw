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
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('sort_order')

    if (plansError) throw plansError

    return NextResponse.json({ plans })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}