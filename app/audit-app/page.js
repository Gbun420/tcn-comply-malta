import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FlaskConical, ShieldCheck } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

const auditChecks = [
  'Review policy checkpoints against employee and vacancy records.',
  'Run smoke tests for protected routes and auth behavior.',
  'Validate evidence completeness before regulatory submission.',
  'Track remediation actions and assign accountable owners.',
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.auditApp)

export default function AuditAppPage() {
  return (
    <MarketingPageShell
      kicker="Audit App"
      title="Dedicated audit and test workspace for compliance verification"
      description="This workspace is purpose-built for audit preparation, API checks, and evidence readiness reviews with direct paths into the operational dashboard."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book Demo
          <ArrowUpRight className="h-4 w-4" />
        </Link>,
        <Link
          key="pricing"
          href="/pricing"
          className="cta-ghost inline-flex items-center gap-2"
        >
          View Pricing
        </Link>,
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-6">
          <h2 className="font-display text-2xl font-semibold text-white">
            Audit Coverage Checklist
          </h2>
          <div className="mt-5 space-y-3">
            {auditChecks.map((item) => (
              <p key={item} className="flex items-start gap-3 text-sm text-slate-100">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-200" />
                {item}
              </p>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-4 p-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-100">
            <FlaskConical className="h-3.5 w-3.5" />
            Test Purpose
          </p>
          <p className="text-sm text-slate-200">
            Use this area to verify portal integrity before client demos, regulator requests, and
            production rollouts.
          </p>
          <div className="rounded-xl border border-white/12 bg-white/6 px-4 py-3 text-sm text-slate-100">
            <p className="font-semibold text-white">Audit output bundle includes:</p>
            <ul className="mt-2 space-y-1">
              <li>• API route health checks and auth expectations</li>
              <li>• SEO and metadata consistency checks</li>
              <li>• Evidence coverage summaries for internal review</li>
            </ul>
          </div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
            <ShieldCheck className="h-4 w-4" />
            Evidence-first verification flow
          </p>
        </GlassCard>
      </div>
    </MarketingPageShell>
  )
}
