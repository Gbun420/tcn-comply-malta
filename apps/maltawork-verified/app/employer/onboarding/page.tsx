import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EmployerOnboardingPage() {
  await requireUser()
  const supabase = await createSupabaseServerClient()
  const { data: employers } = await supabase
    .from('employers_public_view')
    .select('id, name')
    .order('name')
    .limit(200)

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Employer onboarding</h1>
      <p className="text-sm text-slate-700">
        Claim an employer profile using a domain email. Admin must approve before you can manage
        jobs and respond to reviews.
      </p>
      <form
        className="space-y-3 rounded-xl border p-4"
        action="/employer/onboarding/submit"
        method="post"
      >
        <label className="block text-sm">
          Employer
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="employer_id" required>
            <option value="">Select…</option>
            {(employers || []).map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Domain email (e.g. you@company.com)
          <input className="mt-1 w-full rounded-md border px-3 py-2" name="domain_email" required />
        </label>
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
          Submit claim
        </button>
      </form>
      <Link className="text-sm underline" href="/account">
        Back to account
      </Link>
    </div>
  )
}
