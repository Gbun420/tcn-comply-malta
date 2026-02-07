import Script from 'next/script'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createSupabasePublicClient } from '@/lib/supabase/public'
import { getAuthedUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createSupabasePublicClient()
  const { data: job } = await supabase
    .from('published_jobs_public_view')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!job) notFound()
  const user = await getAuthedUser()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    employmentType: job.employment_type,
    jobLocationType: job.remote_type,
    datePosted: job.created_at,
    validThrough: job.expires_at,
    identifier: job.id,
  }

  return (
    <div className="space-y-4">
      <Script id="jobposting-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <Link href="/jobs" className="text-sm underline">
        Back to jobs
      </Link>
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <div className="text-sm text-slate-700">
        {job.location} · {job.remote_type} · {job.employment_type}
      </div>
      <div className="rounded-xl border p-4">
        <p className="whitespace-pre-wrap text-sm leading-6">{job.description}</p>
      </div>
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold">Apply</h2>
        {!user ? (
          <p className="mt-2 text-sm text-slate-700">
            Please{' '}
            <Link className="underline" href={`/auth/login?next=/jobs/${job.slug}`}>
              log in
            </Link>{' '}
            to apply.
          </p>
        ) : (
          <form className="mt-3 space-y-2" action={`/jobs/${job.slug}/apply`} method="post">
            <label className="block text-sm">
              Cover letter (optional)
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                name="cover_letter"
                rows={5}
              />
            </label>
            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
              Submit application
            </button>
          </form>
        )}
      </div>
      <p className="text-xs text-slate-600">
        Safety note: employer can publish jobs, but Admin can remove or temporarily hide any job.
      </p>
    </div>
  )
}
