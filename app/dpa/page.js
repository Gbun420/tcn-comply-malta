import Link from 'next/link'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

const clauses = [
  'Processor role clarity for customer data supplied to the platform',
  'Security control commitments and incident response communication',
  'Subprocessor transparency and update notification process',
  'Data return/deletion handling at contract termination',
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.dpa)

export default function DpaPage() {
  return (
    <MarketingPageShell
      kicker="DPA"
      title="Data processing addendum summary"
      description="This page summarizes key processing commitments. Contractual DPA terms are shared during procurement."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
        </Link>,
      ]}
    >
      <GlassCard className="p-6">
        <h2 className="font-display text-2xl font-semibold text-white">Scope summary</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-100">
          {clauses.map((clause) => (
            <li key={clause} className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
              {clause}
            </li>
          ))}
        </ul>
      </GlassCard>
    </MarketingPageShell>
  )
}
