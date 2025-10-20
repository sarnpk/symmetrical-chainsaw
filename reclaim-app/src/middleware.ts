import { NextResponse, type NextRequest } from 'next/server'

// Edge-safe middleware: avoid importing Node-only libraries (e.g., @supabase/*)
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ua = request.headers.get('user-agent') || ''

  // Lightweight mobile detection
  const isMobile = /Mobile|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/i.test(ua)

  // Mobile-only redirect to v3 flow for the journal new entry page
  if (isMobile) {
    const isNewRoot = pathname === '/journal/new' || pathname === '/journal/new/'
    const alreadyV3 = pathname.startsWith('/journal/new/what-happened')
      || pathname.startsWith('/journal/new/photo-evidence')
      || pathname.startsWith('/journal/new/audio-evidence')
      || pathname.startsWith('/journal/new/people')
      || pathname.startsWith('/journal/new/location')
      || pathname.startsWith('/journal/new/tags')
      || pathname.startsWith('/journal/new/emotions')
      || pathname.startsWith('/journal/new/review')

    if (isNewRoot && !alreadyV3) {
      const url = new URL('/journal/new/what-happened', request.url)
      return NextResponse.redirect(url)
    }
  }

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