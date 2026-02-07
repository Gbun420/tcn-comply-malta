import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminNoticesPage() {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: notices } = await supabase
    .from('dsa_notices')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">DSA notices</h1>
      <div className="grid gap-3">
        {(notices || []).map((n) => (
          <div key={n.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">{n.target_type}</div>
              <div className="text-xs text-slate-600">Status: {n.status}</div>
            </div>
            <div className="mt-2 text-sm">
              <div className="text-slate-600">Location:</div>
              <div className="break-words">{n.url_or_location}</div>
            </div>
            <div className="mt-2 text-sm">
              <div className="text-slate-600">Reason:</div>
              <div className="whitespace-pre-wrap">{n.reason}</div>
            </div>
            <form
              className="mt-3 flex flex-wrap gap-2"
              action="/admin/notices/decide"
              method="post"
            >
              <input type="hidden" name="id" value={n.id} />
              <select
                className="rounded-md border px-3 py-2 text-sm"
                name="status"
                defaultValue={n.status}
              >
                <option value="open">open</option>
                <option value="actioned">actioned</option>
                <option value="rejected">rejected</option>
              </select>
              <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
                Update
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
