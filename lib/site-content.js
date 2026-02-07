export const SITE_NAME = 'TCN Comply Malta'

function normalizeEmail(value) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizePhoneDisplay(value) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  return trimmed.startsWith('+') ? trimmed : `+${trimmed}`
}

function toTelHref(phone) {
  if (!phone) {
    return null
  }

  const normalized = phone.replace(/[^\d+]/g, '')
  return normalized ? `tel:${normalized}` : null
}

export const SITE_CONTACT_EMAIL = normalizeEmail(process.env.NEXT_PUBLIC_SUPPORT_EMAIL)
export const SITE_CONTACT_PHONE = normalizePhoneDisplay(process.env.NEXT_PUBLIC_SUPPORT_PHONE)
export const SITE_CONTACT_PHONE_HREF = toTelHref(SITE_CONTACT_PHONE)
export const SITE_CONTACT_LOCATION = 'Malta'
export const SITE_SUPPORT_TAGLINE = 'Compliance operations platform for Maltese employers'
