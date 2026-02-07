import { parse as parseCookie } from 'cookie'
import { JWT_SECRET_PRODUCTION_ERROR, verifyToken } from './auth.js'

export function extractTokenFromRequest(request) {
  const cookieToken = request?.cookies?.get?.('auth-token')?.value
  if (cookieToken) {
    return cookieToken
  }

  const authorization = request?.headers?.get?.('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.slice(7).trim()
  }

  const cookieHeader = request?.headers?.get?.('cookie')
  if (!cookieHeader) {
    return null
  }

  const parsedCookies = parseCookie(cookieHeader)
  return parsedCookies['auth-token'] || null
}

export function requireAuth(request) {
  const token = extractTokenFromRequest(request)

  if (!token) {
    return {
      errorResponse: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  try {
    const payload = verifyToken(token)
    return { payload }
  } catch (error) {
    if (error?.message === JWT_SECRET_PRODUCTION_ERROR) {
      return {
        errorResponse: Response.json(
          { error: 'Authentication service unavailable' },
          { status: 503 }
        ),
      }
    }

    return {
      errorResponse: Response.json({ error: 'Invalid token' }, { status: 401 }),
    }
  }
}
