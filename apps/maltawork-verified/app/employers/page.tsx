import Link from 'next/link'
import { createSupabasePublicClient } from '@/lib/supabase/public'

export const dynamic = 'force-dynamic'

export default async function EmployersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''

  const supabase = createSupabasePublicClient()
  let query = supabase
    .from('employers_public_view')
    .select(
      'id, name, slug, industry, size, website, locations, verified_status, claim_status, created_at'
    )
    .order('name', { ascending: true })
    .limit(100)

  if (q) query = query.ilike('name', `%${q}%`)

  const { data: employers, error } = await query

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">Employers</h1>
      <form className="flex gap-2" action="/employers">
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          name="q"
          placeholder="Search employers…"
          defaultValue={q}
        />
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Search</button>
      </form>

      {error ? (
        <p className="text-sm text-red-700">Error loading employers: {error.message}</p>
      ) : null}
      <div className="grid gap-3">
        {(employers || []).map((e) => (
          <Link
            key={e.id}
            href={`/employers/${e.slug}`}
            className="rounded-xl border p-4 hover:bg-slate-50"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="font-medium">{e.name}</div>
              <div className="text-xs text-slate-600">
                {e.verified_status === 'verified' ? 'Verified' : 'Unverified'}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-700">
              {e.industry || '—'} · {e.size || '—'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
