import { Response } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const responseData = { success: true }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
      },
    })
  } catch (error) {
    console.error('Logout error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
