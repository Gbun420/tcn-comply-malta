import assert from 'node:assert/strict'
import test from 'node:test'

import { provisionWorkspaceForSignup } from '../lib/signup/provision-workspace.js'
import { queueWelcomeEmail } from '../lib/signup/welcome-email.js'

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

  async get() {
    const collection = this.db.ensureCollection(this.collectionName)
    const data = collection.get(this.id)
    return {
      exists: Boolean(data),
      id: this.id,
      data: () => data,
    }
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

  where(field, op, value) {
    assert.equal(op, '==')
    const collection = this.db.ensureCollection(this.name)
    const docs = Array.from(collection.entries())
      .filter(([, doc]) => doc?.[field] === value)
      .map(([docId, doc]) => ({ id: docId, data: () => doc }))

    return {
      limit: () => ({
        async get() {
          return {
            empty: docs.length === 0,
            docs,
          }
        },
      }),
    }
  }
}

class FakeBatch {
  constructor() {
    this.operations = []
  }

  set(ref, data) {
    this.operations.push({ ref, data })
  }

  async commit() {
    await Promise.all(this.operations.map((operation) => operation.ref.set(operation.data)))
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

  batch() {
    return new FakeBatch()
  }
}

test('provisionWorkspaceForSignup creates workspace profile and membership docs', async () => {
  const db = new FakeDb()

  const result = await provisionWorkspaceForSignup({
    uid: 'uid-1',
    email: 'owner@example.com',
    name: 'Owner User',
    company: 'Example Co',
    db,
  })

  assert.equal(result.workspace.name, 'Example Co')
  assert.equal(result.workspace.plan, 'starter')
  assert.equal(result.workspace.status, 'active')
  assert.equal(result.userProfile.workspaceId, result.workspace.id)
  assert.equal(result.userProfile.role, 'owner')

  const workspaceDocs = db.ensureCollection('workspaces')
  const profileDocs = db.ensureCollection('user_profiles')
  const memberDocs = db.ensureCollection('workspace_members')

  assert.equal(workspaceDocs.size, 1)
  assert.equal(profileDocs.get('uid-1')?.workspaceId, result.workspace.id)
  assert.equal(memberDocs.get(`${result.workspace.id}_uid-1`)?.role, 'owner')
})

test('provisionWorkspaceForSignup avoids slug collisions', async () => {
  const db = new FakeDb()

  await db.collection('workspaces').doc('existing').set({
    id: 'existing',
    slug: 'example-co',
  })

  const first = await provisionWorkspaceForSignup({
    uid: 'uid-2',
    email: 'owner2@example.com',
    name: 'Owner User 2',
    company: 'Example Co',
    db,
  })

  assert.notEqual(first.workspace.slug, 'example-co')
  assert.match(first.workspace.slug, /^example-co-/)
})

test('queueWelcomeEmail returns not queued when firebase db is unavailable', async () => {
  const result = await queueWelcomeEmail({
    user: { name: 'User', email: 'user@example.com' },
    workspace: { name: 'Example Co' },
    db: null,
  })

  assert.equal(result.queued, false)
  assert.equal(result.reason, 'firebase-admin-not-configured')
})

test('queueWelcomeEmail stores welcome payload in mail collection', async () => {
  const db = new FakeDb()

  const result = await queueWelcomeEmail({
    user: { name: 'Owner User', email: 'owner@example.com' },
    workspace: { id: 'ws-1', name: 'Example Co', plan: 'starter' },
    db,
    collectionName: 'mail',
  })

  assert.equal(result.queued, true)
  assert.equal(result.collectionName, 'mail')
  assert.ok(result.id)

  const docs = db.ensureCollection('mail')
  const payload = docs.get(result.id)

  assert.equal(payload.to[0], 'owner@example.com')
  assert.match(payload.message.subject, /welcome to tcn comply malta/i)
  assert.match(payload.message.text, /workspace: example co/i)
})
