import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/me -> { id, email }
export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: authRes } = await supabase.auth.getUser()
    const user = authRes?.user
    if (!user) return NextResponse.json({ id: null, email: null }, { status: 200 })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (e) {
    return NextResponse.json({ id: null, email: null }, { status: 200 })
  }
}
