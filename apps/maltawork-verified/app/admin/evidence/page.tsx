import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { EvidenceRow } from '@/app/admin/evidence/row'

export const dynamic = 'force-dynamic'

export default async function AdminEvidencePage() {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: rows, error } = await supabase
    .from('review_evidence')
    .select(
      'id, review_id, uploader_user_id, evidence_type, status, storage_path, expires_at, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return <p className="text-sm text-red-700">Error: {error.message}</p>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Evidence vault</h1>
      <p className="text-sm text-slate-700">
        Only Admin can access evidence via signed URLs. Viewing and decisions are audit-logged.
        Evidence should be deleted after decision or expiration.
      </p>
      <div className="grid gap-3">
        {(rows || []).map((r) => (
          <EvidenceRow key={r.id} row={r} />
        ))}
      </div>
    </div>
  )
}
