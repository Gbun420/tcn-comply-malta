import Link from 'next/link'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

const controls = [
  'Role-based access control for operational and audit workflows',
  'JWT-based authentication for protected routes',
  'Timestamped action logging for evidence traceability',
  'Regular platform audits for route and metadata integrity',
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.security)

export default function SecurityPage() {
  return (
    <MarketingPageShell
      kicker="Security"
      title="Security controls built for compliance operations"
      description="Security posture is designed to support accountability, access governance, and audit traceability."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
        </Link>,
      ]}
    >
      <GlassCard className="p-6">
        <h2 className="font-display text-2xl font-semibold text-white">Control overview</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-100">
          {controls.map((control) => (
            <li key={control} className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
              {control}
            </li>
          ))}
        </ul>
      </GlassCard>
    </MarketingPageShell>
  )
}
