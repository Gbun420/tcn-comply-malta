import test from 'node:test'
import assert from 'node:assert/strict'
import { isFirebaseConfigured } from '../lib/auth.js'

test('firebase config helper reports missing config', () => {
  assert.equal(isFirebaseConfigured({}), false)
})
