import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { EvidenceUploader } from '@/app/reviews/[id]/edit/uploader'

export const dynamic = 'force-dynamic'

export default async function ReviewEditPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: review } = await supabase
    .from('reviews')
    .select(
      'id, employer_id, author_user_id, status, overall, management, worklife, pay_fairness, narrative_raw, narrative_redacted, submitted_at, created_at'
    )
    .eq('id', id)
    .maybeSingle()

  if (!review) notFound()
  if (review.author_user_id !== user.id) notFound()

  const { data: evidence } = await supabase
    .from('review_evidence')
    .select('id, evidence_type, status, expires_at, created_at')
    .eq('review_id', review.id)
    .order('created_at', { ascending: false })

  const editable = review.status === 'draft' || review.status === 'needs_changes'

  return (
    <div className="space-y-4">
      <Link href="/reviews/mine" className="text-sm underline">
        Back to my reviews
      </Link>
      <div className="rounded-xl border p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-semibold">Review {review.id.slice(0, 8)}</div>
          <div className="text-xs text-slate-600">Status: {review.status}</div>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Safety: Your identity and raw narrative are never shown publicly. Admin may request
          changes.
        </p>
      </div>

      <section className="rounded-xl border p-4">
        <h2 className="font-semibold">Edit</h2>
        {!editable ? (
          <p className="mt-2 text-sm text-slate-700">This review can no longer be edited.</p>
        ) : (
          <form className="mt-3 space-y-3" action={`/reviews/${review.id}/edit/save`} method="post">
            <div className="grid gap-3 md:grid-cols-4">
              {(['overall', 'management', 'worklife', 'pay_fairness'] as const).map((k) => (
                <label key={k} className="block text-sm">
                  {k.replace('_', ' ')}
                  <select
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    name={k}
                    defaultValue={String(review[k])}
                  >
                    {[1, 2, 3, 4, 5].map((v) => (
                      <option key={v} value={String(v)}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <label className="block text-sm">
              Narrative (optional)
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                name="narrative_raw"
                maxLength={1200}
                rows={6}
                defaultValue={review.narrative_raw || ''}
              />
            </label>
            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
              Save draft
            </button>
          </form>
        )}
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="font-semibold">Evidence (private vault)</h2>
        <p className="mt-2 text-sm text-slate-700">
          Upload proof-of-employment (payslip/contract). Evidence expires automatically. You cannot
          download evidence after upload.
        </p>
        <div className="mt-3">
          <EvidenceUploader reviewId={review.id} disabled={!editable} />
        </div>
        <div className="mt-4 space-y-2">
          {(evidence || []).map((ev) => {
            const expiresInDays = Math.ceil(
              (new Date(ev.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
            return (
              <div key={ev.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    {ev.evidence_type} · <span className="text-slate-600">{ev.status}</span>
                  </div>
                  <div className="text-xs text-slate-600">Expires in {expiresInDays} days</div>
                </div>
              </div>
            )
          })}
          {(evidence || []).length === 0 ? (
            <p className="text-sm text-slate-600">No evidence uploaded.</p>
          ) : null}
        </div>
      </section>

      {review.status === 'draft' || review.status === 'needs_changes' ? (
        <form
          className="rounded-xl border p-4"
          action={`/reviews/${review.id}/edit/submit`}
          method="post"
        >
          <h2 className="font-semibold">Submit for moderation</h2>
          <p className="mt-2 text-sm text-slate-700">
            After submitting, your review enters pre-moderation and cannot be edited unless Admin
            requests changes.
          </p>
          <button className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
            Submit review
          </button>
        </form>
      ) : null}
    </div>
  )
}
