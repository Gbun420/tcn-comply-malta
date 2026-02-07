import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function DecisionForm({ targetId, kind }: { targetId: string; kind: 'review' | 'response' }) {
  const actionPath = kind === 'review' ? '/admin/reviews/decide' : '/admin/reviews/decide-response'
  return (
    <form className="mt-3 grid gap-2 rounded-lg bg-slate-50 p-3" action={actionPath} method="post">
      <input type="hidden" name="id" value={targetId} />
      <div className="grid gap-2 md:grid-cols-3">
        <label className="text-xs">
          Action
          <select
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            name="action"
            required
            defaultValue="needs_changes"
          >
            <option value="publish">publish</option>
            <option value="reject">reject</option>
            <option value="needs_changes">needs_changes</option>
            <option value="remove">remove</option>
            <option value="temp_hide">temp_hide</option>
            <option value="restore">restore</option>
          </select>
        </label>
        <label className="text-xs">
          Basis
          <select
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            name="basis"
            required
            defaultValue="policy_violation"
          >
            <option value="illegal_content">illegal_content</option>
            <option value="policy_violation">policy_violation</option>
          </select>
        </label>
        <label className="text-xs">
          Scope
          <input
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            name="scope"
            defaultValue="platform"
            required
          />
        </label>
      </div>
      <label className="text-xs">
        Explanation (required)
        <textarea
          className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
          name="explanation"
          rows={3}
          required
        />
      </label>
      <label className="text-xs">
        Duration (optional)
        <input
          className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
          name="duration"
          placeholder="e.g. 30 days"
        />
      </label>
      <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
        Submit decision
      </button>
    </form>
  )
}

export default async function AdminReviewsPage() {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select(
      'id, employer_id, status, overall, management, worklife, pay_fairness, narrative_raw, narrative_redacted, submitted_at, created_at'
    )
    .in('status', ['submitted', 'verification_pending', 'temp_hidden'])
    .order('submitted_at', { ascending: true })
    .limit(50)

  const { data: responses } = await supabase
    .from('employer_review_responses')
    .select('id, employer_id, status, response_raw, response_redacted, submitted_at, created_at')
    .in('status', ['submitted', 'temp_hidden'])
    .order('submitted_at', { ascending: true })
    .limit(50)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Moderation queue</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <div className="grid gap-3">
          {(reviews || []).map((r) => (
            <div key={r.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">Review {r.id.slice(0, 8)}</div>
                <div className="text-xs text-slate-600">Status: {r.status}</div>
              </div>
              <div className="mt-2 text-sm text-slate-700">
                Ratings: {r.overall}/{r.management}/{r.worklife}/{r.pay_fairness}
              </div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-600">Raw</div>
                  <p className="whitespace-pre-wrap text-sm">{r.narrative_raw || '—'}</p>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Redacted</div>
                  <p className="whitespace-pre-wrap text-sm">{r.narrative_redacted || '—'}</p>
                </div>
              </div>
              <DecisionForm targetId={r.id} kind="review" />
            </div>
          ))}
          {(reviews || []).length === 0 ? (
            <p className="text-sm text-slate-600">No review items.</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Employer responses</h2>
        <div className="grid gap-3">
          {(responses || []).map((r) => (
            <div key={r.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">Response {r.id.slice(0, 8)}</div>
                <div className="text-xs text-slate-600">Status: {r.status}</div>
              </div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-600">Raw</div>
                  <p className="whitespace-pre-wrap text-sm">{r.response_raw}</p>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Redacted</div>
                  <p className="whitespace-pre-wrap text-sm">{r.response_redacted}</p>
                </div>
              </div>
              <DecisionForm targetId={r.id} kind="response" />
            </div>
          ))}
          {(responses || []).length === 0 ? (
            <p className="text-sm text-slate-600">No response items.</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
