'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { DashboardShell } from '../../components/dashboard/dashboard-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { DASHBOARD_MODULES } from '../../lib/portal-content.js'

const statCards = [
  { name: 'Total Employees', value: '24', change: '+12%', icon: Users },
  { name: 'Courses Completed', value: '18', change: '+25%', icon: BookOpen },
  { name: 'Pending Renewals', value: '3', change: '-2', icon: CalendarClock },
  { name: 'Compliance Rate', value: '92%', change: '+5%', icon: CheckCircle2 },
]

const employeeRows = [
  {
    id: 'EMP001',
    name: 'Maria Santos',
    passport: 'PH1234567',
    status: 'active',
    course: 'Completed',
    skillsPass: 'Not required',
    renewal: '2024-12-15',
  },
  {
    id: 'EMP002',
    name: 'Ahmed Hassan',
    passport: 'EG7654321',
    status: 'pending',
    course: 'In progress',
    skillsPass: 'Pending',
    renewal: '2025-01-20',
  },
  {
    id: 'EMP003',
    name: 'Keiko Tanaka',
    passport: 'JP1122334',
    status: 'overdue',
    course: 'Not started',
    skillsPass: 'Not required',
    renewal: '2024-11-30',
  },
]

const renewalAlerts = [
  { employee: 'Keiko Tanaka', note: 'Renewal due in 15 days', variant: 'alert' },
  { employee: 'Ahmed Hassan', note: 'Course completion overdue', variant: 'info' },
]

const complianceTips = [
  { icon: CheckCircle2, copy: 'All vacancies posted for 3+ weeks as required' },
  { icon: CheckCircle2, copy: 'Electronic salary payments verified' },
  { icon: AlertTriangle, copy: 'Approaching workforce quota limit (85%)' },
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const data = await response.json()
      setUser(data.user)
    } catch {
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 text-center sm:px-6 lg:px-8">
        <GlassCard className="inline-flex items-center gap-3 px-5 py-3 text-slate-100">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-transparent" />
          Loading dashboard...
        </GlassCard>
      </div>
    )
  }

  return (
    <DashboardShell
      title="Compliance overview"
      subtitle={`Welcome back${user?.name ? `, ${user.name}` : ''}. Monitor your current policy posture and critical deadlines.`}
      activePath="/dashboard"
      userEmail={user?.email}
      onLogout={handleLogout}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard/employees')}
            className="cta-primary inline-flex items-center gap-2"
          >
            Employee Console
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/vacancies')}
            className="cta-ghost inline-flex items-center gap-2"
          >
            Vacancy Console
          </button>
        </div>
      }
    >
      <GlassCard className="p-5">
        <h2 className="font-display text-2xl font-semibold text-white">Client Portal Modules</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {DASHBOARD_MODULES.map((module) => (
            <button
              type="button"
              key={module.href}
              onClick={() => router.push(module.href)}
              className="rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-left transition hover:bg-white/15"
            >
              <p className="font-semibold text-white">{module.label}</p>
              <p className="mt-1 text-sm text-slate-200">{module.summary}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon
          return (
            <GlassCard key={item.name} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-300">{item.name}</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
                <span className="rounded-xl border border-white/20 bg-white/10 p-2.5">
                  <Icon className="h-5 w-5 text-cyan-100" />
                </span>
              </div>
              <p className="mt-4 text-sm text-emerald-200">{item.change} from last month</p>
            </GlassCard>
          )
        })}
      </div>

      <GlassCard className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              Current Workforce Snapshot
            </h2>
            <p className="text-sm text-slate-200">
              A quick look at the highest-priority employee records
            </p>
          </div>
          <span className="glass-chip">Live policy view</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-white/10">
              <tr>
                <th className="table-header">Employee</th>
                <th className="table-header">Status</th>
                <th className="table-header">Course</th>
                <th className="table-header">Skills Pass</th>
                <th className="table-header">Renewal</th>
              </tr>
            </thead>
            <tbody>
              {employeeRows.map((row) => (
                <tr key={row.id} className="border-b border-white/10 last:border-b-0">
                  <td className="table-cell">
                    <p className="font-medium text-white">{row.name}</p>
                    <p className="text-xs text-slate-300">{row.passport}</p>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs uppercase tracking-[0.08em] ${
                        row.status === 'active'
                          ? 'border-emerald-200/40 bg-emerald-200/20 text-emerald-100'
                          : row.status === 'pending'
                            ? 'border-amber-200/40 bg-amber-200/20 text-amber-100'
                            : 'border-rose-200/40 bg-rose-200/20 text-rose-100'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="table-cell">{row.course}</td>
                  <td className="table-cell">{row.skillsPass}</td>
                  <td className="table-cell">{row.renewal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="font-display text-xl font-semibold text-white">Renewal alerts</h3>
          <div className="mt-4 space-y-3">
            {renewalAlerts.map((alert) => (
              <div
                key={alert.employee}
                className={`rounded-xl border px-4 py-3 ${
                  alert.variant === 'alert'
                    ? 'border-amber-200/35 bg-amber-200/15 text-amber-50'
                    : 'border-sky-200/35 bg-sky-200/15 text-sky-50'
                }`}
              >
                <p className="font-medium">{alert.employee}</p>
                <p className="text-sm opacity-90">{alert.note}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-display text-xl font-semibold text-white">Compliance pulse</h3>
          <div className="mt-4 space-y-3">
            {complianceTips.map((item) => {
              const Icon = item.icon
              return (
                <p key={item.copy} className="flex items-start gap-2 text-sm text-slate-100">
                  <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-200" />
                  {item.copy}
                </p>
              )
            })}
          </div>

          <div className="mt-6 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2 font-semibold text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Next recommended action
            </span>
            <p className="mt-2">
              Review two pending records before the next reporting cycle cutoff.
            </p>
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  )
}
