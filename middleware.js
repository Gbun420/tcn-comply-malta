import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

function verifyToken(token) {
  try {
    return jwtDecode(token)
  } catch (error) {
    return null
  }
}

export function middleware(request) {
  const token = request.cookies.get('auth-token')?.value
  
  const publicPaths = ['/', '/auth/login', '/auth/register', '/api/auth/login', '/api/auth/register', '/privacy', '/robots.txt', '/sitemap.xml']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path)
  
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  const isAuthApi = request.nextUrl.pathname.startsWith('/api/auth/')
  
  if (isApiRoute && !isAuthApi) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = verifyToken(token)
    if (!session) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', session.userId)
    requestHeaders.set('x-user-email', session.email)
    requestHeaders.set('x-user-role', session.role)
    
    return NextResponse.next({ request: { headers: requestHeaders } })
  }
  
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  if (token && (request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
