import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

let db = null

export function getDb() {
  if (db) return db

  const projectId = process.env.FIREBASE_PROJECT_ID
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

  if (!projectId || !privateKey || !clientEmail) {
    return null
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail,
      }),
    })
  }

  try {
    db = getFirestore()
  } catch (error) {
    console.warn('Firestore init failed:', error.message)
    return null
  }

  return db
}
