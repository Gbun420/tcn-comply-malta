import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const FIREBASE_PLACEHOLDER_PATTERNS = [/your-/i, /example\.com/i]

function normalizePrivateKey(value) {
  if (!value) {
    return null
  }

  return value.replace(/\\n/g, '\n')
}

function isPlaceholder(value) {
  if (!value) {
    return true
  }

  return FIREBASE_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value))
}

export function getFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)

  if (isPlaceholder(projectId) || isPlaceholder(clientEmail) || isPlaceholder(privateKey)) {
    return null
  }

  return { projectId, clientEmail, privateKey }
}

export function hasFirebaseAdminConfig() {
  return Boolean(getFirebaseAdminConfig())
}

export function getFirebaseAdminApp() {
  const config = getFirebaseAdminConfig()
  if (!config) {
    return null
  }

  if (getApps().length > 0) {
    return getApps()[0]
  }

  return initializeApp({
    credential: cert(config),
  })
}

export function getFirebaseAdminDb() {
  const app = getFirebaseAdminApp()
  if (!app) {
    return null
  }

  return getFirestore(app)
}

export function getFirebaseAdminAuth() {
  const app = getFirebaseAdminApp()
  if (!app) {
    return null
  }

  return getAuth(app)
}

export function requireFirebaseAdminDb() {
  const db = getFirebaseAdminDb()
  if (!db) {
    throw new Error('Firebase admin is not configured')
  }

  return db
}
