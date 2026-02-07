'use client'

import { useState } from 'react'
import { createSupabasePublicClient } from '@/lib/supabase/public'

export default function DsaNoticePage() {
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Notice & Action (Report Illegal Content)</h1>
      <p className="text-sm text-slate-700">
        Use this form to report allegedly illegal content. This creates a record for Admin review.
      </p>
      <form
        className="space-y-3 rounded-xl border p-4"
        onSubmit={async (e) => {
          e.preventDefault()
          setStatus(null)
          setError(null)
          const form = e.currentTarget as HTMLFormElement
          const fd = new FormData(form)
          const payload = {
            target_type: String(fd.get('target_type') || ''),
            url_or_location: String(fd.get('url_or_location') || ''),
            reporter_email: String(fd.get('reporter_email') || ''),
            reason: String(fd.get('reason') || ''),
            legal_basis: String(fd.get('legal_basis') || ''),
          }

          const supabase = createSupabasePublicClient()
          const { error } = await supabase.from('dsa_notices').insert({
            target_type: payload.target_type,
            url_or_location: payload.url_or_location,
            reporter_email: payload.reporter_email,
            reason: payload.reason,
            legal_basis: payload.legal_basis || null,
          })

          if (error) return setError(error.message)
          form.reset()
          setStatus('Submitted. Admin will review and take action where appropriate.')
        }}
      >
        <label className="block text-sm">
          Target type
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="target_type" required>
            <option value="review">Review</option>
            <option value="job">Job</option>
            <option value="employer">Employer</option>
            <option value="response">Employer response</option>
          </select>
        </label>
        <label className="block text-sm">
          URL or location
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            name="url_or_location"
            required
          />
        </label>
        <label className="block text-sm">
          Your email
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            name="reporter_email"
            required
          />
        </label>
        <label className="block text-sm">
          Reason
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            name="reason"
            rows={5}
            required
          />
        </label>
        <label className="block text-sm">
          Legal basis (optional)
          <input className="mt-1 w-full rounded-md border px-3 py-2" name="legal_basis" />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {status ? <p className="text-sm text-green-800">{status}</p> : null}
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
          Submit notice
        </button>
      </form>
    </div>
  )
}
