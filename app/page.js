import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { GlassCard } from '../components/ui/glass-card.js'
import { JsonLd } from '../components/JsonLd.js'
import { SectionHeading } from '../components/ui/section-heading.js'
import { PORTAL_OFFERINGS } from '../lib/portal-content.js'
import { buildPageMetadata } from '../lib/seo.js'
import { EVIDENCE_SIGNALS, HOME_COPY, PUBLIC_PAGE_COPY } from '../lib/site-copy.js'
import { SITE_CONTACT_EMAIL, SITE_NAME } from '../lib/site-content.js'

const featureCards = [
  {
    icon: BookOpenCheck,
    title: 'Course Compliance Engine',
    copy: 'Auto-track pre-departure learning, completion windows, and evidence packs by employee.',
  },
  {
    icon: ScanSearch,
    title: 'Skills Pass Visibility',
    copy: 'Watch tourism/hospitality Skills Pass status by role with deadline-aware alerts.',
  },
  {
    icon: BarChart3,
    title: 'Quota Radar',
    copy: 'Predict quota and termination thresholds before they block hiring or renewals.',
  },
  {
    icon: CalendarClock,
    title: 'Renewal Timeline',
    copy: 'Surface 90/30-day checkpoints with missing-document and medical screening prompts.',
  },
  {
    icon: Building2,
    title: 'Vacancy Proof Trail',
    copy: 'Capture Jobsplus/EURES publication windows and archive posting evidence in one audit view.',
  },
  {
    icon: ShieldCheck,
    title: 'Evidence-Ready Logs',
    copy: 'Generate exportable compliance narratives for legal review and internal governance.',
  },
]

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.home)

const quickPageCards = [
  {
    href: '/product',
    title: 'Product',
    copy: 'Understand modules, rollout scope, and evidence outputs.',
  },
  {
    href: '/pricing',
    title: 'Pricing',
    copy: 'Review plan options and rollout paths by team size.',
  },
  {
    href: '/demo',
    title: 'Demo',
    copy: 'Book a walkthrough tailored to your operating model.',
  },
  {
    href: '/coverage',
    title: 'Coverage',
    copy: 'Map legal requirements to tracked controls and evidence surfaces.',
  },
  {
    href: '/security',
    title: 'Security',
    copy: 'Review controls, processing standards, and trust documentation.',
  },
]

export default function Home() {
  const homeSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: 'https://tcn-comply-malta.vercel.app',
      email: SITE_CONTACT_EMAIL || undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Compliance operations platform for Maltese employers managing TCN onboarding, vacancy evidence, and renewals.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: '0',
      },
    },
  ]

  return (
    <div className="space-y-20 pb-20 pt-8 sm:pt-12">
      <JsonLd data={homeSchema} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard intense className="overflow-hidden p-7 md:p-10 xl:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <span className="glass-chip">{HOME_COPY.kicker}</span>
              <h1 className="font-display text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">
                {HOME_COPY.title}
              </h1>
              <p className="lead-copy text-lg md:text-xl">{HOME_COPY.description}</p>

              <div className="flex flex-wrap gap-3">
                <Link href="/demo" className="cta-primary inline-flex items-center gap-2">
                  Book a Demo
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="cta-ghost inline-flex items-center gap-2">
                  View Pricing
                </Link>
                <Link href="/coverage" className="cta-ghost inline-flex items-center gap-2">
                  See Coverage Matrix
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {EVIDENCE_SIGNALS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-100/80">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <GlassCard className="p-5 md:p-6">
              <p className="glass-chip">Client Offering Snapshot</p>
              <h2 className="mt-4 font-display text-2xl font-semibold text-white">
                What We Offer Clients
              </h2>
              <ul className="mt-5 space-y-3">
                {PORTAL_OFFERINGS.solutions.slice(0, 4).map((item) => (
                  <li key={item.title} className="flex items-start gap-3 text-sm text-slate-100/95">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-200" />
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
              {SITE_CONTACT_EMAIL ? (
                <p className="mt-6 rounded-xl border border-cyan-200/30 bg-cyan-200/10 px-3 py-2 text-sm text-cyan-100">
                  Need onboarding support? Contact{' '}
                  <a
                    href={`mailto:${SITE_CONTACT_EMAIL}`}
                    className="font-semibold underline underline-offset-4"
                  >
                    {SITE_CONTACT_EMAIL}
                  </a>
                  .
                </p>
              ) : (
                <p className="mt-6 rounded-xl border border-cyan-200/30 bg-cyan-200/10 px-3 py-2 text-sm text-cyan-100">
                  Need onboarding support? Use the demo request form.
                </p>
              )}
            </GlassCard>
          </div>
        </GlassCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Explore"
          title="Quick links for evaluation and rollout"
          description="Jump to the key pages buyers review during onboarding: product scope, pricing, coverage mapping, and trust documentation."
          align="center"
        />

        <div className="glass-grid sm:grid-cols-2 lg:grid-cols-3">
          {quickPageCards.map((item) => (
            <GlassCard key={item.href} className="p-5 md:p-6">
              <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">{item.copy}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100"
              >
                Open page
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Proof"
          title="What auditors ask for"
          description="These are the evidence outputs teams most commonly need when preparing files for internal and external review."
          align="center"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h3 className="font-display text-2xl font-semibold text-white">
              Audit Readiness Outputs
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-100">
              <li className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                Vacancy evidence trails with source references and publication windows.
              </li>
              <li className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                Onboarding record completeness with timestamped ownership.
              </li>
              <li className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                Renewal checkpoint logs and escalation history.
              </li>
              <li className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                Export-ready evidence packs for legal and regulator-facing review.
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-display text-2xl font-semibold text-white">Update Cadence</h3>
            <p className="mt-3 text-sm text-slate-200">
              Coverage mappings are reviewed when official guidance changes and during scheduled
              audit checks.
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-100">
              <p className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                Weekly route and metadata verification.
              </p>
              <p className="rounded-xl border border-white/12 bg-white/6 px-3 py-2">
                Monthly policy-source review and copy verification.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Platform Modules"
          title="Purpose-built modules for each compliance workload"
          description="Each module is tuned for high-frequency employer workflows with fast visual parsing, policy context, and evidence visibility."
          align="center"
        />

        <div className="glass-grid sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon
            return (
              <GlassCard key={feature.title} className="p-5 md:p-6">
                <span className="mb-4 inline-flex rounded-xl border border-white/20 bg-white/10 p-2.5">
                  <Icon className="h-5 w-5 text-cyan-100" />
                </span>
                <h3 className="font-display text-xl font-semibold text-white">{feature.title}</h3>
                <p className="section-copy mt-2 text-sm">{feature.copy}</p>
              </GlassCard>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-7 text-center md:p-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            2026 Platform Release
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">
            Built to simplify compliance operations and reduce filing risk
          </h2>
          <p className="section-copy mx-auto mt-3 max-w-2xl text-sm md:text-base">
            The portal structure includes dedicated operations, vacancy, and audit surfaces so
            compliance teams can produce evidence without spreadsheet drift.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/demo" className="cta-primary inline-flex items-center gap-2">
              Book Demo
            </Link>
            <Link href="/pricing" className="cta-ghost inline-flex items-center gap-2">
              View Pricing
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
