import { NextResponse, type NextRequest } from 'next/server.js'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_PREFIXES = ['/', '/jobs', '/employers', '/legal', '/dsa', '/transparency', '/auth']

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static and Next internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) return NextResponse.next()

  // Always allow public pages
  if (isPublicPath(pathname)) return NextResponse.next()

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getUser()
  const user = data.user

  // Auth-required areas
  const needsAuth =
    pathname.startsWith('/account') ||
    pathname.startsWith('/reviews') ||
    pathname.startsWith('/employer') ||
    pathname.startsWith('/admin')

  if (needsAuth && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (!user) return response

  const roleNeeded = pathname.startsWith('/admin')
    ? 'admin'
    : pathname.startsWith('/employer')
      ? 'employer'
      : null
  if (!roleNeeded) return response

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  const role = profile?.role

  if (roleNeeded === 'admin') {
    if (role !== 'admin') return NextResponse.redirect(new URL('/', request.url))
  }

  if (roleNeeded === 'employer') {
    if (role !== 'employer' && role !== 'admin')
      return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
