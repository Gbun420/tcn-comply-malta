import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

const highlights = [
  'Coverage matrix mapped to policy obligations and evidence outputs.',
  'Workflow timelines with renewal checkpoints and responsibility handoffs.',
  'Exportable evidence pack structure for internal and regulator review.',
  'Role-based access controls and route-level authentication.',
]

const rollout = [
  { step: 'Week 1', detail: 'Discovery, policy mapping, and field alignment.' },
  { step: 'Week 2', detail: 'Workspace setup and user role provisioning.' },
  { step: 'Week 3', detail: 'Audit rehearsal and evidence pack validation.' },
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.product)

export default function ProductPage() {
  return (
    <MarketingPageShell
      kicker="Product"
      title="One platform for policy coverage, workflow control, and audit evidence"
      description="TCN Comply Malta centralizes the operations compliance teams need to prove readiness under regulator scrutiny."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
          <ArrowUpRight className="h-4 w-4" />
        </Link>,
        <Link key="pricing" href="/pricing" className="cta-ghost inline-flex items-center gap-2">
          View pricing
        </Link>,
      ]}
    >
      <div className="space-y-5">
        <GlassCard className="overflow-hidden p-4 md:p-6">
          <Image
            src="/product-screenshot.svg"
            alt="TCN Comply Malta product preview"
            width={1200}
            height={760}
            className="h-auto w-full rounded-2xl border border-white/10"
            priority
          />
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h2 className="font-display text-2xl font-semibold text-white">Core capabilities</h2>
            <ul className="mt-4 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-200" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="font-display text-2xl font-semibold text-white">
              Typical rollout timeline
            </h2>
            <div className="mt-4 space-y-3">
              {rollout.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-white/12 bg-white/6 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.12em] text-cyan-100">{item.step}</p>
                  <p className="mt-1 text-sm text-slate-100">{item.detail}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </MarketingPageShell>
  )
}
