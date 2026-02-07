import Link from 'next/link'
import { MarketingPageShell } from '../../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../../lib/seo.js'

export const metadata = buildPageMetadata({
  title: 'Onboarding Checklist Guide',
  description:
    'Use this onboarding checklist to capture required records and evidence at intake for Malta TCN compliance workflows.',
  pathname: '/guides/onboarding-checklist',
})

const checklist = [
  'Create employee record with core identity fields',
  'Attach document references and verification status',
  'Assign workflow owner and review date',
  'Confirm evidence folders match internal naming standard',
]

export default function OnboardingChecklistGuide() {
  return (
    <MarketingPageShell
      kicker="Guide"
      title="Onboarding checklist"
      description="A lightweight structure to keep onboarding records complete and audit-friendly."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
        </Link>,
      ]}
    >
      <GlassCard className="p-6">
        <ul className="space-y-3 text-sm text-slate-100">
          {checklist.map((item) => (
            <li key={item} className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </GlassCard>
    </MarketingPageShell>
  )
}
