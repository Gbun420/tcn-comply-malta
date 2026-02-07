import Link from 'next/link'
import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EmployerProfilePage() {
  const { user } = await requireEmployerOrAdmin()
  const supabase = await createSupabaseServerClient()
  const { data: employer } = await supabase
    .from('employers')
    .select('*')
    .eq('owner_user_id', user.id)
    .maybeSingle()

  if (!employer) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Employer profile</h1>
        <p className="text-sm text-slate-700">
          No employer is linked to your account yet. Submit a claim request first.
        </p>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/employer/onboarding">
          Claim employer
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Employer profile</h1>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/employer/jobs">
          Manage jobs
        </Link>
      </div>
      <form
        className="space-y-3 rounded-xl border p-4"
        action="/employer/profile/save"
        method="post"
      >
        <input type="hidden" name="id" value={employer.id} />
        <label className="block text-sm">
          About / website
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            name="website"
            defaultValue={employer.website || ''}
          />
        </label>
        <label className="block text-sm">
          Industry
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            name="industry"
            defaultValue={employer.industry || ''}
          />
        </label>
        <label className="block text-sm">
          Size
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            name="size"
            defaultValue={employer.size || ''}
          />
        </label>
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Save</button>
      </form>
      <div className="flex gap-3">
        <Link className="rounded-md border px-3 py-2 text-sm" href="/employer/reviews">
          Reviews & responses
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/employer/billing">
          Billing
        </Link>
      </div>
    </div>
  )
}
