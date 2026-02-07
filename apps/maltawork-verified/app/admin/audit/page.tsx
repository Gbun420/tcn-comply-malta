import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminAuditPage() {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: logs, error } = await supabase
    .from('audit_log')
    .select('id, actor_user_id, action, entity, entity_id, meta, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return <p className="text-sm text-red-700">Error: {error.message}</p>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Audit log</h1>
      <div className="grid gap-2">
        {(logs || []).map((l) => (
          <div key={l.id} className="rounded-xl border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">
                {l.action} · {l.entity}
              </div>
              <div className="text-xs text-slate-600">
                {new Date(l.created_at).toLocaleString()}
              </div>
            </div>
            <div className="mt-1 text-xs text-slate-600">actor: {l.actor_user_id || '—'}</div>
            <pre className="mt-2 overflow-x-auto rounded-md bg-slate-50 p-2 text-xs">
              {JSON.stringify(l.meta, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
