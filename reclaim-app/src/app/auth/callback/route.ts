import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// Force Node.js runtime (not Edge) and dynamic rendering for auth callback
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createServerSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}