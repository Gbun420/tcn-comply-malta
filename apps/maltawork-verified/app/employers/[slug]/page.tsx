import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabasePublicClient } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

type ReviewRow = {
  id: string
  overall: number
  management: number
  worklife: number
  pay_fairness: number
  narrative_redacted: string | null
  published_at: string | null
}

export default async function EmployerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createSupabasePublicClient()

  const { data: employer } = await supabase
    .from('employers_public_view')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!employer) notFound()

  const { data: reviews } = await supabase
    .from('published_reviews_public_view')
    .select('id, overall, management, worklife, pay_fairness, narrative_redacted, published_at')
    .eq('employer_id', employer.id)
    .order('published_at', { ascending: false })
    .limit(20)

  const { data: jobs } = await supabase
    .from('published_jobs_public_view')
    .select('id, title, slug, location, remote_type, employment_type, created_at')
    .eq('employer_id', employer.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const r = (reviews || []) as ReviewRow[]
  const avg = (k: keyof ReviewRow) =>
    r.length
      ? Math.round((r.reduce((acc, x) => acc + Number(x[k] || 0), 0) / r.length) * 10) / 10
      : null

  return (
    <div className="space-y-6">
      <Link href="/employers" className="text-sm underline">
        Back to employers
      </Link>
      <section className="rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">{employer.name}</h1>
          <div className="text-xs text-slate-600">
            {employer.verified_status === 'verified' ? 'Verified employer' : 'Unverified employer'}
          </div>
        </div>
        <div className="mt-2 text-sm text-slate-700">
          {employer.industry || '—'} · {employer.size || '—'}
        </div>
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-600">Overall</div>
            <div className="text-lg font-semibold">{avg('overall') ?? '—'}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-600">Management</div>
            <div className="text-lg font-semibold">{avg('management') ?? '—'}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-600">Work-life</div>
            <div className="text-lg font-semibold">{avg('worklife') ?? '—'}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs text-slate-600">Pay fairness</div>
            <div className="text-lg font-semibold">{avg('pay_fairness') ?? '—'}</div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Open jobs</h2>
        <div className="grid gap-3">
          {(jobs || []).map((j) => (
            <Link
              key={j.id}
              href={`/jobs/${j.slug}`}
              className="rounded-xl border p-4 hover:bg-slate-50"
            >
              <div className="font-medium">{j.title}</div>
              <div className="mt-1 text-sm text-slate-700">
                {j.location} · {j.remote_type} · {j.employment_type}
              </div>
            </Link>
          ))}
          {(jobs || []).length === 0 ? (
            <p className="text-sm text-slate-600">No open jobs.</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Published reviews</h2>
          <Link href="/reviews/new" className="text-sm underline">
            Write a review
          </Link>
        </div>
        <div className="grid gap-3">
          {r.map((rev) => (
            <div key={rev.id} className="rounded-xl border p-4">
              <div className="text-sm text-slate-700">
                Overall: <span className="font-medium">{rev.overall}</span> · Management:{' '}
                <span className="font-medium">{rev.management}</span> · Work-life:{' '}
                <span className="font-medium">{rev.worklife}</span> · Pay:{' '}
                <span className="font-medium">{rev.pay_fairness}</span>
              </div>
              {rev.narrative_redacted ? (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {rev.narrative_redacted}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No narrative provided.</p>
              )}
              <p className="mt-2 text-xs text-slate-600">
                Safety: Reviewer identity and raw text are never shown publicly.
              </p>
            </div>
          ))}
          {r.length === 0 ? (
            <p className="text-sm text-slate-600">No published reviews yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
