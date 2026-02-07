import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminJobsPage() {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, slug, status, moderation_status, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Jobs moderation</h1>
      <div className="grid gap-3">
        {(jobs || []).map((j) => (
          <div key={j.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">{j.title}</div>
              <div className="text-xs text-slate-600">
                {j.status} · {j.moderation_status}
              </div>
            </div>
            <form
              className="mt-3 grid gap-2 rounded-lg bg-slate-50 p-3"
              action="/admin/jobs/decide"
              method="post"
            >
              <input type="hidden" name="id" value={j.id} />
              <div className="grid gap-2 md:grid-cols-3">
                <label className="text-xs">
                  Action
                  <select
                    className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                    name="action"
                    defaultValue="temp_hide"
                  >
                    <option value="temp_hide">temp_hide</option>
                    <option value="remove">remove</option>
                    <option value="restore">restore</option>
                  </select>
                </label>
                <label className="text-xs">
                  Basis
                  <select
                    className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                    name="basis"
                    defaultValue="policy_violation"
                  >
                    <option value="illegal_content">illegal_content</option>
                    <option value="policy_violation">policy_violation</option>
                  </select>
                </label>
                <label className="text-xs">
                  Scope
                  <input
                    className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                    name="scope"
                    defaultValue="platform"
                  />
                </label>
              </div>
              <label className="text-xs">
                Explanation
                <textarea
                  className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                  name="explanation"
                  rows={2}
                  required
                />
              </label>
              <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
                Submit decision
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
