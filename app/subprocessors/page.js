import Link from 'next/link'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

const subprocessors = [
  {
    vendor: 'Vercel',
    purpose: 'Hosting and deployment infrastructure',
  },
  {
    vendor: 'Google Cloud (Firebase)',
    purpose: 'Authentication and operational data storage',
  },
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.subprocessors)

export default function SubprocessorsPage() {
  return (
    <MarketingPageShell
      kicker="Subprocessors"
      title="Infrastructure and service subprocessors"
      description="This list is reviewed and updated as operational dependencies change."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
        </Link>,
      ]}
    >
      <GlassCard className="p-6">
        <h2 className="font-display text-2xl font-semibold text-white">Current subprocessors</h2>
        <div className="mt-4 space-y-3">
          {subprocessors.map((item) => (
            <div
              key={item.vendor}
              className="rounded-xl border border-white/12 bg-white/6 px-4 py-3"
            >
              <p className="text-sm font-semibold text-white">{item.vendor}</p>
              <p className="mt-1 text-sm text-slate-200">{item.purpose}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </MarketingPageShell>
  )
}
