import assert from 'node:assert/strict'
import test from 'node:test'

import { POST as retryPost } from '../app/api/internal/signup-webhook-retry/route.js'

test('signup webhook retry route returns 503 when INTERNAL_CRON_SECRET is missing', async () => {
  const previous = process.env.INTERNAL_CRON_SECRET
  delete process.env.INTERNAL_CRON_SECRET

  try {
    const request = new Request('http://localhost/api/internal/signup-webhook-retry', {
      method: 'POST',
    })
    const response = await retryPost(request)
    const body = await response.json()

    assert.equal(response.status, 503)
    assert.match(body.error, /INTERNAL_CRON_SECRET/i)
  } finally {
    if (previous) {
      process.env.INTERNAL_CRON_SECRET = previous
    }
  }
})

test('signup webhook retry route returns 401 for invalid internal secret', async () => {
  const previous = process.env.INTERNAL_CRON_SECRET
  process.env.INTERNAL_CRON_SECRET = 'expected-secret'

  try {
    const request = new Request('http://localhost/api/internal/signup-webhook-retry', {
      method: 'POST',
      headers: {
        'x-internal-secret': 'wrong-secret',
      },
    })

    const response = await retryPost(request)
    const body = await response.json()

    assert.equal(response.status, 401)
    assert.equal(body.error, 'Unauthorized')
  } finally {
    if (previous) {
      process.env.INTERNAL_CRON_SECRET = previous
    } else {
      delete process.env.INTERNAL_CRON_SECRET
    }
  }
})
