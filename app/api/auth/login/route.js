import { generateToken, authenticateUser, isFirebaseConfigured } from '../../../../lib/auth.js'

export async function POST(request) {
  let email = null
  let password = null

  try {
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      const bodyText = await request.text()
      if (bodyText) {
        const body = JSON.parse(bodyText)
        email = body?.email
        password = body?.password
      }
    }
  } catch (parseError) {
    console.error('Request parse error:', parseError.message)
  }

  if (!email || !password) {
    return Response.json(
      { error: 'Email and password required' },
      { status: 400 }
    )
  }

  let user = null

  try {
    if (!isFirebaseConfigured(process.env)) {
      return Response.json(
        { error: 'Authentication not configured', setupRequired: true },
        { status: 503 }
      )
    }
    user = await authenticateUser(email, password)
  } catch (firebaseError) {
    console.log('Firebase auth error:', firebaseError.message)
  }

  if (!user) {
    return Response.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }

  const token = generateToken(user)

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

  const response = new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `auth-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    }
  })

  return response
}
