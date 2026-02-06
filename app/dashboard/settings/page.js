'use client'

import { useState } from 'react'
import PortalShell from '../../../components/PortalShell.js'

export default function SettingsPage() {
  const [metrics, setMetrics] = useState({
    timeSavingsPercent: '',
    penaltiesSavedEuro: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setMetrics((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <PortalShell
      title="Settings"
      subtitle="Manage organization settings and public metrics"
      actions={<button className="btn-accent">Save Changes</button>}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Public Metrics</h2>
        <p className="text-sm text-slate-600 mt-2">
          Update the public metrics shown on the homepage. Leave blank to keep the current value.
        </p>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-slate-700">Time Savings (%)</span>
            <input
              type="number"
              name="timeSavingsPercent"
              value={metrics.timeSavingsPercent}
              onChange={handleChange}
              placeholder="70"
              className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Penalties Saved (EUR)</span>
            <input
              type="number"
              name="penaltiesSavedEuro"
              value={metrics.penaltiesSavedEuro}
              onChange={handleChange}
              placeholder="200000"
              className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </label>
        </div>
      </div>
    </PortalShell>
  )
}
