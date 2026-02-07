import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { PORTAL_OFFERINGS } from '../../lib/portal-content.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.workflow)

export default function WorkflowPage() {
  return (
    <MarketingPageShell
      kicker="Workflow"
      title="A workflow clients can operate daily without compliance blind spots"
      description="Our workflow model aligns product behavior with legal process order so HR, compliance, and operations can execute with shared visibility."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book Demo
          <ArrowUpRight className="h-4 w-4" />
        </Link>,
        <Link key="pricing" href="/pricing" className="cta-ghost inline-flex items-center gap-2">
          View Pricing
        </Link>,
      ]}
    >
      <div className="glass-grid md:grid-cols-2">
        {PORTAL_OFFERINGS.workflow.map((item) => (
          <GlassCard key={item.step} className="p-5 md:p-6">
            <p className="glass-chip">{item.step}</p>
            <h2 className="mt-4 font-display text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">{item.detail}</p>
          </GlassCard>
        ))}
      </div>
    </MarketingPageShell>
  )
}
