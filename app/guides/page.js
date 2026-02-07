import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

const guides = [
  {
    href: '/guides/onboarding-checklist',
    title: 'Onboarding Checklist',
    description: 'Checklist format for intake, documents, and initial compliance evidence.',
  },
  {
    href: '/guides/vacancy-evidence',
    title: 'Vacancy Evidence Guide',
    description: 'How to structure Jobsplus and EURES evidence with clean audit references.',
  },
  {
    href: '/guides/renewal-monitoring',
    title: 'Renewal Monitoring Guide',
    description: 'How to run renewal deadlines and escalations without timeline drift.',
  },
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.guides)

export default function GuidesPage() {
  return (
    <MarketingPageShell
      kicker="Guides"
      title="Operational guides for compliance teams"
      description="Use these practical references to standardize documentation and reduce audit preparation time."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
          <ArrowUpRight className="h-4 w-4" />
        </Link>,
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <GlassCard key={guide.href} className="p-5">
            <h2 className="font-display text-xl font-semibold text-white">{guide.title}</h2>
            <p className="mt-2 text-sm text-slate-200">{guide.description}</p>
            <Link href={guide.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
              Read guide
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        ))}
      </div>
    </MarketingPageShell>
  )
}
