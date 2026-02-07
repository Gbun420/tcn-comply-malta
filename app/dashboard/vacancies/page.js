'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Briefcase, Plus, ShieldCheck } from 'lucide-react'
import { DashboardShell } from '../../../components/dashboard/dashboard-shell.js'
import { GlassCard } from '../../../components/ui/glass-card.js'

const fallbackVacancies = [
  {
    id: 'VAC-001',
    title: 'Front Office Coordinator',
    sector: 'hospitality',
    salary: 24000,
    status: 'posted',
    postingDates: {
      requiredDuration: 3,
      expiresAt: '2026-03-20',
    },
    source: 'local',
  },
]

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [notice, setNotice] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    sector: 'hospitality',
    durationWeeks: '3',
  })
  const router = useRouter()

  const fetchVacancies = useCallback(async () => {
    try {
      const response = await fetch('/api/vacancies')

      if (response.status === 401) {
        router.push('/auth/login')
        return
      }

      if (response.status === 503) {
        setNotice('Database not configured. Running in local vacancy sandbox mode.')
        setVacancies(fallbackVacancies)
        return
      }

      const data = await response.json()
      setVacancies(data.vacancies || [])
    } catch {
      setNotice('Unable to reach vacancy service. Showing local fallback dataset.')
      setVacancies(fallbackVacancies)
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const data = await response.json()
      setUserEmail(data.user?.email || '')
      fetchVacancies()
    } catch {
      router.push('/auth/login')
    }
  }, [fetchVacancies, router])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setNotice('')

    try {
      const response = await fetch('/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: Number(formData.salary || 0),
          durationWeeks: Number(formData.durationWeeks || 3),
        }),
      })

      if (response.status === 401) {
        router.push('/auth/login')
        return
      }

      if (response.status === 503) {
        const localVacancy = {
          id: `LOCAL-${Date.now()}`,
          title: formData.title,
          sector: formData.sector,
          salary: Number(formData.salary || 0),
          status: 'posted',
          postingDates: {
            requiredDuration: Number(formData.durationWeeks || 3),
            expiresAt: 'Local sandbox',
          },
          source: 'local',
        }
        setVacancies((current) => [localVacancy, ...current])
        setNotice('Saved in local sandbox mode because external database is unavailable.')
      } else {
        const data = await response.json()

        if (!response.ok) {
          setNotice(data.error || 'Failed to create vacancy')
          return
        }

        setNotice('Vacancy posted successfully with compliance checks.')
        await fetchVacancies()
      }

      setFormData({
        title: '',
        description: '',
        salary: '',
        sector: 'hospitality',
        durationWeeks: '3',
      })
    } catch {
      setNotice('Network error while posting vacancy. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const totalVacancies = useMemo(() => vacancies.length, [vacancies])

  return (
    <DashboardShell
      title="Vacancy control center"
      subtitle="Create and monitor regulated vacancy postings with built-in duration and compliance checks."
      activePath="/dashboard/vacancies"
      userEmail={userEmail}
      onLogout={handleLogout}
      actions={
        <a href="/audit-app" className="cta-ghost inline-flex items-center gap-2">
          Audit App
          <ArrowUpRight className="h-4 w-4" />
        </a>
      }
    >
      <GlassCard className="p-5">
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <label className="block space-y-2 text-sm text-slate-100">
            <span>Vacancy title</span>
            <input
              required
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              className="input-field"
              placeholder="Senior Hospitality Coordinator"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-100">
            <span>Sector</span>
            <select
              value={formData.sector}
              onChange={(event) => setFormData({ ...formData, sector: event.target.value })}
              className="input-field"
            >
              <option value="hospitality">Hospitality</option>
              <option value="tourism">Tourism</option>
              <option value="general">General</option>
            </select>
          </label>

          <label className="block space-y-2 text-sm text-slate-100 md:col-span-2">
            <span>Description</span>
            <textarea
              required
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              className="input-field min-h-[88px] resize-y"
              placeholder="Role summary, responsibilities, and legal requirements."
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-100">
            <span>Annual salary (EUR)</span>
            <input
              required
              min="0"
              type="number"
              value={formData.salary}
              onChange={(event) => setFormData({ ...formData, salary: event.target.value })}
              className="input-field"
              placeholder="22000"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-100">
            <span>Posting duration (weeks)</span>
            <input
              required
              min="3"
              type="number"
              value={formData.durationWeeks}
              onChange={(event) => setFormData({ ...formData, durationWeeks: event.target.value })}
              className="input-field"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="cta-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {saving ? 'Posting...' : 'Post vacancy'}
            </button>
          </div>
        </form>

        {notice ? (
          <p className="mt-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-cyan-100">
            {notice}
          </p>
        ) : null}
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Tracked Vacancies</p>
          <p className="mt-2 font-display text-3xl text-white">{totalVacancies}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Minimum Duration</p>
          <p className="mt-2 font-display text-3xl text-white">3 weeks</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Compliance Gate</p>
          <p className="mt-2 inline-flex items-center gap-2 font-semibold text-cyan-100">
            <ShieldCheck className="h-4 w-4" />
            Active
          </p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-white">Vacancy Ledger</h2>
          <span className="glass-chip">Client-facing module</span>
        </div>

        {loading ? (
          <p className="px-5 py-6 text-sm text-slate-200">Loading vacancies...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="table-header">Title</th>
                  <th className="table-header">Sector</th>
                  <th className="table-header">Salary</th>
                  <th className="table-header">Duration</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Source</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((vacancy) => (
                  <tr
                    key={vacancy.id || vacancy.title}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <td className="table-cell">
                      <span className="inline-flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-cyan-200" />
                        {vacancy.title}
                      </span>
                    </td>
                    <td className="table-cell">{vacancy.sector || 'n/a'}</td>
                    <td className="table-cell">€{vacancy.salary || '0'}</td>
                    <td className="table-cell">
                      {vacancy.postingDates?.requiredDuration || 3} weeks
                    </td>
                    <td className="table-cell">{vacancy.status || 'posted'}</td>
                    <td className="table-cell">{vacancy.source || 'api'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </DashboardShell>
  )
}
