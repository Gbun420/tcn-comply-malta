const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
const URL_RE = /\bhttps?:\/\/[^\s]+/gi
const PHONE_RE = /(\+?\d[\d\s().-]{6,}\d)/g

// Best-effort: redact likely proper names (capitalized words not at sentence start).
// This is intentionally conservative and will miss names; admin must still review.
const NAME_CANDIDATE_RE = /(^|[.!?]\s+)([A-Z][a-z]{2,})(\s+[A-Z][a-z]{2,})+/g

export function redactText(raw: string): string {
  let out = (raw || '').trim()
  if (!out) return ''

  out = out.replace(EMAIL_RE, '[redacted]')
  out = out.replace(URL_RE, '[redacted]')
  out = out.replace(PHONE_RE, '[redacted]')
  out = out.replace(NAME_CANDIDATE_RE, (m) => m.replace(/[A-Z][a-z]{2,}/g, '[redacted]'))

  return out
}
