import crypto from 'node:crypto'
import { requireFirebaseAdminDb } from '../firebase-admin.js'

function toTimestamp() {
  return new Date().toISOString()
}

function slugifyCompanyName(company) {
  const base = (company || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  if (!base) {
    return `workspace-${crypto.randomBytes(2).toString('hex')}`
  }

  return base.slice(0, 48)
}

async function createUniqueWorkspaceSlug(db, companyName) {
  const base = slugifyCompanyName(companyName)
  let candidate = base

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const snapshot = await db.collection('workspaces').where('slug', '==', candidate).limit(1).get()
    if (snapshot.empty) {
      return candidate
    }

    candidate = `${base}-${crypto.randomBytes(2).toString('hex')}`
  }

  return `${base}-${Date.now().toString(36)}`
}

export async function provisionWorkspaceForSignup({ uid, email, name, company }) {
  if (!uid || !email || !company) {
    throw new Error('uid, email, and company are required for workspace provisioning')
  }

  const db = requireFirebaseAdminDb()
  const now = toTimestamp()
  const workspaceRef = db.collection('workspaces').doc()
  const workspaceId = workspaceRef.id
  const workspaceSlug = await createUniqueWorkspaceSlug(db, company)

  const workspace = {
    id: workspaceId,
    name: company,
    slug: workspaceSlug,
    ownerUid: uid,
    plan: 'starter',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }

  const userProfile = {
    uid,
    email,
    name: name || email.split('@')[0] || 'User',
    company,
    workspaceId,
    role: 'owner',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  }

  const memberId = `${workspaceId}_${uid}`
  const workspaceMember = {
    id: memberId,
    workspaceId,
    uid,
    role: 'owner',
    createdAt: now,
  }

  const batch = db.batch()
  batch.set(workspaceRef, workspace)
  batch.set(db.collection('user_profiles').doc(uid), userProfile)
  batch.set(db.collection('workspace_members').doc(memberId), workspaceMember)
  await batch.commit()

  return { workspace, userProfile }
}
