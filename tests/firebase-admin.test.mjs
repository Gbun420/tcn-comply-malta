import assert from 'node:assert/strict'
import test from 'node:test'

import { getFirebaseAdminConfig, hasFirebaseAdminConfig } from '../lib/firebase-admin.js'
import { getUserProfileByUid } from '../lib/user-profile-store.js'

test('firebase admin config is unavailable when env vars are placeholders', () => {
  process.env.FIREBASE_PROJECT_ID = 'your-firebase-project-id'
  process.env.FIREBASE_CLIENT_EMAIL = 'your-firebase-client-email'
  process.env.FIREBASE_PRIVATE_KEY = 'your-firebase-private-key'

  assert.equal(hasFirebaseAdminConfig(), false)
  assert.equal(getFirebaseAdminConfig(), null)
})

test('firebase admin config normalizes escaped private key newlines', () => {
  process.env.FIREBASE_PROJECT_ID = 'tcn-comply-malta'
  process.env.FIREBASE_CLIENT_EMAIL =
    'firebase-adminsdk-xyz@tcn-comply-malta.iam.gserviceaccount.com'
  process.env.FIREBASE_PRIVATE_KEY =
    '-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n'

  const config = getFirebaseAdminConfig()
  assert.ok(config)
  assert.equal(config.projectId, 'tcn-comply-malta')
  assert.match(config.privateKey, /\n/)
})

test('user profile lookup gracefully returns null when admin firestore is not configured', async () => {
  process.env.FIREBASE_PROJECT_ID = ''
  process.env.FIREBASE_CLIENT_EMAIL = ''
  process.env.FIREBASE_PRIVATE_KEY = ''

  const profile = await getUserProfileByUid('missing-config')
  assert.equal(profile, null)
})
