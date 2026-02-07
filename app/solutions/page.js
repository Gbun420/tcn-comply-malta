import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { PORTAL_OFFERINGS } from '../../lib/portal-content.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.solutions)

export default function SolutionsPage() {
  return (
    <MarketingPageShell
      kicker="Solutions"
      title="Client-ready compliance solutions for each stage of the TCN lifecycle"
      description="These modules define what employers and partner integrators can operationalize inside the portal, including evidence outputs for legal and audit teams."
      actions={[
        <Link key="portal" href="/dashboard" className="cta-primary inline-flex items-center gap-2">
          Open Portal Dashboard
          <ArrowUpRight className="h-4 w-4" />
        </Link>,
        <Link key="workflow" href="/workflow" className="cta-ghost inline-flex items-center gap-2">
          View Workflow
        </Link>,
      ]}
    >
      <div className="glass-grid sm:grid-cols-2">
        {PORTAL_OFFERINGS.solutions.map((item) => (
          <GlassCard key={item.title} className="p-5 md:p-6">
            <h2 className="font-display text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">{item.detail}</p>
          </GlassCard>
        ))}
      </div>
    </MarketingPageShell>
  )
}
