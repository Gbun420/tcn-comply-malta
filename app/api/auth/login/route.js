import {
  JWT_SECRET_PRODUCTION_ERROR,
  authenticateUser,
  generateToken,
} from '../../../../lib/auth.js'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  let body = null

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = body?.email?.trim()
  const password = body?.password

  if (!email || !password) {
    return Response.json({ error: 'Email and password required' }, { status: 400 })
  }

  const user = await authenticateUser(email, password)

  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  let token = null

  try {
    token = generateToken(user)
  } catch (error) {
    if (error?.message === JWT_SECRET_PRODUCTION_ERROR) {
      return Response.json({ error: 'Authentication service unavailable' }, { status: 503 })
    }

    return Response.json({ error: 'Internal server error' }, { status: 500 })
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

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${cookieHeader}${secureFlag}`,
    },
  })
}
