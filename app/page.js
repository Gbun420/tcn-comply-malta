import Link from 'next/link'
import {
  ArrowUpRight,
  BookOpenCheck,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  CircleCheckBig,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { GlassCard } from '../components/ui/glass-card.js'
import { SectionHeading } from '../components/ui/section-heading.js'
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
    icon: ChartNoAxesCombined,
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

const trustStats = [
  { label: 'Compliance Confidence', value: '98.4%' },
  { label: 'Average Admin Time Saved', value: '72%' },
  { label: 'Tracked Workforce Records', value: '120k+' },
  { label: 'Potential Penalties Avoided', value: '€200k+' },
]

const workflowSteps = [
  'Capture vacancy and application metadata in one flow.',
  'Detect policy edge-cases before submission deadlines.',
  'Monitor workforce obligations through a live compliance cockpit.',
  'Export audit evidence for legal and regulator-facing reviews.',
]

export default function Home() {
  return (
    <div className="space-y-20 pb-20 pt-8 sm:pt-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard intense className="overflow-hidden p-7 md:p-10 xl:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <span className="glass-chip">2026 Glass Console</span>
              <h1 className="font-display text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">
                A New Compliance Interface for Malta&apos;s 2026 Labour Framework
              </h1>
              <p className="max-w-2xl text-lg text-slate-100/90 md:text-xl">
                {SITE_NAME} now runs on a glassmorphic operations layer that keeps legal
                requirements, hiring velocity, and audit evidence visible in a single live surface.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/auth/register" className="cta-primary inline-flex items-center gap-2">
                  Launch Employer Workspace
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard" className="cta-ghost inline-flex items-center gap-2">
                  Open Interactive Dashboard
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {trustStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-100/80">
                      {item.label}
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <GlassCard className="p-5 md:p-6">
              <p className="glass-chip">Live Workflow</p>
              <h2 className="mt-4 font-display text-2xl font-semibold text-white">
                Policy Execution Loop
              </h2>
              <ul className="mt-5 space-y-3">
                {workflowSteps.map((step) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-slate-100/95">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-200" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
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
            </GlassCard>
          </div>
        </GlassCard>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Platform Modules"
          title="Purpose-built glass layers for each compliance workload"
          description="Each module is tuned for high-frequency employer workflows with fast visual parsing and clear status context."
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
                <p className="mt-2 text-sm leading-6 text-slate-200">{feature.copy}</p>
              </GlassCard>
            )
          })}
        </div>
      </section>

      <section id="coverage" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard className="grid gap-8 p-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-10">
          <div>
            <SectionHeading
              kicker="Coverage"
              title="From vacancy publication to renewal, every compliance stage stays visible"
              description="The 2026 design brings all policy-critical checkpoints into a single line of sight for HR, ops, and legal teams."
            />
          </div>

          <div className="space-y-3">
            {[
              'Mandatory pre-departure course completion controls',
              '3-week Jobsplus and EURES posting requirement tracking',
              'Sector-specific Skills Pass and qualification monitoring',
              'Quota and termination ratio awareness for decision-making',
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-7 text-center md:p-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            2026 Redesign Rollout
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">
            Built to reduce audit anxiety and speed up compliant hiring
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-200/95">
            The new interface structure favors fast scanning, high contrast status cues, and
            consistent action placement across marketing, auth, and dashboard surfaces.
          </p>

          <div id="contact" className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/auth/login" className="cta-primary inline-flex items-center gap-2">
              Access Employer Portal
            </Link>
            <a
              href={`mailto:${SITE_CONTACT_EMAIL}`}
              className="cta-ghost inline-flex items-center gap-2"
            >
              Contact Team
            </a>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
