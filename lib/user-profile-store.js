import { getFirebaseAdminDb, requireFirebaseAdminDb } from './firebase-admin.js'

function timestamp() {
  return new Date().toISOString()
}

export async function getUserProfileByUid(uid) {
  if (!uid) {
    return null
  }

  const db = getFirebaseAdminDb()
  if (!db) {
    return null
  }

  const snapshot = await db.collection('user_profiles').doc(uid).get()
  if (!snapshot.exists) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export async function upsertUserProfile(profile) {
  if (!profile?.uid) {
    throw new Error('uid is required')
  }

  const db = requireFirebaseAdminDb()
  const now = timestamp()
  const ref = db.collection('user_profiles').doc(profile.uid)
  await ref.set(
    {
      uid: profile.uid,
      email: profile.email || '',
      name: profile.name || '',
      company: profile.company || '',
      workspaceId: profile.workspaceId || '',
      role: profile.role || 'employer',
      status: profile.status || 'active',
      createdAt: profile.createdAt || now,
      updatedAt: now,
      lastLoginAt: profile.lastLoginAt || null,
    },
    { merge: true }
  )
}

export async function updateUserProfileLastLogin(uid) {
  if (!uid) {
    return
  }

  const db = getFirebaseAdminDb()
  if (!db) {
    return
  }

  await db.collection('user_profiles').doc(uid).set(
    {
      lastLoginAt: timestamp(),
      updatedAt: timestamp(),
    },
    { merge: true }
  )
}
