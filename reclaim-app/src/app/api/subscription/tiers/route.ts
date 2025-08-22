import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return { error: 'Missing Supabase env', client: null as any }
  return { error: null as string | null, client: createClient(url, serviceKey) }
}

const FEATURES = [
  // Core quotas
  { feature_name: 'ai_interactions', limit_type: 'monthly_count' }, // AI Coach
  { feature_name: 'transcription_minutes', limit_type: 'minutes' }, // Audio transcription minutes
  { feature_name: 'pattern_analysis', limit_type: 'monthly_count' }, // Patterns
  { feature_name: 'storage', limit_type: 'storage_mb' }, // Evidence storage (MB)

  // Additional feature gates (monthly_count unless specified otherwise)
  { feature_name: 'journal_entries', limit_type: 'monthly_count' },
  { feature_name: 'mind_reset_sessions', limit_type: 'monthly_count' },
  { feature_name: 'boundary_builder', limit_type: 'monthly_count' },
  { feature_name: 'grey_rock_messages', limit_type: 'monthly_count' },
  { feature_name: 'community_posts', limit_type: 'monthly_count' },
  { feature_name: 'wellness', limit_type: 'monthly_count' },
]

const TIERS = ['foundation', 'recovery', 'empowerment'] as const

type Tier = typeof TIERS[number]

export async function GET(req: Request) {
  const { client: supabase, error } = getServerSupabase()
  if (error) return NextResponse.json({ error }, { status: 500 })

  // Optional auth (keeps parity with other endpoints)
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!authHeader) return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
  const token = authHeader.replace('Bearer ', '')
  const { data: auth } = await supabase.auth.getUser(token)
  if (!auth?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  const byTier: Record<Tier, Record<string, number>> = {
    foundation: {},
    recovery: {},
    empowerment: {},
  }

  for (const tier of TIERS) {
    for (const f of FEATURES) {
      const { data } = await supabase
        .from('feature_limits')
        .select('limit_value')
        .eq('subscription_tier', tier)
        .eq('feature_name', f.feature_name)
        .eq('limit_type', f.limit_type)
        .single()
      const key = `${f.feature_name}:${f.limit_type}`
      ;(byTier as any)[tier][key] = typeof data?.limit_value === 'number' ? data!.limit_value : -1
    }
  }

  return NextResponse.json({ tiers: byTier })
}
