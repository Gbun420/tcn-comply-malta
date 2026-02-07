import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { getEvidenceBucket } from '@/lib/env'

async function main() {
  const supabase = createSupabaseServiceClient()
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
