import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabasePublicClient } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

export default async function EmployerReviewsPage() {
  const { user } = await requireEmployerOrAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: employer } = await supabase
    .from('employers')
    .select('id, name')
    .eq('owner_user_id', user.id)
    .maybeSingle()
  if (!employer)
    return <p className="text-sm text-slate-700">No employer linked to your account.</p>

  // Employer can only see published, redacted reviews via the public view.
  const publicClient = createSupabasePublicClient()
  const { data: reviews } = await publicClient
    .from('published_reviews_public_view')
    .select('id, overall, management, worklife, pay_fairness, narrative_redacted, published_at')
    .eq('employer_id', employer.id)
    .order('published_at', { ascending: false })
    .limit(50)

  const { data: responses } = await supabase
    .from('employer_review_responses')
    .select('id, review_id, status, created_at')
    .eq('employer_id', employer.id)
    .order('created_at', { ascending: false })

  const responseByReview = new Map((responses || []).map((r) => [r.review_id, r]))

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Reviews ({employer.name})</h1>
      <p className="text-sm text-slate-700">
        You can respond to published reviews. Responses are pre-moderated and not public until Admin
        publishes.
      </p>
      <div className="grid gap-3">
        {(reviews || []).map((r) => {
          const resp = responseByReview.get(r.id)
          return (
            <div key={r.id} className="rounded-xl border p-4">
              <div className="text-sm text-slate-700">
                Overall: <span className="font-medium">{r.overall}</span> · Management:{' '}
                <span className="font-medium">{r.management}</span> · Work-life:{' '}
                <span className="font-medium">{r.worklife}</span> · Pay:{' '}
                <span className="font-medium">{r.pay_fairness}</span>
              </div>
              {r.narrative_redacted ? (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{r.narrative_redacted}</p>
              ) : null}
              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <div className="text-xs text-slate-600">
                  Response status: {resp ? resp.status : 'not started'}
                </div>
                <form className="mt-2 space-y-2" action="/employer/reviews/respond" method="post">
                  <input type="hidden" name="review_id" value={r.id} />
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    name="response_raw"
                    rows={4}
                    placeholder="Write a response (no emails/phones/urls; no individual names)."
                    required
                  />
                  <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
                    Submit response for moderation
                  </button>
                </form>
              </div>
            </div>
          )
        })}
        {(reviews || []).length === 0 ? (
          <p className="text-sm text-slate-600">No published reviews yet.</p>
        ) : null}
      </div>
    </div>
  )
}
