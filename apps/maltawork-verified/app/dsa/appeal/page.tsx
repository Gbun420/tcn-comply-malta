'use client'

import { useState } from 'react'
import { createSupabasePublicClient } from '@/lib/supabase/public'

export default function DsaAppealPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Appeal / Complaint</h1>
      <p className="text-sm text-slate-700">
        Submit an appeal or complaint about a moderation decision. This creates a record for Admin
        handling.
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
            target_id: String(fd.get('target_id') || ''),
            complainant_email: String(fd.get('complainant_email') || ''),
            complaint: String(fd.get('complaint') || ''),
          }

          const supabase = createSupabasePublicClient()
          const { error } = await supabase.from('dsa_complaints').insert({
            target_type: payload.target_type,
            target_id: payload.target_id || null,
            complainant_email: payload.complainant_email || null,
            complaint: payload.complaint,
          })

          if (error) return setError(error.message)
          form.reset()
          setStatus('Submitted. Admin will review your complaint.')
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
          Target id (optional)
          <input className="mt-1 w-full rounded-md border px-3 py-2" name="target_id" />
        </label>
        <label className="block text-sm">
          Your email (optional)
          <input className="mt-1 w-full rounded-md border px-3 py-2" name="complainant_email" />
        </label>
        <label className="block text-sm">
          Complaint
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            name="complaint"
            rows={6}
            required
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {status ? <p className="text-sm text-green-800">{status}</p> : null}
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
          Submit complaint
        </button>
      </form>
    </div>
  )
}
