function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export function getSupabaseUrl(): string {
  return requireEnv('NEXT_PUBLIC_SUPABASE_URL')
}

export function getSupabaseAnonKey(): string {
  return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY')
}

export function getEvidenceBucket(): string {
  return process.env.MWV_EVIDENCE_BUCKET || 'evidence_private'
}

export function getEvidenceUrlTtlSeconds(): number {
  const raw = process.env.MWV_EVIDENCE_URL_TTL_SECONDS || '600'
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return 600
  return parsed
}

export function getEvidenceDefaultTtlDays(): number {
  const raw = process.env.MWV_EVIDENCE_DEFAULT_TTL_DAYS || '30'
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return 30
  return parsed
}
