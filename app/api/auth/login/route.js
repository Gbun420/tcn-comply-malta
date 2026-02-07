import {
  JWT_SECRET_PRODUCTION_ERROR,
  authenticateUser,
  generateToken,
  isFirebaseAuthConfigured,
} from '../../../../lib/auth.js'
import { applyCorsHeaders, preflightResponse } from '../../../../lib/api-cors.js'

export const dynamic = 'force-dynamic'
const CORS_OPTIONS = { methods: 'POST,OPTIONS' }

function withCors(request, response) {
  return applyCorsHeaders(request, response, CORS_OPTIONS)
}

export function OPTIONS(request) {
  return preflightResponse(request, CORS_OPTIONS)
}

export async function POST(request) {
  let body = null

  try {
    body = await request.json()
  } catch {
    return withCors(request, Response.json({ error: 'Invalid request body' }, { status: 400 }))
  }

  const email = body?.email?.trim()
  const password = body?.password

  if (!email || !password) {
    return withCors(
      request,
      Response.json({ error: 'Email and password required' }, { status: 400 })
    )
  }

  if (!isFirebaseAuthConfigured()) {
    return withCors(
      request,
      Response.json(
        { error: 'Authentication provider is not configured. Please contact support.' },
        { status: 503 }
      )
    )
  }

  const user = await authenticateUser(email, password)

  if (!user) {
    return withCors(request, Response.json({ error: 'Invalid credentials' }, { status: 401 }))
  }

  let token = null

  try {
    token = generateToken(user)
  } catch (error) {
    if (error?.message === JWT_SECRET_PRODUCTION_ERROR) {
      return withCors(
        request,
        Response.json({ error: 'Authentication service unavailable' }, { status: 503 })
      )
    }

    return withCors(request, Response.json({ error: 'Internal server error' }, { status: 500 }))
  }

  const responseData = {
    success: true,
    user: {
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
    },
  }

  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const cookieHeader = [
    `auth-token=${token}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${7 * 24 * 60 * 60}`,
    'SameSite=Lax',
  ].join('; ')

  return withCors(
    request,
    new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${cookieHeader}${secureFlag}`,
      },
    })
  )
}
