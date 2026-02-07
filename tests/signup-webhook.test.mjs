import assert from 'node:assert/strict'
import test from 'node:test'

import {
  dispatchSignupCreatedWebhook,
  processSignupWebhookQueue,
  signWebhookPayload,
} from '../lib/signup/webhook-dispatch.js'

class FakeDocRef {
  constructor(db, collectionName, id) {
    this.db = db
    this.collectionName = collectionName
    this.id = id
  }

  async set(data, options = {}) {
    const collection = this.db.ensureCollection(this.collectionName)
    const existing = collection.get(this.id) || {}
    collection.set(this.id, options.merge ? { ...existing, ...data } : data)
  }

  async update(data) {
    const collection = this.db.ensureCollection(this.collectionName)
    const existing = collection.get(this.id) || {}
    collection.set(this.id, { ...existing, ...data })
  }
}

class FakeCollection {
  constructor(db, name) {
    this.db = db
    this.name = name
  }

  doc(id) {
    const nextId = id || `${this.name}-${++this.db.idCounter}`
    return new FakeDocRef(this.db, this.name, nextId)
  }

  limit(size) {
    return {
      get: async () => {
        const collection = this.db.ensureCollection(this.name)
        const docs = Array.from(collection.entries())
          .slice(0, size)
          .map(([id, data]) => ({
            id,
            data: () => data,
            ref: new FakeDocRef(this.db, this.name, id),
          }))

        return { docs }
      },
    }
  }
}

class FakeDb {
  constructor() {
    this.collections = new Map()
    this.idCounter = 0
  }

  ensureCollection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map())
    }

    return this.collections.get(name)
  }

  collection(name) {
    this.ensureCollection(name)
    return new FakeCollection(this, name)
  }
}

function baseConfig(overrides = {}) {
  return {
    url: 'https://example.com/webhook',
    signingSecret: 'super-secret',
    timeoutMs: 1000,
    maxRetries: 3,
    ...overrides,
  }
}

function samplePayload() {
  return {
    user: {
      uid: 'uid-1',
      email: 'owner@example.com',
      name: 'Owner User',
      role: 'owner',
      company: 'Example Co',
      workspaceId: 'ws-1',
    },
    workspace: {
      id: 'ws-1',
      name: 'Example Co',
      slug: 'example-co',
      plan: 'starter',
      status: 'active',
    },
  }
}

test('signWebhookPayload returns deterministic signature', () => {
  const payload = JSON.stringify({ hello: 'world' })
  const sigA = signWebhookPayload(payload, 'secret')
  const sigB = signWebhookPayload(payload, 'secret')
  const sigC = signWebhookPayload(payload, 'another-secret')

  assert.equal(sigA, sigB)
  assert.notEqual(sigA, sigC)
  assert.match(sigA, /^[a-f0-9]{64}$/)
})

test('dispatchSignupCreatedWebhook returns delivered=true when target succeeds', async () => {
  const db = new FakeDb()

  const result = await dispatchSignupCreatedWebhook({
    ...samplePayload(),
    db,
    config: baseConfig(),
    now: new Date('2026-02-07T09:00:00.000Z'),
    fetchImpl: async () => new Response('ok', { status: 200 }),
  })

  assert.equal(result.delivered, true)
  assert.equal(result.queued, false)
  assert.equal(db.ensureCollection('signup_webhook_queue').size, 0)
})

test('dispatchSignupCreatedWebhook queues event when target fails', async () => {
  const db = new FakeDb()

  const result = await dispatchSignupCreatedWebhook({
    ...samplePayload(),
    db,
    config: baseConfig(),
    now: new Date('2026-02-07T09:00:00.000Z'),
    fetchImpl: async () => new Response('unavailable', { status: 503 }),
  })

  assert.equal(result.delivered, false)
  assert.equal(result.queued, true)
  assert.ok(result.eventId)

  const queued = db.ensureCollection('signup_webhook_queue').get(result.eventId)
  assert.equal(queued.status, 'pending')
  assert.equal(queued.attempts, 1)
  assert.equal(queued.eventType, 'signup.created')
})

test('processSignupWebhookQueue retries pending event and marks delivered on success', async () => {
  const db = new FakeDb()

  const dispatchResult = await dispatchSignupCreatedWebhook({
    ...samplePayload(),
    db,
    config: baseConfig(),
    now: new Date('2026-02-07T09:00:00.000Z'),
    fetchImpl: async () => new Response('down', { status: 503 }),
  })

  assert.equal(dispatchResult.queued, true)

  let attempts = 0
  const summary = await processSignupWebhookQueue({
    db,
    config: baseConfig(),
    now: new Date('2026-02-07T10:00:00.000Z'),
    fetchImpl: async () => {
      attempts += 1
      return new Response('ok', { status: 200 })
    },
  })

  assert.equal(summary.processed, 1)
  assert.equal(summary.delivered, 1)
  assert.equal(attempts, 1)

  const queued = db.ensureCollection('signup_webhook_queue').get(dispatchResult.eventId)
  assert.equal(queued.status, 'delivered')
  assert.equal(queued.attempts, 2)
})

test('processSignupWebhookQueue marks event dead_letter after max retries', async () => {
  const db = new FakeDb()
  const eventId = 'event-dead-letter'

  await db.collection('signup_webhook_queue').doc(eventId).set({
    id: eventId,
    eventType: 'signup.created',
    targetUrl: 'https://example.com/webhook',
    payload: { hello: 'world' },
    signature: 'sig',
    attempts: 2,
    maxAttempts: 3,
    status: 'pending',
    nextAttemptAt: '2026-02-07T09:00:00.000Z',
    createdAt: '2026-02-07T08:00:00.000Z',
    updatedAt: '2026-02-07T08:00:00.000Z',
  })

  const summary = await processSignupWebhookQueue({
    db,
    config: baseConfig(),
    now: new Date('2026-02-07T10:00:00.000Z'),
    fetchImpl: async () => new Response('down', { status: 500 }),
  })

  assert.equal(summary.deadLettered, 1)
  const queued = db.ensureCollection('signup_webhook_queue').get(eventId)
  assert.equal(queued.status, 'dead_letter')
  assert.equal(queued.attempts, 3)
})
