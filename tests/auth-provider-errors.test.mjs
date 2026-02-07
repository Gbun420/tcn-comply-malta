import assert from 'node:assert/strict'
import test from 'node:test'

import { classifyFirebaseAuthError } from '../lib/auth.js'

test('classifies duplicate-account errors', () => {
  assert.equal(classifyFirebaseAuthError('EMAIL_EXISTS'), 'USER_EXISTS')
  assert.equal(classifyFirebaseAuthError('auth/email-already-exists'), 'USER_EXISTS')
})

test('classifies provider misconfiguration errors', () => {
  assert.equal(classifyFirebaseAuthError('API_KEY_HTTP_REFERRER_BLOCKED'), 'PROVIDER_MISCONFIGURED')
  assert.equal(
    classifyFirebaseAuthError('API key not valid. Please pass a valid API key.'),
    'PROVIDER_MISCONFIGURED'
  )
  assert.equal(classifyFirebaseAuthError('Firebase not configured'), 'PROVIDER_MISCONFIGURED')
})

test('classifies weak password and rate limits', () => {
  assert.equal(
    classifyFirebaseAuthError('WEAK_PASSWORD : Password should be at least 6 characters'),
    'WEAK_PASSWORD'
  )
  assert.equal(classifyFirebaseAuthError('TOO_MANY_ATTEMPTS_TRY_LATER'), 'RATE_LIMITED')
})

test('defaults to service unavailable for unknown errors', () => {
  assert.equal(classifyFirebaseAuthError('unexpected failure'), 'SERVICE_UNAVAILABLE')
})
