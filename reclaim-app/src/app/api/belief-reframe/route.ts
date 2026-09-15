import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

function createSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )
}

async function requireTier(supabase: any, minTier: string = 'recovery') {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single()
  const tierRank: Record<string, number> = { foundation: 0, recovery: 1, empowerment: 2 }
  if (!profile || (tierRank[profile.subscription_tier] || 0) < (tierRank[minTier] || 0)) {
    return { error: NextResponse.json({ error: 'Upgrade required', requiredTier: minTier }, { status: 403 }) }
  }
  return { user }
}

export async function GET() {
  const supabase = createSupabase()
  const auth = await requireTier(supabase)
  if (auth.error) return auth.error

  const { data: beliefs, error } = await supabase
    .from('false_beliefs')
    .select(`
      *,
      counter_evidence(count),
      belief_strength_log(strength, logged_at)
    `)
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ beliefs })
}

export async function POST(request: Request) {
  const supabase = createSupabase()
  const auth = await requireTier(supabase)
  if (auth.error) return auth.error

  const body = await request.json()
  const { belief_text, belief_category, current_strength, origin_journal_entry_id, origin_memory_text } = body

  const { data: belief, error } = await supabase
    .from('false_beliefs')
    .insert({
      user_id: auth.user.id,
      belief_text,
      belief_category,
      current_strength,
      initial_strength: current_strength,
      origin_journal_entry_id,
      origin_memory_text
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ belief })
}
