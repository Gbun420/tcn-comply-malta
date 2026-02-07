import Link from 'next/link'
import { MarketingPageShell } from '../../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../../lib/seo.js'

export const metadata = buildPageMetadata({
  title: 'Vacancy Evidence Guide',
  description:
    'How to capture vacancy publication evidence and archive references for regulator and internal audits.',
  pathname: '/guides/vacancy-evidence',
})

const steps = [
  'Capture posting date and source channel metadata',
  'Store document snapshots and reference IDs',
  'Map each vacancy to policy duration requirements',
  'Export evidence summary before filing decisions',
]

export default function VacancyEvidenceGuide() {
  return (
    <MarketingPageShell
      kicker="Guide"
      title="Vacancy evidence checklist"
      description="Use this structure to avoid missing publication records at review time."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
        </Link>,
      ]}
    >
      <GlassCard className="p-6">
        <ul className="space-y-3 text-sm text-slate-100">
          {steps.map((item) => (
            <li key={item} className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </GlassCard>
    </MarketingPageShell>
  )
}
