import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('plan_tier, display_name, description, price_monthly, price_yearly')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Error fetching subscription plans:', error)
      return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
    }

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Subscription plans API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}