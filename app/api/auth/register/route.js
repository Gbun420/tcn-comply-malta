import { NextResponse } from 'next/server'
import { generateToken, createUser } from '../../../../lib/auth.js'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { name, email, password, company } = await request.json()

    if (!name || !email || !password || !company) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    let newUser = null

    try {
      newUser = await createUser({ name, email, password, company, role: 'employer' })
    } catch (createError) {
      console.error('Firebase create user error:', createError)
      
      if (createError.message === 'User already exists') {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
      }
      
      return NextResponse.json({ 
        error: 'Registration temporarily unavailable. Please try again later.'
      }, { status: 503 })
    }

    const token = generateToken(newUser)

    const response = NextResponse.json({
      success: true,
      user: newUser
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
