import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { data, error } = await supabase
      .from('healing_resources')
      .select('id, title, content, created_at')
      .eq('user_id', user.id)
      .eq('resource_type', 'affirmation')
      .eq('is_favorite', true)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: 'Failed to load favorites' }, { status: 500 })
    return NextResponse.json({ favorites: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', message: e?.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')

    const body = await req.json().catch(() => ({}))
    const { title, content, favorite = true } = body || {}

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    if (!title || !content) return NextResponse.json({ error: 'title and content required' }, { status: 400 })

    // Find existing resource by exact title+content; if exists, update favorite flag; else insert
    const { data: existing } = await supabase
      .from('healing_resources')
      .select('id')
      .eq('user_id', user.id)
      .eq('resource_type', 'affirmation')
      .eq('title', title)
      .eq('content', content)
      .limit(1)

    if (existing && existing.length > 0) {
      const { error: updErr } = await supabase
        .from('healing_resources')
        .update({ is_favorite: !!favorite })
        .eq('id', existing[0].id)
      if (updErr) return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    const { error: insErr } = await supabase
      .from('healing_resources')
      .insert({
        user_id: user.id,
        resource_type: 'affirmation',
        title,
        content,
        is_favorite: !!favorite,
      })
    if (insErr) return NextResponse.json({ error: 'Failed to save favorite' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', message: e?.message }, { status: 500 })
  }
}
