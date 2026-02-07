import { NextResponse } from 'next/server'
import {
  JWT_SECRET_PRODUCTION_ERROR,
  classifyFirebaseAuthError,
  createUser,
  generateToken,
} from '../../../../lib/auth.js'
import { applyCorsHeaders, preflightResponse } from '../../../../lib/api-cors.js'
import { enforceSignupRateLimit, extractRequestIp } from '../../../../lib/signup/rate-limit.js'
import { provisionWorkspaceForSignup } from '../../../../lib/signup/provision-workspace.js'
import { verifyTurnstileToken } from '../../../../lib/signup/turnstile.js'

export const dynamic = 'force-dynamic'
const CORS_OPTIONS = { methods: 'POST,OPTIONS' }

function withCors(request, response) {
  return applyCorsHeaders(request, response, CORS_OPTIONS)
}

export function OPTIONS(request) {
  return preflightResponse(request, CORS_OPTIONS)
}

export async function POST(request) {
  let name = null
  let email = null
  let password = null
  let company = null
  let turnstileToken = null
  let consentTerms = false
  let consentPrivacy = false

  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const bodyText = await request.text()
      if (bodyText) {
        const body = JSON.parse(bodyText)
        name = body?.name?.trim()
        email = body?.email?.trim()
        password = body?.password
        company = body?.company?.trim()
        turnstileToken = body?.turnstileToken
        consentTerms = body?.consentTerms === true
        consentPrivacy = body?.consentPrivacy === true
      }
    }
  } catch (parseError) {
    console.error('Request parse error:', parseError.message)
  }

  if (!name || !email || !password || !company) {
    return withCors(
      request,
      NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    )
  }

  if (!consentTerms || !consentPrivacy) {
    return withCors(
      request,
      NextResponse.json(
        { error: 'You must accept the Terms and Privacy Policy to continue.' },
        { status: 400 }
      )
    )
  }

  if (!turnstileToken) {
    return withCors(request, NextResponse.json({ error: 'Turnstile token is required' }, { status: 400 }))
  }

  const rateLimit = await enforceSignupRateLimit({ request, email })
  if (!rateLimit.allowed) {
    return withCors(
      request,
      NextResponse.json(
        { error: rateLimit.error },
        { status: rateLimit.status }
      )
    )
  }

  const turnstileResult = await verifyTurnstileToken({
    token: turnstileToken,
    remoteIp: extractRequestIp(request),
  })
  if (!turnstileResult.success) {
    return withCors(
      request,
      NextResponse.json({ error: 'CAPTCHA verification failed. Please try again.' }, { status: 400 })
    )
  }

  if (password.length < 6) {
    return withCors(
      request,
      NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    )
  }

  let newUser = null
  let workspace = null

  try {
    newUser = await createUser({ name, email, password, company, role: 'owner' })
  } catch (createError) {
    console.error('Create user error:', createError)

    const errorType = classifyFirebaseAuthError(createError?.message)

    if (errorType === 'USER_EXISTS') {
      return withCors(
        request,
        NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
      )
    }

    if (errorType === 'WEAK_PASSWORD') {
      return withCors(
        request,
        NextResponse.json({ error: 'Password does not meet security requirements' }, { status: 400 })
      )
    }

    if (errorType === 'RATE_LIMITED') {
      return withCors(
        request,
        NextResponse.json({ error: 'Too many signup attempts. Please try again shortly.' }, { status: 429 })
      )
    }

    if (errorType === 'PROVIDER_MISCONFIGURED') {
      return withCors(
        request,
        NextResponse.json(
          {
            error:
              'Self-registration is temporarily unavailable. Please contact support to activate your account.',
          },
          { status: 503 }
        )
      )
    }

    return withCors(
      request,
      NextResponse.json(
        { error: 'Registration temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    )
  }

  try {
    const provisioned = await provisionWorkspaceForSignup({
      uid: newUser.uid,
      email: newUser.email,
      name: newUser.name,
      company: newUser.company,
    })

    workspace = provisioned.workspace
    newUser = {
      ...newUser,
      role: provisioned.userProfile.role,
      workspaceId: provisioned.userProfile.workspaceId,
      company: provisioned.userProfile.company,
    }
  } catch (provisionError) {
    console.error('Workspace provisioning error:', provisionError)
    return withCors(
      request,
      NextResponse.json(
        { error: 'Workspace provisioning failed. Please contact support.' },
        { status: 503 }
      )
    )
  }

  let token = null

  try {
    token = generateToken(newUser)
  } catch (error) {
    if (error?.message === JWT_SECRET_PRODUCTION_ERROR) {
      return withCors(
        request,
        NextResponse.json({ error: 'Authentication service unavailable' }, { status: 503 })
      )
    }

    return withCors(request, NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }

  const response = withCors(
    request,
    NextResponse.json(
      {
        success: true,
        user: newUser,
        workspace,
      },
      { status: 201 }
    )
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
