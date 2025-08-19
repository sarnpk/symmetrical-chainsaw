import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for privileged DB writes
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

    // Verify user with the provided token
    const { data: { user }, error: authError } = await supabaseSrv.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({})) as {
      storage_path: string
      file_name: string
      file_type?: string
      file_size: number
      caption?: string | null
      duration_seconds?: number
    }

    const { storage_path, file_name, file_type, file_size, caption, duration_seconds } = body

    if (!storage_path || !file_name || !Number.isFinite(file_size)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert evidence_files row (bypass RLS via service role)
    const insertPayload = {
      user_id: user.id,
      journal_entry_id: null,
      file_name,
      storage_bucket: 'evidence-audio',
      storage_path,
      file_type: file_type?.startsWith('audio/') ? file_type : 'audio/wav',
      file_size,
      caption: caption || null,
      duration_seconds: Math.max(0, Math.round(Number(duration_seconds) || 0)),
      transcription_status: 'processing',
      uploaded_at: new Date().toISOString(),
    }

    const { data: inserted, error: insertError } = await supabaseSrv
      .from('evidence_files')
      .insert(insertPayload)
      .select()
      .single()

    if (insertError || !inserted) {
      console.error('Insert evidence_files error:', insertError)
      return NextResponse.json({ error: 'Failed to record evidence file' }, { status: 500 })
    }

    // Preflight: generate signed URL to ensure object exists (mirror photo flow)
    const { data: signed } = await supabaseSrv.storage
      .from('evidence-audio')
      .createSignedUrl(storage_path, 3600)

    if (!signed?.signedUrl) {
      console.error('Preflight signed URL failed for', { bucket: 'evidence-audio', storage_path })
      await supabaseSrv
        .from('evidence_files')
        .update({ transcription_status: 'failed', processing_status: 'failed', metadata: { transcription_error: 'Audio file not found or inaccessible at provided storage_path' } })
        .eq('id', inserted.id)
      return NextResponse.json({
        error: 'Audio file not found or inaccessible. Could not generate signed URL.',
        details: { bucket: 'evidence-audio', storage_path },
      }, { status: 404 })
    }

    // Use a client with the user's Authorization header when invoking the Edge Function
    const supabaseWithUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: fxData, error: fxError } = await supabaseWithUser.functions.invoke('transcribe-audio', {
      body: { evidence_file_id: inserted.id, audio_url: signed.signedUrl, options: {} },
    })

    if (fxError) {
      // Supabase Functions error often masks actual body; try to surface more info
      const ctx: any = (fxError as any)?.context
      const status = ctx?.status || 500
      const statusText = ctx?.statusText || 'Functions error'
      let body: any = null
      try {
        if (ctx) {
          body = await ctx.json()
        }
      } catch {}
      const deployHint = status === 404 ? 'Edge Function transcribe-audio not found. Ensure it is deployed to this project and region.' : undefined
      console.error('Invoke transcribe-audio error:', { status, statusText, body, hint: deployHint })
      return NextResponse.json({
        error: body?.error || fxError.message || 'Transcription failed',
        status,
        statusText,
        details: body || null,
        hint: deployHint
      }, { status })
    }

    return NextResponse.json({ success: true, evidence_file_id: inserted.id, ...fxData })
  } catch (e: any) {
    console.error('API /api/evidence/transcribe error:', e)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
