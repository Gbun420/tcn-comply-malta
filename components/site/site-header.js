import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { MARKETING_NAV_LINKS } from '../../lib/portal-content.js'

export function SiteHeader({ supportTagline }) {
  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mt-4 w-full max-w-7xl rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
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
                TCN Comply
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Malta 2026</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {MARKETING_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link text-sm">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-100 md:inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              {supportTagline}
            </span>
            <Link href="/auth/login" className="cta-primary inline-flex items-center gap-2 text-sm">
              Portal
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {MARKETING_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
