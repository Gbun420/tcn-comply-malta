'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { MARKETING_NAV_LINKS } from '../../lib/portal-content.js'

export function SiteHeader({ supportTagline }) {
  const pathname = usePathname()

  const isActivePath = (href) => {
    if (href === '/') {
      return pathname === '/'
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mt-4 w-full max-w-7xl rounded-2xl border border-white/15 bg-slate-950/45 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/25 bg-white/15 p-2">
              <Image
                src="/logo.svg"
                alt="TCN Comply Malta"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-white">
                TCN Comply Malta
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                Compliance Operations Platform
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link rounded-full px-2.5 py-1.5 text-sm ${
                  isActivePath(link.href)
                    ? 'border border-teal-200/35 bg-teal-200/12 text-teal-100'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-slate-200 md:inline-flex">
              {supportTagline}
            </span>
            <Link
              href="/demo"
              className="cta-primary inline-flex items-center gap-2 text-sm"
            >
              Book Demo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/auth/login" className="cta-ghost hidden items-center gap-2 text-sm sm:inline-flex">
              Portal
            </Link>
          </div>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {MARKETING_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                isActivePath(link.href)
                  ? 'border-teal-200/35 bg-teal-200/12 text-teal-100'
                  : 'border-white/20 bg-white/10 text-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
