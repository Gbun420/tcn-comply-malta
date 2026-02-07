'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ReviewNewForm({ employers }: { employers: { id: string; name: string }[] }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Write a review</h1>
      <p className="text-sm text-slate-700">
        Safety rules: no emails, phone numbers, or URLs. Do not name individuals. Max narrative
        length is 1200 characters.
      </p>
      <form
        className="space-y-3 rounded-xl border p-4"
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setBusy(true)
          const form = e.currentTarget as HTMLFormElement
          const fd = new FormData(form)
          const res = await fetch('/reviews/new/submit', {
            method: 'POST',
            body: fd,
          })
          setBusy(false)
          if (!res.ok) {
            const j = await res.json().catch(() => null)
            setError(j?.error || 'Failed to create draft review')
            return
          }
          const { id } = await res.json()
          router.push(`/reviews/${id}/edit`)
          router.refresh()
        }}
      >
        <label className="block text-sm">
          Employer
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="employer_id" required>
            <option value="">Select…</option>
            {employers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 md:grid-cols-4">
          {['overall', 'management', 'worklife', 'pay_fairness'].map((k) => (
            <label key={k} className="block text-sm">
              {k.replace('_', ' ')}
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                name={k}
                defaultValue="3"
                required
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
            placeholder="Describe policies and conditions. Do not include names or personal contact info."
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button disabled={busy} className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
          {busy ? 'Creating…' : 'Create draft'}
        </button>
      </form>
    </div>
  )
}
