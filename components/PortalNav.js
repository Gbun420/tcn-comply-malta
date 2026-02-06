'use client'

import {
  LayoutGrid,
  ClipboardList,
  ShieldCheck,
  FileBarChart2,
  Settings,
  LifeBuoy,
  LogOut,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Applications', href: '/dashboard/applications', icon: ClipboardList },
  { name: 'Compliance Tracking', href: '/dashboard/compliance', icon: ShieldCheck },
  { name: 'Reports', href: '/dashboard/reports', icon: FileBarChart2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
]

export default function PortalNav({ user }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-slate-950 text-white border-r border-white/10">
      <div className="flex items-center gap-3 px-6 py-6">
        <img src="/logo.svg" alt="TCN Comply Malta" className="w-10 h-10" />
        <div>
          <p className="text-lg font-semibold">TCN Comply</p>
          <p className="text-xs text-slate-300">Malta Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </a>
          )
        })}
      </nav>

      <div className="px-6 py-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-300">{user?.company || user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
