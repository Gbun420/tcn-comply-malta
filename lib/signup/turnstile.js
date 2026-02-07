const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export function getTurnstileConfig() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
  const secretKey = process.env.TURNSTILE_SECRET_KEY || ''

  return {
    siteKey,
    secretKey,
    enabled: secretKey.trim().length > 0,
  }
}

export async function verifyTurnstileToken({ token, remoteIp }) {
  if (!token) {
    return {
      success: false,
      reason: 'turnstile-token-missing',
      errorCodes: ['missing-input-response'],
    }
  }

  const { secretKey, enabled } = getTurnstileConfig()
  if (!enabled) {
    return {
      success: false,
      reason: 'turnstile-secret-missing',
      errorCodes: ['missing-input-secret'],
    }
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  })

  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!response.ok) {
      return {
        success: false,
        reason: 'turnstile-http-error',
        errorCodes: [`http-${response.status}`],
      }
    }

    const payload = await response.json()
    if (payload.success) {
      return {
        success: true,
        reason: 'ok',
        errorCodes: [],
      }
    }

    return {
      success: false,
      reason: 'turnstile-rejected',
      errorCodes: payload['error-codes'] || [],
    }
  } catch {
    return {
      success: false,
      reason: 'turnstile-network-error',
      errorCodes: ['network-error'],
    }
  }
}
