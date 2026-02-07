import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { PORTAL_OFFERINGS } from '../../lib/portal-content.js'

export default function WorkflowPage() {
  return (
    <MarketingPageShell
      kicker="Workflow"
      title="A workflow clients can operate daily without compliance blind spots"
      description="Our workflow model aligns product behavior with legal process order so teams can intake, validate, operate, and audit without context switching."
      actions={[
        <Link key="contact" href="/contact" className="cta-ghost inline-flex items-center gap-2">
          Talk to Implementation Team
        </Link>,
        <Link key="portal" href="/dashboard" className="cta-primary inline-flex items-center gap-2">
          Launch Dashboard
          <ArrowUpRight className="h-4 w-4" />
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
