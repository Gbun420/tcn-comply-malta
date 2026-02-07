import assert from 'node:assert/strict'
import test from 'node:test'

import { POST as loginPost } from '../app/api/auth/login/route.js'
import { GET as meGet } from '../app/api/auth/me/route.js'
import { POST as logoutPost } from '../app/api/auth/logout/route.js'
import { generateToken } from '../lib/auth.js'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-1234567890'

test('POST /api/auth/login returns 400 when credentials are missing', async () => {
  const request = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  })

  const response = await loginPost(request)
  const body = await response.json()

  assert.equal(response.status, 400)
  assert.equal(body.error, 'Email and password required')
})

test('POST /api/auth/login returns 503 when auth provider is not configured', async () => {
  const request = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'invalid@example.com',
      password: 'wrong-password',
    }),
  })

  const response = await loginPost(request)
  const body = await response.json()

  assert.equal(response.status, 503)
  assert.equal(body.error, 'Authentication provider is not configured. Please contact support.')
})

test('POST /api/auth/login returns 200 with session context fields when auth succeeds', async () => {
  const originalFetch = global.fetch
  const originalApiKey = process.env.FIREBASE_API_KEY
  process.env.FIREBASE_API_KEY = 'AIzaSyTestKey12345678901234567890'

  global.fetch = async () =>
    new Response(
      JSON.stringify({
        localId: 'uid-123',
        email: 'valid@example.com',
        displayName: 'Valid User',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )

  try {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'valid@example.com',
        password: 'test-password',
      }),
    })

    const response = await loginPost(request)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.success, true)
    assert.equal(body.user.email, 'valid@example.com')
    assert.equal(body.user.role, 'employer')
    assert.equal(body.user.company, '')
    assert.equal(body.user.workspaceId, '')
    assert.match(response.headers.get('set-cookie') || '', /auth-token=/i)
  } finally {
    global.fetch = originalFetch
    if (originalApiKey) {
      process.env.FIREBASE_API_KEY = originalApiKey
    } else {
      delete process.env.FIREBASE_API_KEY
    }
  }
})

test('GET /api/auth/me returns 401 without auth cookie', async () => {
  const request = new Request('http://localhost/api/auth/me')

  const response = await meGet(request)
  const body = await response.json()

  assert.equal(response.status, 401)
  assert.equal(body.error, 'Unauthorized')
})

test('GET /api/auth/me returns 401 for tampered token', async () => {
  const validToken = generateToken({
    uid: 'user-1',
    email: 'user@example.com',
    role: 'employer',
    company: 'Example Ltd',
    name: 'User Example',
  })

  const request = new Request('http://localhost/api/auth/me', {
    headers: {
      cookie: `auth-token=${validToken}tampered`,
    },
  })

  const response = await meGet(request)
  const body = await response.json()

  assert.equal(response.status, 401)
  assert.equal(body.error, 'Invalid token')
  assert.match(response.headers.get('set-cookie') || '', /auth-token=.*Max-Age=0/i)
})

test('GET /api/auth/me returns 200 with a valid signed token', async () => {
  const token = generateToken({
    uid: 'user-2',
    email: 'valid@example.com',
    role: 'employer',
    company: 'Valid Co',
    name: 'Valid User',
    workspaceId: 'workspace-123',
  })

  const request = new Request('http://localhost/api/auth/me', {
    headers: {
      cookie: `auth-token=${token}`,
    },
  })

  const response = await meGet(request)
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.user.email, 'valid@example.com')
  assert.equal(body.user.role, 'employer')
  assert.equal(body.user.name, 'Valid User')
  assert.equal(body.user.workspaceId, 'workspace-123')
})

test('POST /api/auth/logout returns 200 and clears auth cookie', async () => {
  const request = new Request('http://localhost/api/auth/logout', { method: 'POST' })

  const response = await logoutPost(request)
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.success, true)
  assert.match(response.headers.get('set-cookie') || '', /auth-token=.*Max-Age=0/i)
})
