import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function checkAndRecordAIUsage(featureType: string) {
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  // Check usage limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single()

  const tier = profile?.subscription_tier || 'foundation'
  const limits = { foundation: 5, recovery: 200, empowerment:500 }
  const monthlyLimit = limits[tier as keyof typeof limits]

  if (monthlyLimit !== -1) {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('usage_tracking')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('feature_name', 'ai_interactions')
      .gte('created_at', startOfMonth.toISOString())

    if (count && count >= monthlyLimit) {
      return { error: 'Monthly AI interaction limit reached', limit: monthlyLimit, status: 429 }
    }
  }

  // Record usage
  await supabase.from('usage_tracking').insert({
    user_id: user.id,
    feature_name: 'ai_interactions',
    usage_type: 'api_call',
    usage_count: 1,
    usage_metadata: { feature: 'narcissist_detector', type: featureType },
    billing_period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    billing_period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
  })

  return { user, supabase }
}

// Generic usage tracking function
export async function trackUsage(userId: string, featureName: string) {
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

  // Get user's subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single()

  const tier = profile?.subscription_tier || 'foundation'

  // Define limits per feature
  const featureLimits: Record<string, Record<string, number>> = {
    crisis_reframe: { foundation: 3, recovery: 10, empowerment: -1 },
    ai_coach: { foundation: 5, recovery: 200, empowerment: -1 },
    narcissist_detector: { foundation: 5, recovery: 200, empowerment: -1 }
  }

  const limits = featureLimits[featureName] || { foundation: 5, recovery: 200, empowerment: -1 }
  const monthlyLimit = limits[tier as keyof typeof limits]

  // Check current usage
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('usage_tracking')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('feature_name', featureName)
    .gte('created_at', startOfMonth.toISOString())

  const currentUsage = count || 0
  const remaining = monthlyLimit === -1 ? -1 : Math.max(0, monthlyLimit - currentUsage)

  if (monthlyLimit !== -1 && currentUsage >= monthlyLimit) {
    return {
      allowed: false,
      usage_info: {
        subscription_tier: tier,
        monthly_limit: monthlyLimit,
        remaining: 0
      },
      upgrade_required: tier === 'foundation' ? 'recovery' : 'empowerment'
    }
  }

  // Record usage
  await supabase.from('usage_tracking').insert({
    user_id: userId,
    feature_name: featureName,
    usage_type: 'api_call',
    usage_count: 1,
    usage_metadata: { feature: featureName },
    billing_period_start: startOfMonth.toISOString(),
    billing_period_end: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).toISOString()
  })

  return {
    allowed: true,
    usage_info: {
      subscription_tier: tier,
      monthly_limit: monthlyLimit,
      remaining: monthlyLimit === -1 ? -1 : remaining - 1
    }
  }
}
