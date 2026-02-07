import { createSupabasePublicClient } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

export default async function TransparencyPage() {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('mwv_transparency_counts_view')
    .select('*')
    .maybeSingle()

  if (error) {
    return (
      <p className="text-sm text-red-700">Error loading transparency metrics: {error.message}</p>
    )
  }

  const v = data || {}

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Moderation Transparency</h1>
      <p className="text-sm text-slate-700">
        Aggregated counts of notices, actions, complaints, and moderation decisions. No personal
        data is shown.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Notices (open)</div>
          <div className="text-2xl font-semibold">{v.notices_open ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Notices (actioned)</div>
          <div className="text-2xl font-semibold">{v.notices_actioned ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Notices (rejected)</div>
          <div className="text-2xl font-semibold">{v.notices_rejected ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Complaints (open)</div>
          <div className="text-2xl font-semibold">{v.complaints_open ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Complaints (upheld)</div>
          <div className="text-2xl font-semibold">{v.complaints_upheld ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Complaints (denied)</div>
          <div className="text-2xl font-semibold">{v.complaints_denied ?? 0}</div>
        </div>
      </div>
      <div className="rounded-xl border p-4">
        <div className="text-xs text-slate-600">Moderation decisions</div>
        <div className="mt-2 grid gap-2 text-sm md:grid-cols-3">
          <div>Publish: {v.decisions_publish ?? 0}</div>
          <div>Reject: {v.decisions_reject ?? 0}</div>
          <div>Needs changes: {v.decisions_needs_changes ?? 0}</div>
          <div>Remove: {v.decisions_remove ?? 0}</div>
          <div>Temp hide: {v.decisions_temp_hide ?? 0}</div>
          <div>Restore: {v.decisions_restore ?? 0}</div>
        </div>
      </div>
    </div>
  )
}
