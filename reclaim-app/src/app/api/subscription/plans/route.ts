import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return { error: 'Missing Supabase env', client: null as any }
  return { error: null as string | null, client: createClient(url, serviceKey) }
}

export async function GET(req: Request) {
  const { client: supabase, error } = getServerSupabase()
  if (error) return NextResponse.json({ error }, { status: 500 })

  try {
    // Get subscription plans
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (plansError) {
      return NextResponse.json({ error: plansError.message }, { status: 500 })
    }

    // Get feature limits for each plan
    const { data: limits, error: limitsError } = await supabase
      .from('feature_limits')
      .select('*')
      .order('subscription_tier, feature_name')

    if (limitsError) {
      return NextResponse.json({ error: limitsError.message }, { status: 500 })
    }

    // Group limits by tier
    const limitsByTier = limits.reduce((acc: any, limit: any) => {
      if (!acc[limit.subscription_tier]) {
        acc[limit.subscription_tier] = {}
      }
      acc[limit.subscription_tier][limit.feature_name] = limit.limit_value
      return acc
    }, {})

    // Combine plans with their limits
    const plansWithLimits = plans.map(plan => ({
      ...plan,
      features: limitsByTier[plan.plan_tier] || {}
    }))

    return NextResponse.json({ 
      plans: plansWithLimits,
      success: true 
    })

  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}