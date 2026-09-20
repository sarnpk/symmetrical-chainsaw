import { NextResponse } from 'next/server'

/**
 * GET /api/auth/google/start
 * Redirects the user to Google's OAuth consent screen.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`
  const state = req.nextUrl.searchParams.get('redirect') || '/dashboard'

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state,
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}