import Link from 'next/link'
import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EmployerJobsPage() {
  const { user } = await requireEmployerOrAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: employer } = await supabase
    .from('employers')
    .select('id, name')
    .eq('owner_user_id', user.id)
    .maybeSingle()
  if (!employer) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Jobs</h1>
        <p className="text-sm text-slate-700">No employer linked to your account yet.</p>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/employer/onboarding">
          Claim employer
        </Link>
      </div>
    )
  }

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, slug, status, moderation_status, created_at')
    .eq('employer_id', employer.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Jobs ({employer.name})</h1>
        <Link
          className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
          href="/employer/jobs/new"
        >
          New job
        </Link>
      </div>
      <div className="grid gap-3">
        {(jobs || []).map((j) => (
          <div key={j.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">{j.title}</div>
              <div className="text-xs text-slate-600">
                {j.status} · {j.moderation_status}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link className="rounded-md border px-3 py-2 text-sm" href={`/jobs/${j.slug}`}>
                View public
              </Link>
              <Link
                className="rounded-md border px-3 py-2 text-sm"
                href={`/employer/jobs/${j.id}/applicants`}
              >
                Applicants
              </Link>
            </div>
          </div>
        ))}
        {(jobs || []).length === 0 ? <p className="text-sm text-slate-600">No jobs yet.</p> : null}
      </div>
      <p className="text-xs text-slate-600">
        Safety: Admin can remove or temporarily hide any job at any time, even if you publish it.
      </p>
    </div>
  )
}
