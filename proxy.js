import { NextResponse } from 'next/server'
import { applyCorsHeaders, preflightResponse } from './lib/api-cors.js'
import { evaluateMiddlewareRequest } from './lib/middleware-policy.js'
import { PUBLIC_PATHS } from './lib/public-pages.js'

export function proxy(request) {
  const method = request.method
  const token = request.cookies.get('auth-token')?.value
  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith('/api/')
  const isAuthApiRoute = pathname.startsWith('/api/auth/')

  const outcome = evaluateMiddlewareRequest({
    method,
    pathname,
    hasToken: Boolean(token),
    isApiRoute,
    isAuthApiRoute,
    publicPaths: PUBLIC_PATHS,
  })

  if (outcome === 'api-preflight') {
    return preflightResponse(request)
  }

  if (outcome === 'api-unauthorized') {
    return applyCorsHeaders(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
  }

  if (outcome === 'redirect-login') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
