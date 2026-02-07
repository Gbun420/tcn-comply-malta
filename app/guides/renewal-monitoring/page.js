import Link from 'next/link'
import { MarketingPageShell } from '../../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../../lib/seo.js'

export const metadata = buildPageMetadata({
  title: 'Renewal Monitoring Guide',
  description:
    'Operational guide for running renewal timelines, escalation points, and document completeness checks.',
  pathname: '/guides/renewal-monitoring',
})

const checkpoints = [
  'Set renewal horizon checkpoints at 90 and 30 days',
  'Review missing evidence and assign owner actions',
  'Validate salary/payment and policy-aligned controls',
  'Generate renewal evidence bundle for final review',
]

export default function RenewalMonitoringGuide() {
  return (
    <MarketingPageShell
      kicker="Guide"
      title="Renewal monitoring"
      description="Keep renewals on track with clear checkpoints and evidence ownership."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
        </Link>,
      ]}
    >
      <GlassCard className="p-6">
        <ul className="space-y-3 text-sm text-slate-100">
          {checkpoints.map((item) => (
            <li key={item} className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </GlassCard>
    </MarketingPageShell>
  )
}
