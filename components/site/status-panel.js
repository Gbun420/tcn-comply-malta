'use client'

import { useEffect, useState } from 'react'

const REFRESH_INTERVAL_MS = 30_000

export function StatusPanel() {
  const [state, setState] = useState({ status: 'loading', payload: null, error: '' })

  useEffect(() => {
    let stopped = false

    async function loadStatus() {
      try {
        const response = await fetch('/api/health', { cache: 'no-store' })
        const payload = await response.json()

        if (stopped) return

        if (!response.ok) {
          setState({
            status: 'error',
            payload: null,
            error: payload.error || 'Health check failed',
          })
          return
        }

        setState({ status: 'ready', payload, error: '' })
      } catch {
        if (!stopped) {
          setState({ status: 'error', payload: null, error: 'Unable to reach health endpoint.' })
        }
      }
    }

    loadStatus()
    const intervalId = setInterval(loadStatus, REFRESH_INTERVAL_MS)

    return () => {
      stopped = true
      clearInterval(intervalId)
    }
  }, [])

  if (state.status === 'loading') {
    return <p className="text-sm text-slate-200">Checking platform status...</p>
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-4 py-3 text-sm text-rose-100">
        {state.error}
      </div>
    )
  }

  const payload = state.payload
  const healthy = payload?.status === 'ok'

  return (
    <div className="space-y-3">
      <p
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] ${
          healthy
            ? 'border-emerald-200/30 bg-emerald-200/10 text-emerald-100'
            : 'border-amber-200/35 bg-amber-200/10 text-amber-100'
        }`}
      >
        {healthy ? 'Operational' : 'Degraded'}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/12 bg-white/6 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Environment</p>
          <p className="mt-1 text-sm text-slate-100">{payload.environment}</p>
        </div>
        <div className="rounded-xl border border-white/12 bg-white/6 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-300">Timestamp</p>
          <p className="mt-1 text-sm text-slate-100">{payload.timestamp}</p>
        </div>
      </div>
    </div>
  )
}
