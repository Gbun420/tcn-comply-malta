import { jwtDecode } from 'jwt-decode'

export const dynamic = 'force-dynamic'

function verifyToken(token) {
  try {
    return jwtDecode(token)
  } catch (error) {
    return null
  }
}

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    return Response.json({
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name || payload.email?.split('@')[0] || 'User',
        role: payload.role || 'employer',
        company: payload.company || '',
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
