import { NextResponse, type NextRequest } from 'next/server'

// Edge-safe middleware: avoid importing Node-only libraries (e.g., @supabase/*)
export function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Optional lightweight check using cookies only (no Supabase SDK on Edge)
  // If you want to keep hard redirects, uncomment below and adjust cookie name.
  // const isAuthed = Boolean(request.cookies.get('sb-access-token')?.value)
  // const protectedPaths = [
  //   '/dashboard',
  //   '/journal',
  //   '/ai-coach',
  //   '/patterns',
  //   '/mind-reset',
  //   '/safety-plan',
  //   '/boundary-builder',
  //   '/grey-rock',
  //   '/community',
  //   '/profile',
  //   '/settings',
  // ]
  // const isProtected = protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p))
  // if (!isAuthed && isProtected) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
  // if (isAuthed && request.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  return response
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - api (API routes)
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}