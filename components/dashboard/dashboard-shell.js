'use client'

import Link from 'next/link'
import { ClipboardCheck, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { GlassCard } from '../ui/glass-card.js'
import { DASHBOARD_MODULES } from '../../lib/portal-content.js'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, match: '/dashboard' },
  { href: '/dashboard/employees', label: 'Employees', icon: Users, match: '/dashboard/employees' },
  {
    href: '/dashboard/vacancies',
    label: 'Vacancies',
    icon: ClipboardCheck,
    match: '/dashboard/vacancies',
  },
  { href: '/dashboard/audit', label: 'Audit', icon: ClipboardCheck, match: '/dashboard/audit' },
]

export function DashboardShell({
  title,
  subtitle,
  activePath,
  userEmail,
  onLogout,
  children,
  actions,
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-14 pt-8">
      <GlassCard intense className="p-5 md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="glass-chip">Employer Console</p>
            <div>
              <h1 className="font-display text-3xl font-semibold text-white md:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-slate-200/90">{subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activePath === item.match
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                      isActive
                        ? 'border-cyan-300/80 bg-cyan-300/20 text-cyan-100'
                        : 'border-white/20 bg-white/10 text-slate-100 hover:bg-white/15'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <p className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-100">
              Signed in as {userEmail || 'employer'}
            </p>
            <div className="flex items-center gap-3">
              {actions}
              <button
                type="button"
                onClick={onLogout}
                className="cta-ghost inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Portal Modules</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DASHBOARD_MODULES.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-100 hover:bg-white/15"
            >
              {module.label}
            </Link>
          ))}
        </div>
      </GlassCard>

      {children}
    </div>
  )
}
