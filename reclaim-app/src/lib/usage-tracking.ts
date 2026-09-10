import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function checkAndRecordAIUsage(featureName: string, featureType?: string) {
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

  // Check usage limits using database-driven limits
  const { data: allowed, error: limitError } = await supabase.rpc('check_feature_limit', {
    p_user_id: user.id,
    p_feature_name: featureName,
    p_limit_type: 'monthly_count'
  })

  if (limitError) {
    console.error('Error checking feature limit:', limitError)
    return { error: 'Failed to check usage limits', status: 500 }
  }

  if (allowed === false) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    const tier = profile?.subscription_tier || 'foundation'
    return { 
      error: `Monthly ${featureName} limit reached`, 
      upgrade_required: tier === 'foundation' ? 'recovery' : 'empowerment',
      status: 429 
    }
  }

  // Record usage
  await supabase.rpc('record_feature_usage', {
    p_user_id: user.id,
    p_feature_name: featureName,
    p_usage_type: 'monthly_count',
    p_usage_count: 1,
    p_metadata: { feature: featureName, type: featureType || 'default' }
  })

  return { user, supabase }
}

// Generic usage tracking function using database-driven limits
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

  // Check usage limits using database-driven limits
  const { data: allowed, error: limitError } = await supabase.rpc('check_feature_limit', {
    p_user_id: userId,
    p_feature_name: featureName,
    p_limit_type: 'monthly_count'
  })

  if (limitError) {
    console.error('Error checking feature limit:', limitError)
    return {
      allowed: false,
      error: 'Failed to check usage limits'
    }
  }

  if (allowed === false) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()
    const tier = profile?.subscription_tier || 'foundation'
    return {
      allowed: false,
      upgrade_required: tier === 'foundation' ? 'recovery' : 'empowerment'
    }
  }

  // Record usage
  await supabase.rpc('record_feature_usage', {
    p_user_id: userId,
    p_feature_name: featureName,
    p_usage_type: 'monthly_count',
    p_usage_count: 1,
    p_metadata: { feature: featureName }
  })

  return {
    allowed: true
  }
}
