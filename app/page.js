import {
  BookOpen,
  Shield,
  BarChart3,
  Users,
  Clock,
  Target,
  CheckCircle,
} from 'lucide-react'
import { getPublicMetrics } from '../lib/metrics.js'

const features = [
  {
    icon: BookOpen,
    title: 'Pre-Departure Course Tracking',
    description:
      "Ensure compliance with Malta's mandatory €250 course requirement with certificate automation.",
  },
  {
    icon: Shield,
    title: 'Skills Pass Integration',
    description:
      'Two-phase certification management for hospitality and tourism sectors.',
  },
  {
    icon: BarChart3,
    title: 'Quota Monitoring',
    description:
      'Real-time alerts for workforce and termination limits with predictive analytics.',
  },
  {
    icon: Users,
    title: 'Vacancy Compliance',
    description:
      'Jobsplus and EURES posting automation with 3-week advertising tracking.',
  },
  {
    icon: Clock,
    title: 'Permit Renewal Automation',
    description:
      '90-day and 30-day renewal alerts with electronic salary proof integration.',
  },
  {
    icon: Target,
    title: 'GDPR Compliance Hub',
    description:
      'Encryption, consent workflows, and data subject request automation.',
  },
]

const trustMetrics = (metrics) => [
  {
    label: 'TCN Applications Processed',
    value: formatNumber(metrics?.applicationsProcessed),
  },
  {
    label: 'Compliance Rate',
    value: formatPercent(metrics?.complianceRate),
  },
  {
    label: 'Time Savings',
    value: formatPercent(metrics?.timeSavingsPercent),
  },
  {
    label: 'Saved in Penalties',
    value: formatEuro(metrics?.penaltiesSavedEuro),
  },
]

function formatNumber(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

function formatPercent(value) {
  if (value === null || value === undefined) return '—'
  return `${value}%`
}

function formatEuro(value) {
  if (value === null || value === undefined) return '—'
  return `€${new Intl.NumberFormat('en-US').format(value)}`
}

export default async function Home() {
  const { metrics } = await getPublicMetrics()
  const trust = trustMetrics(metrics)

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,134,89,0.25),_transparent_55%)]" />
        <div className="absolute -right-40 top-10 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold">
                2026 Policy Ready
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight mt-4">
                TCN Compliance Made Simple for Maltese Employers
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mt-6 max-w-2xl">
                Navigate the 2026 Labour Migration Policy with confidence. Automate TCN onboarding,
                tracking, and compliance in one platform.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="/auth/register" className="btn-accent text-center px-6 py-3">
                  Start Free Trial
                </a>
                <a
                  href="#pricing"
                  className="px-6 py-3 rounded-lg border border-white/40 text-white font-semibold text-center hover:bg-white/10 transition-colors"
                >
                  View Pricing
                </a>
                <a
                  href="#demo"
                  className="px-6 py-3 rounded-lg border border-white/10 text-white/80 text-center hover:text-white"
                >
                  Watch Demo
                </a>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
              <h2 className="text-xl font-semibold">Compliance Snapshot</h2>
              <p className="text-sm text-slate-300 mt-2">
                Real-time policy monitoring and automated alerts across your TCN workforce.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  'Pre-departure course tracking',
                  'Quota monitoring and termination limits',
                  'Skills Pass compliance for hospitality',
                  'Vacancy advertising automation',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-300 mt-0.5" />
                    <span className="text-sm text-slate-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {trust.map((metric) => (
              <div key={metric.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-semibold text-amber-300">{metric.value}</div>
                <div className="text-xs uppercase tracking-widest text-slate-300 mt-2">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-green font-semibold">
              Solutions
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mt-4">
              Everything You Need for Malta TCN Compliance
            </h2>
            <p className="text-slate-600 mt-4">
              Built specifically for the 2026 Labour Migration Policy with real-time tracking and
              automated compliance workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {features.map((feature) => (
              <div key={feature.title} className="card">
                <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mt-4">{feature.title}</h3>
                <p className="text-slate-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="resources" className="py-20 bg-brand-cloud">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-blue font-semibold">
                Resources
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mt-4">
                Compliance Built for Malta&apos;s 2026 Policy
              </h2>
              <p className="text-slate-600 mt-4">
                Track mandatory courses, Skills Pass requirements, renewal deadlines, and quota
                thresholds in one centralized command center.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {[
                  'Policy playbooks and checklists',
                  'Jobsplus + EURES vacancy timeline',
                  'Renewal and screening alerts',
                  'GDPR-ready data handling',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-green mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Compliance Coverage</h3>
              <div className="mt-6 space-y-4">
                {[
                  { title: 'Pre-Departure Course', desc: 'Certificate tracking and automated enrollment reminders.' },
                  { title: 'Skills Pass', desc: 'Sector-specific validation and progress monitoring.' },
                  { title: 'Quota Monitoring', desc: 'Real-time staffing ratios and termination limits.' },
                ].map((item) => (
                  <div key={item.title} className="border border-slate-100 rounded-xl p-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
            <div className="bg-slate-900 text-white rounded-3xl p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Value</p>
              <h2 className="text-3xl font-semibold mt-4">
                Everything you need to stay compliant, all in one portal.
              </h2>
              <p className="text-slate-300 mt-4">
                Built for Maltese employers navigating new regulations, TCN Comply centralizes
                every requirement so you never miss a deadline.
              </p>
              <div className="mt-6 flex flex-col gap-3 text-sm">
                <span className="badge-success">Automated documentation trails</span>
                <span className="badge-info">Live renewal and quota alerts</span>
                <span className="badge-warning">Policy change monitoring</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-2xl p-6">
                <p className="text-slate-600">
                  &ldquo;TCN Comply saved us 15 hours per month on compliance tasks.&rdquo;
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-4">HR Director, Hospitality Group</p>
              </div>
              <div className="border border-slate-200 rounded-2xl p-6">
                <p className="text-slate-600">
                  &ldquo;We finally have a single dashboard showing every renewal and Skills Pass status.&rdquo;
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-4">Operations Lead, Tourism Operator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-semibold">Get Started Today</h2>
          <p className="text-slate-300 mt-4">
            Join hundreds of Maltese employers who have simplified their TCN compliance with TCN Comply.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/pricing" className="btn-accent text-center px-6 py-3">
              View Pricing
            </a>
            <a href="/auth/register" className="btn-secondary text-center px-6 py-3">
              Start Free Trial
            </a>
          </div>
          <p className="text-sm text-slate-400 mt-6">Questions? Email hello@tcncomply.com</p>
        </div>
      </section>
    </div>
  )
}
