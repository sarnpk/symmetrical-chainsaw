import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

// Env vars
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const cookieStore = cookies()
    const supabaseAuth = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (_) {
            // ignore in route handler
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (_) {
            // ignore in route handler
          }
        },
      },
    })

    // Verify user
    const { data: userRes } = await supabaseAuth.auth.getUser()
    const user = userRes?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createSupabaseAdmin(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Validate the entry belongs to the user
    const { data: entry, error: entryErr } = await supabaseAdmin
      .from('journal_entries')
      .select('id, user_id')
      .eq('id', params.id)
      .maybeSingle()

    if (entryErr || !entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    if (entry.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch evidence files
    const { data: evidence, error: evErr } = await supabaseAdmin
      .from('evidence_files')
      .select('*')
      .eq('journal_entry_id', params.id)
      .order('uploaded_at', { ascending: true })

    if (evErr) {
      return NextResponse.json({ error: 'Failed to load evidence' }, { status: 500 })
    }

    // Create signed URLs
    const { searchParams } = new URL(req.url)
    const withDebug = searchParams.get('debug') === '1'
    const debugInfo: any[] = []
    const results = await Promise.all(
      (evidence || []).map(async (file: any) => {
        try {
          let signedUrl: string | null = null
          let hadPublicUrl = false
          if (file.storage_bucket && file.storage_path) {
            // Normalize path: Supabase storage paths should not start with a leading '/'
            const normalizedPath = String(file.storage_path).startsWith('/')
              ? String(file.storage_path).slice(1)
              : String(file.storage_path)

            // Try to create a signed URL first
            const { data: signed, error: signErr } = await supabaseAdmin.storage
              .from(file.storage_bucket)
              .createSignedUrl(normalizedPath, 3600)
            signedUrl = signed?.signedUrl || null

            // Fallback: if signed URL was not created (e.g., object missing or bucket is public),
            // attempt to return a public URL so the client can still render the image/audio.
            if (!signedUrl) {
              const { data: pub } = await supabaseAdmin.storage
                .from(file.storage_bucket)
                .getPublicUrl(normalizedPath)
              signedUrl = pub?.publicUrl || null
              hadPublicUrl = !!pub?.publicUrl
            }

            if (withDebug) {
              debugInfo.push({
                id: file.id,
                bucket: file.storage_bucket,
                path: normalizedPath,
                createdSignedUrl: !!signedUrl && !hadPublicUrl,
                usedPublicUrl: hadPublicUrl,
                signError: signErr ? String(signErr) : null,
              })
            }
          }
          return { ...file, signedUrl }
        } catch (e) {
          if (withDebug) {
            debugInfo.push({ id: file.id, error: String(e) })
          }
          return { ...file, signedUrl: null }
        }
      })
    )

    return NextResponse.json(withDebug ? { evidence: results, debugInfo } : { evidence: results })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
