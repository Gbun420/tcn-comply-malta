import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminAppealsPage() {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: appeals } = await supabase
    .from('dsa_complaints')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Appeals / complaints</h1>
      <div className="grid gap-3">
        {(appeals || []).map((a) => (
          <div key={a.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">{a.target_type}</div>
              <div className="text-xs text-slate-600">Status: {a.status}</div>
            </div>
            <div className="mt-2 whitespace-pre-wrap text-sm">{a.complaint}</div>
            <form
              className="mt-3 flex flex-wrap gap-2"
              action="/admin/appeals/decide"
              method="post"
            >
              <input type="hidden" name="id" value={a.id} />
              <select
                className="rounded-md border px-3 py-2 text-sm"
                name="status"
                defaultValue={a.status}
              >
                <option value="open">open</option>
                <option value="upheld">upheld</option>
                <option value="denied">denied</option>
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
