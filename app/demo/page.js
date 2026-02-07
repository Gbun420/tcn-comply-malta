import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { DemoForm } from '../../components/site/demo-form.js'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

const demoOutcomes = [
  'Policy coverage walkthrough against your operating model',
  'Audit evidence pack structure and export flow',
  'Implementation scope and phased rollout recommendation',
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.demo)

export default function DemoPage() {
  return (
    <MarketingPageShell
      kicker="Demo"
      title="Book a guided walkthrough"
      description="Share your use case and we will tailor a live demonstration around your onboarding, vacancy, and renewal workflows."
      actions={[
        <Link key="pricing" href="/pricing" className="cta-ghost inline-flex items-center gap-2">
          View pricing
        </Link>,
        <Link key="security" href="/security" className="cta-ghost inline-flex items-center gap-2">
          Security overview
          <ArrowUpRight className="h-4 w-4" />
        </Link>,
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <GlassCard className="p-6">
          <DemoForm />
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-display text-2xl font-semibold text-white">What the demo covers</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-100">
            {demoOutcomes.map((item) => (
              <li key={item} className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </MarketingPageShell>
  )
}
