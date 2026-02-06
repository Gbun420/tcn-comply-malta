import { NextResponse } from 'next/server'
import { generateToken, authenticateUser } from '../../../../lib/auth.js'

const DEMO_USER = {
  uid: 'demo-1',
  email: 'bundyglenn@gmail.com',
  password: 'admin123',
  displayName: 'Glenn Bundy',
  role: 'admin',
  company: 'TCN Comply Malta',
}

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
    return NextResponse.json(
      { error: 'Email and password required' },
      { status: 400 }
    )
  }

  let user = null

  try {
    user = await authenticateUser(email, password)
  } catch (firebaseError) {
    console.log('Firebase auth error:', firebaseError.message)
  }

  if (!user && email === DEMO_USER.email && password === DEMO_USER.password) {
    user = {
      uid: DEMO_USER.uid,
      email: DEMO_USER.email,
      name: DEMO_USER.displayName,
      role: DEMO_USER.role,
      company: DEMO_USER.company,
    }
  }

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }

  const token = generateToken(user)

  const response = NextResponse.json(
    {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
      },
    },
    { status: 200 }
  )

  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return response
}
