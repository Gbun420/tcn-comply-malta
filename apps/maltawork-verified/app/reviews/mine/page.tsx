import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function MyReviewsPage() {
  const user = await requireUser()
  const supabase = await createSupabaseServerClient()
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('id, employer_id, status, submitted_at, published_at, created_at')
    .eq('author_user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return <p className="text-sm text-red-700">Error loading reviews: {error.message}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">My reviews</h1>
        <Link className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white" href="/reviews/new">
          New review
        </Link>
      </div>
      <div className="grid gap-3">
        {(reviews || []).map((r) => (
          <Link
            key={r.id}
            className="rounded-xl border p-4 hover:bg-slate-50"
            href={`/reviews/${r.id}/edit`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">Review {r.id.slice(0, 8)}</div>
              <div className="text-xs text-slate-600">Status: {r.status}</div>
            </div>
            <div className="mt-2 text-xs text-slate-600">
              Created: {new Date(r.created_at).toLocaleString()}
              {r.submitted_at ? ` · Submitted: ${new Date(r.submitted_at).toLocaleString()}` : ''}
              {r.published_at ? ` · Published: ${new Date(r.published_at).toLocaleString()}` : ''}
            </div>
          </Link>
        ))}
        {(reviews || []).length === 0 ? (
          <p className="text-sm text-slate-600">No reviews yet.</p>
        ) : null}
      </div>
    </div>
  )
}
