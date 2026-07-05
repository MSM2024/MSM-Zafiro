import { type NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/auth', '/terms', '/api/ai/answer']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  )

  if (isPublic) return NextResponse.next()

  const supabaseAuthCookie = request.cookies.get('sb-access-token')
  const isAuthenticated = !!supabaseAuthCookie

  if (!isAuthenticated && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|assets/|favicon.ico).*)',
  ],
}
