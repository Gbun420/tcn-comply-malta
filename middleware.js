import { NextResponse } from 'next/server'

const PUBLIC_PATHS = new Set([
  '/',
  '/auth/login',
  '/auth/register',
  '/privacy',
  '/terms',
  '/audit-app',
  '/solutions',
  '/coverage',
  '/workflow',
  '/contact',
  '/robots.txt',
  '/sitemap.xml',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
])

export function middleware(request) {
  const token = request.cookies.get('auth-token')?.value
  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith('/api/')
  const isAuthApiRoute = pathname.startsWith('/api/auth/')

  if (isApiRoute && !isAuthApiRoute && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!PUBLIC_PATHS.has(pathname) && !isApiRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
