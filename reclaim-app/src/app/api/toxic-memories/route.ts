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

  const { data: memories } = await supabase
    .from('toxic_memories')
    .select('*')
    .eq('user_id', auth.user.id)
    .order('memory_date', { ascending: false })

  return NextResponse.json({ memories })
}

export async function POST(request: Request) {
  const supabase = createSupabase()
  const auth = await requireTier(supabase)
  if (auth.error) return auth.error

  const body = await request.json()
  const { memory_text, tags, memory_date, audio_url, video_url, image_urls, linked_belief_ids } = body

  const { data: memory, error } = await supabase
    .from('toxic_memories')
    .insert({
      user_id: auth.user.id,
      memory_text,
      tags: tags || [],
      memory_date: memory_date || new Date().toISOString().split('T')[0],
      audio_url: audio_url || null,
      video_url: video_url || null,
      image_urls: image_urls || [],
      linked_belief_ids: linked_belief_ids || []
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ memory })
}

export async function PUT(request: Request) {
  const supabase = createSupabase()
  const auth = await requireTier(supabase)
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const body = await request.json()
  const { memory_text, tags, memory_date, audio_url, video_url, image_urls, linked_belief_ids } = body

  const { data: memory, error } = await supabase
    .from('toxic_memories')
    .update({
      memory_text,
      tags: tags || [],
      memory_date: memory_date || new Date().toISOString().split('T')[0],
      audio_url: audio_url || null,
      video_url: video_url || null,
      image_urls: image_urls || [],
      linked_belief_ids: linked_belief_ids || []
    })
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ memory })
}

export async function DELETE(request: Request) {
  const supabase = createSupabase()
  const auth = await requireTier(supabase)
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const { error } = await supabase
    .from('toxic_memories')
    .delete()
    .eq('id', id)
    .eq('user_id', auth.user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
