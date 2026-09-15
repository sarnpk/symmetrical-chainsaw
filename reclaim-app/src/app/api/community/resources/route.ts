import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

// GET /api/community/resources — public, returns active resources
export async function GET(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    if (!supabase) return NextResponse.json({ items: [] })

    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') === '1' // admin mode: return all

    let query = supabase
      .from('community_resources')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!all) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (err) {
    console.error('GET /community/resources:', err)
    return NextResponse.json({ items: [] })
  }
}

// POST /api/community/resources — admin create
export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    if (!supabase) return NextResponse.json({ error: 'Missing config' }, { status: 500 })

    const body = await req.json()
    const { title, description, link, category, icon, color, sort_order, is_active } = body

    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

    const { data, error } = await supabase
      .from('community_resources')
      .insert({ title, description, link, category: category || 'general', icon: icon || 'link', color: color || 'gray', sort_order: sort_order || 0, is_active: is_active !== false })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    console.error('POST /community/resources:', err)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

// PATCH /api/community/resources — admin update
export async function PATCH(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    if (!supabase) return NextResponse.json({ error: 'Missing config' }, { status: 500 })

    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    updates.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from('community_resources')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PATCH /community/resources:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE /api/community/resources?id=<uuid>
export async function DELETE(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    if (!supabase) return NextResponse.json({ error: 'Missing config' }, { status: 500 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const { error } = await supabase
      .from('community_resources')
      .delete()
      .eq('id', id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('DELETE /community/resources:', err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
