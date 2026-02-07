import { notFound } from 'next/navigation'
import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireEmployerOrAdmin()
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('id, title, employer_id')
    .eq('id', id)
    .maybeSingle()
  if (!job) notFound()

  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('id', job.employer_id)
    .eq('owner_user_id', user.id)
    .maybeSingle()
  if (!employer) notFound()

  const { data: apps } = await supabase
    .from('applications')
    .select('id, applicant_user_id, stage, cover_letter, created_at')
    .eq('job_id', job.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Applicants: {job.title}</h1>
      <div className="grid gap-3">
        {(apps || []).map((a) => (
          <div key={a.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-slate-700">
                Applicant {a.applicant_user_id.slice(0, 8)}
              </div>
              <div className="text-xs text-slate-600">Stage: {a.stage}</div>
            </div>
            {a.cover_letter ? (
              <p className="mt-2 whitespace-pre-wrap text-sm">{a.cover_letter}</p>
            ) : null}
            <form
              className="mt-3 flex flex-wrap gap-2"
              action={`/employer/jobs/${job.id}/applicants/${a.id}/stage`}
              method="post"
            >
              <select
                className="rounded-md border px-3 py-2 text-sm"
                name="stage"
                defaultValue={a.stage}
              >
                {['New', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Hired'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
                Update stage
              </button>
            </form>
          </div>
        ))}
        {(apps || []).length === 0 ? (
          <p className="text-sm text-slate-600">No applicants yet.</p>
        ) : null}
      </div>
    </div>
  )
}
