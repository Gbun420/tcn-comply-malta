import Link from 'next/link'
import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const [{ count: reviewsPending }, { count: responsesPending }, { count: evidencePending }] =
    await Promise.all([
      supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'verification_pending']),
      supabase
        .from('employer_review_responses')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted']),
      supabase
        .from('review_evidence')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Admin</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Reviews pending</div>
          <div className="text-2xl font-semibold">{reviewsPending ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Responses pending</div>
          <div className="text-2xl font-semibold">{responsesPending ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-slate-600">Evidence pending</div>
          <div className="text-2xl font-semibold">{evidencePending ?? 0}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
          href="/admin/reviews"
        >
          Moderation queue
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/admin/notices">
          DSA notices
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/admin/appeals">
          Appeals
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/admin/employers">
          Employer claims
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/admin/evidence">
          Evidence
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/admin/jobs">
          Jobs
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/admin/audit">
          Audit log
        </Link>
      </div>
    </div>
  )
}
