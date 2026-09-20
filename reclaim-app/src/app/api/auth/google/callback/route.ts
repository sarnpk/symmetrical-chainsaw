import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/auth/google/callback
 * Exchanges the Google authorization code for tokens, then creates a Supabase
 * session and redirects to the dashboard.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state') || '/dashboard'
  const error = req.nextUrl.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL(`/auth?error=${error || 'missing_code'}`, req.url))
  }

  try {
    // Exchange authorization code for tokens
    const tokenBody = new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${req.nextUrl.origin}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    })

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody,
    })

    const tokenData = await tokenRes.json()
    if (tokenData.error || !tokenData.id_token) {
      return NextResponse.redirect(new URL('/auth?error=token_exchange_failed', req.url))
    }

    // Use the ID token to sign in to Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data, error: signInError } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokenData.id_token,
      access_token: tokenData.access_token,
    })

    if (signInError || !data.session) {
      console.error('[Google Callback] Supabase signInWithIdToken error:', signInError?.message)
      return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(signInError?.message || 'no session')}`, req.url))
    }

    // Ensure profile exists
    if (data.user) {
      const admin = createClient(supabaseUrl, supabaseServiceKey)
      const { data: existing } = await admin
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle()

      if (!existing) {
        await admin.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.user_metadata?.full_name
            || data.user.user_metadata?.name
            || data.user.email?.split('@')[0],
          subscription_tier: 'foundation',
        })
      }
    }

    // Set the session cookie using the SSR server client so it uses the
    // correct cookie name/format that the browser client reads.
    const cookieStore = await cookies()
    const pendingCookies: Array<{ name: string; value: string; options: any }> = []
    const serverSupabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              pendingCookies.push({ name, value, options })
            )
          },
        },
      }
    )

    await serverSupabase.auth.setSession(data.session)

    const response = NextResponse.redirect(new URL(state, req.url))
    pendingCookies.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options)
    )
    return response
  } catch (e: any) {
    console.error('[Google Callback] Unexpected error:', e?.message || e)
    return NextResponse.redirect(new URL('/auth?error=server_error', req.url))
  }
}