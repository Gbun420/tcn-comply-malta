import Link from 'next/link'
import { getMyRole, requireUser } from '@/lib/auth'
import { SignOutButton } from '@/app/account/SignOutButton'

export default async function AccountPage() {
  const user = await requireUser()
  const role = await getMyRole()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Account</h1>
      <div className="rounded-xl border p-4 text-sm">
        <div>
          <span className="text-slate-600">Email:</span> {user.email}
        </div>
        <div className="mt-1">
          <span className="text-slate-600">Role:</span> {role ?? 'user'}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white" href="/reviews/mine">
          My reviews
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/employer/onboarding">
          Employer onboarding
        </Link>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/admin">
          Admin
        </Link>
        <SignOutButton />
      </div>
    </div>
  )
}
