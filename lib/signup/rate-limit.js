import crypto from 'node:crypto'
import { getFirebaseAdminDb } from '../firebase-admin.js'

const DEFAULT_WINDOW_SECONDS = 900
const DEFAULT_MAX_ATTEMPTS = 5

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || '', 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

function toMillisFromIso(value) {
  if (!value) {
    return 0
  }

  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) {
    return 0
  }

  return parsed
}

function toIso(timestamp) {
  return new Date(timestamp).toISOString()
}

export function getSignupRateLimitConfig() {
  return {
    windowSeconds: toPositiveInt(
      process.env.SIGNUP_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_WINDOW_SECONDS
    ),
    maxAttempts: toPositiveInt(process.env.SIGNUP_RATE_LIMIT_MAX_ATTEMPTS, DEFAULT_MAX_ATTEMPTS),
  }
}

export function extractRequestIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim()
    if (first) {
      return first
    }
  }

  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp
  }

  return 'unknown'
}

export function buildSignupRateLimitKey({ email, ip }) {
  const normalizedEmail = (email || '').trim().toLowerCase()
  const normalizedIp = (ip || '').trim()

  return crypto.createHash('sha256').update(`${normalizedEmail}|${normalizedIp}`).digest('hex')
}

export async function enforceSignupRateLimit({ request, email }) {
  if (!email) {
    return {
      allowed: false,
      status: 400,
      error: 'Email is required',
    }
  }

  const db = getFirebaseAdminDb()
  if (!db) {
    return {
      allowed: false,
      status: 503,
      error: 'Signup protection is unavailable',
    }
  }

  const { windowSeconds, maxAttempts } = getSignupRateLimitConfig()
  const windowMs = windowSeconds * 1000
  const now = Date.now()
  const ip = extractRequestIp(request)
  const key = buildSignupRateLimitKey({ email, ip })
  const ref = db.collection('signup_rate_limits').doc(key)

  let outcome = {
    allowed: true,
    key,
  }

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref)

    if (!snapshot.exists) {
      transaction.set(ref, {
        key,
        count: 1,
        windowStartedAt: toIso(now),
        blockedUntil: null,
        expiresAt: toIso(now + windowMs),
      })
      return
    }

    const data = snapshot.data() || {}
    const blockedUntilMs = toMillisFromIso(data.blockedUntil)
    if (blockedUntilMs > now) {
      outcome = {
        allowed: false,
        status: 429,
        error: 'Too many signup attempts. Please try again shortly.',
        retryAfterSeconds: Math.ceil((blockedUntilMs - now) / 1000),
      }
      return
    }

    const windowStartedAtMs = toMillisFromIso(data.windowStartedAt)
    const count = Number.isFinite(data.count) ? data.count : 0
    const inWindow = windowStartedAtMs > 0 && now - windowStartedAtMs < windowMs

    if (!inWindow) {
      transaction.set(
        ref,
        {
          key,
          count: 1,
          windowStartedAt: toIso(now),
          blockedUntil: null,
          expiresAt: toIso(now + windowMs),
        },
        { merge: true }
      )
      return
    }

    const nextCount = count + 1
    if (nextCount > maxAttempts) {
      const blockedUntil = now + windowMs
      transaction.set(
        ref,
        {
          key,
          count: nextCount,
          blockedUntil: toIso(blockedUntil),
          expiresAt: toIso(blockedUntil),
        },
        { merge: true }
      )

      outcome = {
        allowed: false,
        status: 429,
        error: 'Too many signup attempts. Please try again shortly.',
        retryAfterSeconds: windowSeconds,
      }
      return
    }

    transaction.set(
      ref,
      {
        key,
        count: nextCount,
        expiresAt: toIso(now + windowMs),
      },
      { merge: true }
    )
  })

  return outcome
}
