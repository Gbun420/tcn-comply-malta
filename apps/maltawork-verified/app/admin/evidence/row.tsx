'use client'

import { useState } from 'react'

export function EvidenceRow({
  row,
}: {
  row: {
    id: string
    review_id: string
    uploader_user_id: string
    evidence_type: string
    status: string
    storage_path: string
    expires_at: string
    created_at: string
  }
}) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function getSigned() {
    setBusy(true)
    setError(null)
    const res = await fetch('/api/admin/evidence/signed-url', {
      method: 'POST',
      body: new URLSearchParams({ evidence_id: row.id }),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    const j = await res.json().catch(() => null)
    setBusy(false)
    if (!res.ok) return setError(j?.error || 'Failed')
    setSignedUrl(j.url)
  }

  async function decide(decision: 'verified' | 'rejected' | 'deleted') {
    setBusy(true)
    setError(null)
    const res = await fetch('/api/admin/evidence/decide', {
      method: 'POST',
      body: new URLSearchParams({ evidence_id: row.id, decision }),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    const j = await res.json().catch(() => null)
    setBusy(false)
    if (!res.ok) return setError(j?.error || 'Failed')
    window.location.reload()
  }

  const expiresInDays = Math.ceil(
    (new Date(row.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="rounded-xl border p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-medium">Evidence {row.id.slice(0, 8)}</div>
        <div className="text-xs text-slate-600">
          {row.status} · expires in {expiresInDays} days
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-600">review_id: {row.review_id}</div>
      <div className="mt-1 text-xs text-slate-600">uploader: {row.uploader_user_id}</div>
      <div className="mt-1 text-xs text-slate-600">type: {row.evidence_type}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={busy} className="rounded-md border px-3 py-2 text-xs" onClick={getSigned}>
          {busy ? '…' : 'Get signed URL'}
        </button>
        <button
          disabled={busy}
          className="rounded-md border px-3 py-2 text-xs"
          onClick={() => decide('verified')}
        >
          Mark verified
        </button>
        <button
          disabled={busy}
          className="rounded-md border px-3 py-2 text-xs"
          onClick={() => decide('rejected')}
        >
          Mark rejected
        </button>
        <button
          disabled={busy}
          className="rounded-md border px-3 py-2 text-xs"
          onClick={() => decide('deleted')}
        >
          Delete now
        </button>
      </div>
      {signedUrl ? (
        <p className="mt-2 text-xs">
          Signed URL (admin-only):{' '}
          <a className="underline" href={signedUrl} target="_blank" rel="noreferrer">
            open
          </a>
        </p>
      ) : null}
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  )
}
