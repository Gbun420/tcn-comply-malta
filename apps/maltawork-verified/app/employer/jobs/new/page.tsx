import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { MALTA_LOCALITIES, REMOTE_TYPES, EMPLOYMENT_TYPES } from '@/lib/malta'

export const dynamic = 'force-dynamic'

export default async function NewJobPage() {
  const { user } = await requireEmployerOrAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: employer } = await supabase
    .from('employers')
    .select('id, name')
    .eq('owner_user_id', user.id)
    .maybeSingle()

  if (!employer) {
    return <p className="text-sm text-slate-700">No employer linked to your account.</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Post a job</h1>
      <form
        className="space-y-3 rounded-xl border p-4"
        action="/employer/jobs/new/submit"
        method="post"
      >
        <input type="hidden" name="employer_id" value={employer.id} />
        <label className="block text-sm">
          Title
          <input className="mt-1 w-full rounded-md border px-3 py-2" name="title" required />
        </label>
        <label className="block text-sm">
          Location
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="location" required>
            {MALTA_LOCALITIES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            Remote type
            <select className="mt-1 w-full rounded-md border px-3 py-2" name="remote_type" required>
              {REMOTE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Employment type
            <select
              className="mt-1 w-full rounded-md border px-3 py-2"
              name="employment_type"
              required
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm">
          Category
          <input className="mt-1 w-full rounded-md border px-3 py-2" name="category" required />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            Salary min (EUR)
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              name="salary_min"
              inputMode="numeric"
            />
          </label>
          <label className="block text-sm">
            Salary max (EUR)
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              name="salary_max"
              inputMode="numeric"
            />
          </label>
        </div>
        <label className="block text-sm">
          Description
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            name="description"
            rows={10}
            required
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="publish_now" /> Publish immediately
        </label>
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Create job</button>
      </form>
      <p className="text-xs text-slate-600">
        Jobs may be published by employers, but Admin can remove or temporarily hide any job.
      </p>
    </div>
  )
}
