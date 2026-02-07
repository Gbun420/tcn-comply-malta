import { requireAuth } from '../../../../lib/request-auth.js'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { payload, errorResponse } = requireAuth(request)

  if (errorResponse) {
    return errorResponse
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
