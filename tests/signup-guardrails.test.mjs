import assert from 'node:assert/strict'
import test from 'node:test'

import { buildSignupRateLimitKey, getSignupRateLimitConfig } from '../lib/signup/rate-limit.js'
import { getTurnstileConfig, verifyTurnstileToken } from '../lib/signup/turnstile.js'

test('rate-limit key is deterministic and depends on email/ip', () => {
  const keyA = buildSignupRateLimitKey({ email: 'User@Example.com', ip: '1.2.3.4' })
  const keyB = buildSignupRateLimitKey({ email: 'user@example.com', ip: '1.2.3.4' })
  const keyC = buildSignupRateLimitKey({ email: 'user@example.com', ip: '8.8.8.8' })

  assert.equal(keyA, keyB)
  assert.notEqual(keyA, keyC)
})

test('rate-limit config applies documented defaults', () => {
  delete process.env.SIGNUP_RATE_LIMIT_WINDOW_SECONDS
  delete process.env.SIGNUP_RATE_LIMIT_MAX_ATTEMPTS

  const config = getSignupRateLimitConfig()
  assert.equal(config.windowSeconds, 900)
  assert.equal(config.maxAttempts, 5)
})

test('turnstile config reports disabled when secret missing', () => {
  delete process.env.TURNSTILE_SECRET_KEY

  const config = getTurnstileConfig()
  assert.equal(config.enabled, false)
})

test('turnstile verification fails with clear reason when secret is missing', async () => {
  delete process.env.TURNSTILE_SECRET_KEY

  const result = await verifyTurnstileToken({ token: 'dummy-token', remoteIp: '1.2.3.4' })
  assert.equal(result.success, false)
  assert.equal(result.reason, 'turnstile-secret-missing')
})
