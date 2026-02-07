import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export function SiteFooter({ siteName, contactEmail, contactPhone }) {
  return (
    <footer className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold text-white">{siteName}</p>
            <p className="mt-2 max-w-xs text-sm text-slate-200">
              Compliance intelligence for Malta&apos;s 2026 labour migration era.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-200">Contact</p>
            <div className="space-y-2 text-sm text-slate-100">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 hover:text-cyan-200"
              >
                <Mail className="h-4 w-4" />
                {contactEmail}
              </a>
              <p className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {contactPhone}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-200">Legal</p>
            <div className="space-y-2 text-sm text-slate-100">
              <Link href="/privacy" className="block hover:text-cyan-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-cyan-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-4 text-xs text-slate-300">
          © 2026 {siteName}. Built for transparent, auditable compliance operations.
        </div>
      </div>
    </footer>
  )
}
