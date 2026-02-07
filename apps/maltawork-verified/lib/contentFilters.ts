const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
const URL_RE = /\bhttps?:\/\/[^\s]+/i
// Best-effort phone detection (international + local), intentionally broad.
const PHONE_RE = /(\+?\d[\d\s().-]{6,}\d)/i

export function assertNarrativeAllowed(text: string) {
  const trimmed = (text || '').trim()
  if (!trimmed) return
  if (trimmed.length > 1200) throw new Error('Narrative must be 1200 characters or fewer.')
  if (EMAIL_RE.test(trimmed)) throw new Error('Please remove email addresses from your narrative.')
  if (URL_RE.test(trimmed)) throw new Error('Please remove URLs/links from your narrative.')
  if (PHONE_RE.test(trimmed)) throw new Error('Please remove phone numbers from your narrative.')
}
