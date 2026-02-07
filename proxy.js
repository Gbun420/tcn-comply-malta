import { NextResponse } from 'next/server'
import { evaluateMiddlewareRequest } from './lib/middleware-policy.js'

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

export function proxy(request) {
  const token = request.cookies.get('auth-token')?.value
  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith('/api/')
  const isAuthApiRoute = pathname.startsWith('/api/auth/')

  const outcome = evaluateMiddlewareRequest({
    pathname,
    hasToken: Boolean(token),
    isApiRoute,
    isAuthApiRoute,
    publicPaths: PUBLIC_PATHS,
  })

  if (outcome === 'api-unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (outcome === 'redirect-login') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
