import assert from 'node:assert/strict'
import test from 'node:test'

import { GET as employeesGet } from '../app/api/employees/route.js'
import { GET as vacanciesGet } from '../app/api/vacancies/route.js'
import { generateToken } from '../lib/auth.js'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-1234567890'

function makeAuthRequest(url) {
  const token = generateToken({
    uid: 'uid-1',
    email: 'user@example.com',
    role: 'employer',
    company: 'Example Co',
    name: 'User Example',
    workspaceId: 'workspace-1',
  })

  return new Request(url, {
    headers: {
      cookie: `auth-token=${token}`,
    },
  })
}

test('GET /api/employees returns 503 when database is not configured', async () => {
  process.env.FIREBASE_PROJECT_ID = 'your-firebase-project-id'
  process.env.FIREBASE_CLIENT_EMAIL = 'your-firebase-client-email'
  process.env.FIREBASE_PRIVATE_KEY = 'your-firebase-private-key'

  const response = await employeesGet(makeAuthRequest('http://localhost/api/employees'))
  const body = await response.json()

  assert.equal(response.status, 503)
  assert.match(body.error, /database not configured/i)
})

test('GET /api/vacancies returns 503 when database is not configured', async () => {
  process.env.FIREBASE_PROJECT_ID = 'your-firebase-project-id'
  process.env.FIREBASE_CLIENT_EMAIL = 'your-firebase-client-email'
  process.env.FIREBASE_PRIVATE_KEY = 'your-firebase-private-key'

  const response = await vacanciesGet(makeAuthRequest('http://localhost/api/vacancies'))
  const body = await response.json()

  assert.equal(response.status, 503)
  assert.match(body.error, /database not configured/i)
})

