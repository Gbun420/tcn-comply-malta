import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { MARKETING_NAV_LINKS } from '../../lib/portal-content.js'
import { SITE_CONTACT_PHONE_HREF } from '../../lib/site-content.js'

export function SiteFooter({ siteName, contactEmail, contactPhone }) {
  const hasContact = Boolean(contactEmail || contactPhone)

  return (
    <footer className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-white/12 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-xl md:p-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="font-display text-xl font-semibold text-white">{siteName}</p>
            <p className="mt-2 max-w-xs text-sm text-slate-200">
              Audit-ready compliance operations for Malta&apos;s TCN workforce requirements.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-teal-100">Explore</p>
            <div className="space-y-2 text-sm text-slate-100">
              {MARKETING_NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="block hover:text-teal-100">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-teal-100">Contact</p>
            {hasContact ? (
              <div className="space-y-2 text-sm text-slate-100">
                {contactEmail ? (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 hover:text-teal-100"
                  >
                    <Mail className="h-4 w-4" />
                    {contactEmail}
                  </a>
                ) : null}
                {contactPhone ? (
                  <a
                    href={SITE_CONTACT_PHONE_HREF || undefined}
                    className="inline-flex items-center gap-2 hover:text-teal-100"
                  >
                    <Phone className="h-4 w-4" />
                    {contactPhone}
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-slate-200">Use the contact page to reach our team.</p>
            )}
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-teal-100">Legal</p>
            <div className="space-y-2 text-sm text-slate-100">
              <Link href="/privacy" className="block hover:text-teal-100">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-teal-100">
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
