import Link from 'next/link'
import { createSupabasePublicClient } from '@/lib/supabase/public'
import { MALTA_LOCALITIES, REMOTE_TYPES, EMPLOYMENT_TYPES } from '@/lib/malta'

export const dynamic = 'force-dynamic'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  const location = typeof sp.location === 'string' ? sp.location : ''
  const remote_type = typeof sp.remote_type === 'string' ? sp.remote_type : ''
  const employment_type = typeof sp.employment_type === 'string' ? sp.employment_type : ''
  const category = typeof sp.category === 'string' ? sp.category : ''

  const supabase = createSupabasePublicClient()
  let query = supabase
    .from('published_jobs_public_view')
    .select(
      'id, employer_id, title, slug, location, remote_type, employment_type, category, salary_min, salary_max, currency, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(50)

  if (q) query = query.ilike('title', `%${q}%`)
  if (location) query = query.eq('location', location)
  if (remote_type) query = query.eq('remote_type', remote_type)
  if (employment_type) query = query.eq('employment_type', employment_type)
  if (category) query = query.eq('category', category)

  const { data: jobs, error } = await query

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">Jobs</h1>
      <form className="grid gap-3 rounded-xl border p-4 md:grid-cols-5" action="/jobs">
        <input
          className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          name="q"
          placeholder="Search job titles…"
          defaultValue={q}
        />
        <select
          className="rounded-md border px-3 py-2 text-sm"
          name="location"
          defaultValue={location}
        >
          <option value="">All locations</option>
          {MALTA_LOCALITIES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border px-3 py-2 text-sm"
          name="remote_type"
          defaultValue={remote_type}
        >
          <option value="">Any</option>
          {REMOTE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border px-3 py-2 text-sm"
          name="employment_type"
          defaultValue={employment_type}
        >
          <option value="">Any</option>
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          className="rounded-md border px-3 py-2 text-sm md:col-span-5"
          name="category"
          placeholder="Category (e.g. Engineering)"
          defaultValue={category}
        />
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white md:col-span-5">
          Search
        </button>
      </form>

      {error ? <p className="text-sm text-red-700">Error loading jobs: {error.message}</p> : null}
      <div className="grid gap-3">
        {(jobs || []).map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="rounded-xl border p-4 hover:bg-slate-50"
          >
            <div className="font-medium">{job.title}</div>
            <div className="mt-1 text-sm text-slate-700">
              {job.location} · {job.remote_type} · {job.employment_type}
            </div>
            <div className="mt-1 text-xs text-slate-600">
              {job.category}
              {job.salary_min || job.salary_max ? (
                <>
                  {' '}
                  · {job.currency} {job.salary_min ?? '—'}-{job.salary_max ?? '—'}
                </>
              ) : null}
            </div>
          </Link>
        ))}
        {!error && (jobs || []).length === 0 ? (
          <p className="text-sm text-slate-600">No jobs found.</p>
        ) : null}
      </div>
    </div>
  )
}
