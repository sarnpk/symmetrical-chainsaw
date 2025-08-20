import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client; we still require a valid user token via Authorization
const supabaseSrv = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const { evidence_file_id, job_id } = await request.json().catch(() => ({})) as {
      evidence_file_id: string
      job_id?: string
    }

    if (!evidence_file_id) {
      return NextResponse.json({ error: 'evidence_file_id required' }, { status: 400 })
    }

    // Use a client with the user's Authorization header when invoking the Edge Function
    const supabaseWithUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data, error } = await supabaseWithUser.functions.invoke('transcribe-audio', {
      body: { evidence_file_id, job_id, check_status: true },
    })

    if (error) {
      const ctx: any = (error as any)?.context
      const status = ctx?.status || 500
      const statusText = ctx?.statusText || 'Functions error'
      let body: any = null
      try { if (ctx) body = await ctx.json() } catch {}
      return NextResponse.json({ error: body?.error || error.message, status, statusText, details: body || null }, { status })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    console.error('API /api/evidence/transcribe/status error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
