'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export function EvidenceUploader({ reviewId, disabled }: { reviewId: string; disabled?: boolean }) {
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <input
          disabled={disabled || busy}
          type="file"
          name="file"
          onChange={async (e) => {
            setError(null)
            setStatus(null)
            const file = e.target.files?.[0]
            if (!file) return

            setBusy(true)
            try {
              const supabase = createSupabaseBrowserClient()
              const { data: userData } = await supabase.auth.getUser()
              const user = userData.user
              if (!user) throw new Error('Not signed in')

              const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
              const objectPath = `${user.id}/${reviewId}/${crypto.randomUUID()}.${ext}`

              const { error: upErr } = await supabase.storage
                .from('evidence_private')
                .upload(objectPath, file, {
                  upsert: false,
                  contentType: file.type || 'application/octet-stream',
                })
              if (upErr) throw new Error(upErr.message)

              const fd = new FormData()
              fd.set('review_id', reviewId)
              fd.set('storage_path', objectPath)
              fd.set('evidence_type', 'proof_of_employment')

              const res = await fetch('/api/evidence/register', { method: 'POST', body: fd })
              const j = await res.json().catch(() => null)
              if (!res.ok) throw new Error(j?.error || 'Failed to register evidence')

              setStatus('Uploaded. Evidence is private and expires automatically.')
            } catch (e) {
              setError((e as Error).message)
            } finally {
              setBusy(false)
              e.target.value = ''
            }
          }}
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {status ? <p className="text-sm text-green-800">{status}</p> : null}
      <p className="text-xs text-slate-600">No download link is provided after upload.</p>
    </div>
  )
}
