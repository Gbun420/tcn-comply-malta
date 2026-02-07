import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminEmployersPage() {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: claims } = await supabase
    .from('employer_claims')
    .select('id, employer_id, requester_user_id, domain_email, status, notes, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Employer claims</h1>
      <div className="grid gap-3">
        {(claims || []).map((c) => (
          <div key={c.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">Claim {c.id.slice(0, 8)}</div>
              <div className="text-xs text-slate-600">Status: {c.status}</div>
            </div>
            <div className="mt-2 text-sm text-slate-700">Employer: {c.employer_id}</div>
            <div className="mt-1 text-sm text-slate-700">Requester: {c.requester_user_id}</div>
            <div className="mt-1 text-sm text-slate-700">Domain email: {c.domain_email}</div>
            <form
              className="mt-3 flex flex-wrap gap-2"
              action="/admin/employers/decide"
              method="post"
            >
              <input type="hidden" name="id" value={c.id} />
              <select
                className="rounded-md border px-3 py-2 text-sm"
                name="decision"
                defaultValue="approve"
              >
                <option value="approve">approve</option>
                <option value="deny">deny</option>
              </select>
              <input
                className="rounded-md border px-3 py-2 text-sm"
                name="notes"
                placeholder="Notes (optional)"
              />
              <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
                Submit
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
