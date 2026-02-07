import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

const plans = [
  {
    name: 'Starter',
    price: 'From €590 / month',
    description: 'For smaller employers standardizing onboarding and vacancy proof workflows.',
    items: ['Up to 2 admins', 'Coverage matrix + workflow tracking', 'Evidence export bundle'],
    cta: '/demo',
    ctaLabel: 'Book demo',
  },
  {
    name: 'Growth',
    price: 'From €1,190 / month',
    description: 'For operational teams managing larger volumes and recurring renewals.',
    items: ['Up to 10 admins', 'Audit rehearsal workspace', 'Priority support and monthly review'],
    cta: '/demo',
    ctaLabel: 'Book demo',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom pricing',
    description: 'For groups requiring custom governance controls and integration workflows.',
    items: [
      'Custom roles and governance model',
      'Implementation-led rollout',
      'Security and legal review support',
    ],
    cta: '/contact?subject=Enterprise%20pricing%20request',
    ctaLabel: 'Talk to sales',
  },
]

const pricingFaq = [
  {
    q: 'Do you offer annual billing?',
    a: 'Yes. Annual agreements are available during demo and contracting.',
  },
  {
    q: 'Can we start with a pilot?',
    a: 'Yes. Pilot rollout options can be scoped during the demo workflow.',
  },
  {
    q: 'Do you include implementation support?',
    a: 'Implementation and policy mapping support are included in Growth and Enterprise plans.',
  },
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.pricing)

export default function PricingPage() {
  return (
    <MarketingPageShell
      kicker="Pricing"
      title="Plans designed for compliance operations teams"
      description="Choose a plan based on team size, governance needs, and rollout complexity."
      actions={[
        <Link key="demo" href="/demo" className="cta-primary inline-flex items-center gap-2">
          Book demo
          <ArrowUpRight className="h-4 w-4" />
        </Link>,
      ]}
    >
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <GlassCard
              key={plan.name}
              className={`p-6 ${plan.featured ? 'border-cyan-200/40 bg-cyan-200/8' : ''}`}
            >
              <p className="text-xs uppercase tracking-[0.12em] text-cyan-100">{plan.name}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">{plan.price}</h2>
              <p className="mt-2 text-sm text-slate-200">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-100">
                {plan.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Link href={plan.cta} className="cta-primary mt-5 inline-flex items-center gap-2">
                {plan.ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-6">
          <h2 className="font-display text-2xl font-semibold text-white">Pricing FAQ</h2>
          <div className="mt-4 space-y-3">
            {pricingFaq.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/12 bg-white/6 px-4 py-3">
                <p className="text-sm font-semibold text-white">{item.q}</p>
                <p className="mt-1 text-sm text-slate-200">{item.a}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </MarketingPageShell>
  )
}
