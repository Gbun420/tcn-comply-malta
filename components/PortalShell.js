'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  ClipboardList,
  ShieldCheck,
  FileBarChart2,
  Settings,
  LifeBuoy,
  Menu,
  X,
} from 'lucide-react'
import PortalNav from './PortalNav.js'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Applications', href: '/dashboard/applications', icon: ClipboardList },
  { name: 'Compliance Tracking', href: '/dashboard/compliance', icon: ShieldCheck },
  { name: 'Reports', href: '/dashboard/reports', icon: FileBarChart2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
]

export default function PortalShell({ title, subtitle, actions, children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/auth/login')
          return
        }
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-amber mx-auto" />
          <p className="mt-4 text-slate-600">Loading portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <PortalNav user={user} />

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/80">
          <div className="absolute top-0 left-0 w-72 h-full bg-slate-950 text-white p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-lg font-semibold">TCN Comply</p>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="bg-white border-b border-slate-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg border border-slate-200"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {actions}
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.company || user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
