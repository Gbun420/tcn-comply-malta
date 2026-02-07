import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-slate-50 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">MaltaWork Verified</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-700">
          Safety-first Malta jobs and verified anonymous workplace reviews. Reviews and employer
          responses are never public until Admin publishes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link className="rounded-md bg-slate-900 px-3 py-2 text-white" href="/jobs">
            Browse jobs
          </Link>
          <Link className="rounded-md border px-3 py-2" href="/reviews/new">
            Review an employer
          </Link>
          <Link className="rounded-md border px-3 py-2" href="/employers">
            Explore employers
          </Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold">Pre-moderation</h2>
          <p className="mt-2 text-sm text-slate-700">
            Every review and employer response is reviewed before publication. Admin can remove or
            temporarily hide content at any time.
          </p>
        </div>
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold">Privacy-by-design</h2>
          <p className="mt-2 text-sm text-slate-700">
            The public never sees reviewer identity, raw narratives, or evidence files. Evidence is
            stored in a private vault and expires automatically.
          </p>
        </div>
      </section>
    </div>
  )
}
