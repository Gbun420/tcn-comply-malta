import { createClient } from '@supabase/supabase-js'

function requireEnv(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

function getEvidenceBucket(): string {
  return process.env.MWV_EVIDENCE_BUCKET || 'evidence_private'
}

async function main() {
  const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  const nowIso = new Date().toISOString()

  const { data: rows, error } = await supabase
    .from('review_evidence')
    .select('id, storage_path, status, expires_at')
    .neq('status', 'deleted')
    .lt('expires_at', nowIso)
    .limit(500)

  if (error) throw new Error(error.message)

  let deleted = 0
  for (const r of rows || []) {
    await supabase.storage.from(getEvidenceBucket()).remove([r.storage_path])
    await supabase.from('review_evidence').update({ status: 'deleted' }).eq('id', r.id)
    await supabase.from('audit_log').insert({
      actor_user_id: null,
      action: 'evidence_purged',
      entity: 'review_evidence',
      entity_id: r.id,
      meta: { previous_status: r.status },
    })
    deleted += 1
  }

  console.log(`Purged evidence rows: ${deleted}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
