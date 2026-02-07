import assert from 'node:assert/strict'
import test from 'node:test'

import { POST as registerPost } from '../app/api/auth/register/route.js'

function createRequest(body) {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('register route returns 400 when required fields are missing', async () => {
  const response = await registerPost(createRequest({}))
  const body = await response.json()

  assert.equal(response.status, 400)
  assert.equal(body.error, 'All fields are required')
})

test('register route returns 400 when consent checkboxes are not accepted', async () => {
  const response = await registerPost(
    createRequest({
      name: 'Owner',
      email: 'owner@example.com',
      password: 'password123',
      company: 'Example Co',
      turnstileToken: 'token',
      consentTerms: false,
      consentPrivacy: true,
    })
  )
  const body = await response.json()

  assert.equal(response.status, 400)
  assert.match(body.error, /terms and privacy policy/i)
})

test('register route returns 400 when turnstile token is missing', async () => {
  const response = await registerPost(
    createRequest({
      name: 'Owner',
      email: 'owner@example.com',
      password: 'password123',
      company: 'Example Co',
      consentTerms: true,
      consentPrivacy: true,
    })
  )
  const body = await response.json()

  assert.equal(response.status, 400)
  assert.match(body.error, /turnstile token is required/i)
})

test('register route returns 503 when signup guardrails storage is unavailable', async () => {
  const response = await registerPost(
    createRequest({
      name: 'Owner',
      email: 'owner@example.com',
      password: 'password123',
      company: 'Example Co',
      turnstileToken: 'token',
      consentTerms: true,
      consentPrivacy: true,
    })
  )
  const body = await response.json()

  assert.equal(response.status, 503)
  assert.match(body.error, /self-registration is temporarily unavailable/i)
})
