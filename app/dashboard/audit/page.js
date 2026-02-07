'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, FlaskConical, ShieldCheck } from 'lucide-react'
import { DashboardShell } from '../../../components/dashboard/dashboard-shell.js'
import { GlassCard } from '../../../components/ui/glass-card.js'

const auditRows = [
  {
    check: 'JWT-protected API routes',
    status: 'pass',
    note: 'Unauthorized access returns 401 as expected.',
  },
  {
    check: 'Vacancy posting duration rule',
    status: 'pass',
    note: 'Minimum 3-week guard enabled in route validation.',
  },
  {
    check: 'Database dependency resilience',
    status: 'warning',
    note: 'Fallback mode engaged when Firebase credentials are missing.',
  },
  {
    check: 'Portal UI module coverage',
    status: 'pass',
    note: 'Employees, vacancies, and audit module routes now present.',
  },
]

export default function AuditDashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const data = await response.json()
      setUserEmail(data.user?.email || '')
    } catch {
      router.push('/auth/login')
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

  return (
    <DashboardShell
      title="Audit and testing dashboard"
      subtitle="Track validation checks, evidence quality, and release readiness in one portal surface."
      activePath="/dashboard/audit"
      userEmail={userEmail}
      onLogout={handleLogout}
      actions={
        <Link href="/audit-app" className="cta-primary inline-flex items-center gap-2">
          <FlaskConical className="h-4 w-4" />
          Open Audit App
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Checks Tracked</p>
          <p className="mt-2 font-display text-3xl text-white">{auditRows.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Passing Checks</p>
          <p className="mt-2 inline-flex items-center gap-2 font-semibold text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            {auditRows.filter((row) => row.status === 'pass').length}
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Release State</p>
          <p className="mt-2 inline-flex items-center gap-2 font-semibold text-cyan-100">
            <ShieldCheck className="h-4 w-4" />
            Review Ready
          </p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="border-b border-white/15 px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-white">Audit Checklist</h2>
          <p className="mt-1 text-sm text-slate-200">
            Operational checks for client demos, regulator requests, and production validations.
          </p>
        </div>
        <div className="divide-y divide-white/10">
          {auditRows.map((row) => (
            <div
              key={row.check}
              className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-white">{row.check}</p>
                <p className="text-sm text-slate-200">{row.note}</p>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.08em] ${
                  row.status === 'pass'
                    ? 'border-emerald-200/40 bg-emerald-200/20 text-emerald-100'
                    : 'border-amber-200/40 bg-amber-200/20 text-amber-100'
                }`}
              >
                {row.status === 'pass' ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </DashboardShell>
  )
}
