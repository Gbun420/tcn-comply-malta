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
  try {
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`,
      },
    })

    return withCors(request, response)
  } catch (error) {
    console.error('Logout error:', error)
    return withCors(request, Response.json({ error: 'Internal server error' }, { status: 500 }))
  }
}
