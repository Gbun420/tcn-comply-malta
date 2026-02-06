import { NextResponse } from 'next/server'
import { generateToken, createUser } from '../../../../lib/auth.js'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  let name = null
  let email = null
  let password = null
  let company = null

  try {
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      const bodyText = await request.text()
      if (bodyText) {
        const body = JSON.parse(bodyText)
        name = body?.name
        email = body?.email
        password = body?.password
        company = body?.company
      }
    }
  } catch (parseError) {
    console.error('Request parse error:', parseError.message)
  }

  if (!name || !email || !password || !company) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    )
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    )
  }

  let newUser = null

  try {
    newUser = await createUser({ name, email, password, company, role: 'employer' })
  } catch (createError) {
    console.error('Create user error:', createError)
    
    if (createError.message === 'User already exists') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Registration temporarily unavailable. Please try again later.' },
      { status: 503 }
    )
  }

  const token = generateToken(newUser)

  const response = NextResponse.json(
    {
      success: true,
      user: newUser,
    },
    { status: 201 }
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
