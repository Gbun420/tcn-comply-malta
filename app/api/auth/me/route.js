import { JWT_SECRET_PRODUCTION_ERROR, verifyToken } from '../../../../lib/auth.js'
import { extractTokenFromRequest } from '../../../../lib/request-auth.js'

export const dynamic = 'force-dynamic'

function unauthorizedResponse(message) {
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''

  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`,
    },
  })
}

export async function GET(request) {
  const token = extractTokenFromRequest(request)

  if (!token) {
    return unauthorizedResponse('Unauthorized')
  }

  let payload = null

  try {
    payload = verifyToken(token)
  } catch (error) {
    if (error?.message === JWT_SECRET_PRODUCTION_ERROR) {
      return Response.json({ error: 'Authentication service unavailable' }, { status: 503 })
    }

    return unauthorizedResponse('Invalid token')
  }

  return Response.json({
    user: {
      id: payload.userId,
      email: payload.email,
      name: payload.name || payload.email?.split('@')[0] || 'User',
      role: payload.role || 'employer',
      company: payload.company || '',
    },
  })
}
