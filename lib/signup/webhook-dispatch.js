import crypto from 'node:crypto'
import { getFirebaseAdminDb } from '../firebase-admin.js'

const DEFAULT_TIMEOUT_MS = 4000
const DEFAULT_MAX_RETRIES = 8
const DEFAULT_QUEUE_COLLECTION = 'signup_webhook_queue'
const EVENT_TYPE_SIGNUP_CREATED = 'signup.created'

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || '', 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

function toIso(value = new Date()) {
  return new Date(value).toISOString()
}

function toMillis(value) {
  if (!value) {
    return 0
  }

  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function computeNextAttemptAt({ nowMs, attempts }) {
  const step = Math.max(1, attempts)
  const delaySeconds = Math.min(3600, 30 * 2 ** (step - 1))
  return new Date(nowMs + delaySeconds * 1000).toISOString()
}

function sanitizeUser(user) {
  return {
    uid: user?.uid || '',
    email: user?.email || '',
    name: user?.name || '',
    role: user?.role || '',
    company: user?.company || '',
    workspaceId: user?.workspaceId || '',
  }
}

function sanitizeWorkspace(workspace) {
  return {
    id: workspace?.id || '',
    name: workspace?.name || '',
    slug: workspace?.slug || '',
    plan: workspace?.plan || '',
    status: workspace?.status || '',
  }
}

function buildSignupCreatedEvent({ user, workspace, now = new Date() }) {
  const createdAt = toIso(now)
  return {
    id: crypto.randomUUID(),
    eventType: EVENT_TYPE_SIGNUP_CREATED,
    createdAt,
    user: sanitizeUser(user),
    workspace: sanitizeWorkspace(workspace),
  }
}

export function getSignupWebhookConfig() {
  return {
    url: process.env.SIGNUP_WEBHOOK_URL || '',
    signingSecret: process.env.SIGNUP_WEBHOOK_SIGNING_SECRET || '',
    timeoutMs: toPositiveInt(process.env.SIGNUP_WEBHOOK_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    maxRetries: toPositiveInt(process.env.SIGNUP_WEBHOOK_MAX_RETRIES, DEFAULT_MAX_RETRIES),
    queueCollection: DEFAULT_QUEUE_COLLECTION,
  }
}

export function signWebhookPayload(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

async function sendWebhook({
  targetUrl,
  payload,
  signature,
  eventType,
  eventId,
  timeoutMs,
  fetchImpl,
}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchImpl(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signup-signature': signature,
        'x-signup-event': eventType,
        'x-signup-event-id': eventId,
      },
      body: payload,
      signal: controller.signal,
    })

    if (response.ok) {
      return { ok: true, status: response.status }
    }

    return {
      ok: false,
      status: response.status,
      error: `http-${response.status}`,
    }
  } catch (error) {
    if (error?.name === 'AbortError') {
      return { ok: false, status: 0, error: 'timeout' }
    }

    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function enqueueFailedWebhook({
  db,
  queueCollection,
  event,
  payload,
  signature,
  targetUrl,
  attempts,
  maxAttempts,
  error,
  now,
}) {
  if (!db) {
    return { queued: false, reason: 'firebase-admin-not-configured' }
  }

  const nowIso = toIso(now)
  const nowMs = toMillis(nowIso)
  const status = attempts >= maxAttempts ? 'dead_letter' : 'pending'
  const nextAttemptAt = computeNextAttemptAt({ nowMs, attempts })

  await db
    .collection(queueCollection)
    .doc(event.id)
    .set({
      id: event.id,
      eventType: event.eventType,
      targetUrl,
      payload: JSON.parse(payload),
      signature,
      attempts,
      maxAttempts,
      nextAttemptAt,
      status,
      lastError: error || null,
      createdAt: nowIso,
      updatedAt: nowIso,
    })

  return { queued: true, status }
}

export async function dispatchSignupCreatedWebhook({
  user,
  workspace,
  db = getFirebaseAdminDb(),
  config = getSignupWebhookConfig(),
  fetchImpl = fetch,
  now = new Date(),
}) {
  if (!config.url || !config.signingSecret) {
    return {
      delivered: false,
      queued: false,
      skipped: true,
      reason: 'webhook-not-configured',
    }
  }

  const event = buildSignupCreatedEvent({ user, workspace, now })
  const payload = JSON.stringify(event)
  const signature = signWebhookPayload(payload, config.signingSecret)

  const delivery = await sendWebhook({
    targetUrl: config.url,
    payload,
    signature,
    eventType: event.eventType,
    eventId: event.id,
    timeoutMs: config.timeoutMs,
    fetchImpl,
  })

  if (delivery.ok) {
    return {
      delivered: true,
      queued: false,
      eventId: event.id,
      status: delivery.status,
    }
  }

  const queued = await enqueueFailedWebhook({
    db,
    queueCollection: config.queueCollection || DEFAULT_QUEUE_COLLECTION,
    event,
    payload,
    signature,
    targetUrl: config.url,
    attempts: 1,
    maxAttempts: config.maxRetries,
    error: delivery.error,
    now,
  })

  return {
    delivered: false,
    queued: queued.queued,
    eventId: event.id,
    reason: delivery.error,
  }
}

export async function processSignupWebhookQueue({
  db = getFirebaseAdminDb(),
  config = getSignupWebhookConfig(),
  fetchImpl = fetch,
  now = new Date(),
  limit = 25,
}) {
  const summary = {
    processed: 0,
    delivered: 0,
    retried: 0,
    deadLettered: 0,
    skipped: 0,
  }

  if (!db) {
    return {
      ...summary,
      error: 'firebase-admin-not-configured',
    }
  }

  if (!config.url || !config.signingSecret) {
    return {
      ...summary,
      error: 'webhook-not-configured',
    }
  }

  const nowIso = toIso(now)
  const nowMs = toMillis(nowIso)
  const snapshot = await db
    .collection(config.queueCollection || DEFAULT_QUEUE_COLLECTION)
    .limit(limit)
    .get()

  for (const doc of snapshot.docs || []) {
    const record = doc.data() || {}
    if (!['pending', 'retrying'].includes(record.status)) {
      summary.skipped += 1
      continue
    }

    const dueAtMs = toMillis(record.nextAttemptAt || record.createdAt)
    if (dueAtMs > nowMs) {
      summary.skipped += 1
      continue
    }

    summary.processed += 1

    const payloadString = JSON.stringify(record.payload || {})
    const signature = record.signature || signWebhookPayload(payloadString, config.signingSecret)
    const attempts = Number.isFinite(record.attempts) ? record.attempts : 0
    const maxAttempts = Number.isFinite(record.maxAttempts) ? record.maxAttempts : config.maxRetries

    const delivery = await sendWebhook({
      targetUrl: record.targetUrl || config.url,
      payload: payloadString,
      signature,
      eventType: record.eventType || EVENT_TYPE_SIGNUP_CREATED,
      eventId: record.id || doc.id,
      timeoutMs: config.timeoutMs,
      fetchImpl,
    })

    if (delivery.ok) {
      await doc.ref.set(
        {
          attempts: attempts + 1,
          status: 'delivered',
          lastError: null,
          deliveredAt: nowIso,
          updatedAt: nowIso,
        },
        { merge: true },
      )
      summary.delivered += 1
      continue
    }

    const nextAttempts = attempts + 1
    if (nextAttempts >= maxAttempts) {
      await doc.ref.set(
        {
          attempts: nextAttempts,
          status: 'dead_letter',
          lastError: delivery.error || 'delivery-failed',
          updatedAt: nowIso,
        },
        { merge: true },
      )
      summary.deadLettered += 1
      continue
    }

    await doc.ref.set(
      {
        attempts: nextAttempts,
        status: 'retrying',
        nextAttemptAt: computeNextAttemptAt({ nowMs, attempts: nextAttempts }),
        lastError: delivery.error || 'delivery-failed',
        updatedAt: nowIso,
      },
      { merge: true },
    )
    summary.retried += 1
  }

  return summary
}
