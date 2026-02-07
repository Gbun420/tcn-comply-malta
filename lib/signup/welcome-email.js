import { getFirebaseAdminDb } from '../firebase-admin.js'

const DEFAULT_EMAIL_COLLECTION = 'mail'

function sanitizeName(name, fallback) {
  const value = (name || '').trim()
  if (value) {
    return value
  }

  return fallback
}

function buildWelcomeEmailMessage({ user, workspace }) {
  const workspaceName = workspace?.name || user?.company || 'Your company workspace'
  const plan = workspace?.plan || 'starter'
  const recipientName = sanitizeName(user?.name, user?.email || 'there')

  return {
    subject: 'Welcome to TCN Comply Malta',
    text: [
      `Hi ${recipientName},`,
      '',
      'Your self-registration is complete.',
      `Workspace: ${workspaceName}`,
      `Plan: ${plan}`,
      '',
      'You can now sign in and begin onboarding your compliance records.',
      '',
      'Regards,',
      'TCN Comply Malta',
    ].join('\n'),
    html: [
      `<p>Hi ${recipientName},</p>`,
      '<p>Your self-registration is complete.</p>',
      `<p><strong>Workspace:</strong> ${workspaceName}<br/><strong>Plan:</strong> ${plan}</p>`,
      '<p>You can now sign in and begin onboarding your compliance records.</p>',
      '<p>Regards,<br/>TCN Comply Malta</p>',
    ].join(''),
  }
}

export function getWelcomeEmailCollectionName() {
  return process.env.FIREBASE_EMAIL_COLLECTION || DEFAULT_EMAIL_COLLECTION
}

export async function queueWelcomeEmail({
  user,
  workspace,
  db = getFirebaseAdminDb(),
  collectionName = getWelcomeEmailCollectionName(),
}) {
  const recipient = user?.email?.trim()
  if (!recipient) {
    return {
      queued: false,
      reason: 'recipient-missing',
    }
  }

  if (!db) {
    return {
      queued: false,
      reason: 'firebase-admin-not-configured',
    }
  }

  const payload = {
    to: [recipient],
    message: buildWelcomeEmailMessage({ user, workspace }),
    createdAt: new Date().toISOString(),
    metadata: {
      eventType: 'signup.welcome',
      workspaceId: workspace?.id || '',
      userId: user?.uid || '',
    },
  }

  try {
    const docRef = db.collection(collectionName).doc()
    await docRef.set(payload)

    return {
      queued: true,
      id: docRef.id,
      collectionName,
    }
  } catch (error) {
    return {
      queued: false,
      reason: 'queue-write-failed',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
