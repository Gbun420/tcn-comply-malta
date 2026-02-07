import { BarChart3, BookOpen, CheckCircle, Clock, Shield, Target, Users } from 'lucide-react'
import { SITE_CONTACT_EMAIL, SITE_NAME } from '../lib/site-content.js'

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'Pre-Departure Course Tracking',
      description:
        "Ensure compliance with Malta's mandatory €250 course requirement for all TCNs. Real-time status updates and certificate management.",
    },
    {
      icon: Shield,
      title: 'Skills Pass Integration',
      description:
        'Automated tracking for hospitality and tourism sector requirements with two-phase certification process management.',
    },
    {
      icon: BarChart3,
      title: 'Quota Monitoring',
      description:
        'Real-time alerts for workforce and termination limits based on company size. Prevent hiring freezes with predictive analytics.',
    },
    {
      icon: Users,
      title: 'Vacancy Compliance',
      description:
        'Jobsplus and EURES posting automation with 3-week mandatory advertising period tracking and compliance documentation.',
    },
    {
      icon: Clock,
      title: 'Permit Renewal Automation',
      description:
        '90-day and 30-day renewal alerts with health screening requirement tracking and electronic salary proof integration.',
    },
    {
      icon: Target,
      title: 'GDPR Compliance Hub',
      description:
        'Built-in data protection with encryption, consent management, and automated data subject request fulfillment.',
    },
  ]

  const complianceItems = [
    {
      title: '2026 Labour Migration Policy',
      items: [
        'Mandatory Pre-Departure Course (€250)',
        '3-week vacancy advertising on Jobsplus + EURES',
        'Electronic salary payment verification',
        'Company-size based quota monitoring',
      ],
    },
    {
      title: 'Sector Requirements',
      items: [
        'Skills Pass for hospitality/tourism',
        'Two-phase certification process',
        'Sector-specific training modules',
      ],
    },
    {
      title: 'Employer Obligations',
      items: [
        'Workforce application limits',
        'Termination rate monitoring',
        'Renewal deadline compliance',
        'Disability employment quota (2%)',
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            TCN Compliance Made Simple for <span className="text-amber-400">Maltese Employers</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-slate-200 md:text-2xl">
            Navigate the 2026 Labour Migration Policy with confidence. Automate TCN onboarding,
            tracking, and compliance in one platform.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-amber-600">
              Start Free Trial
            </button>
            <button className="rounded-lg border-2 border-slate-300 bg-transparent px-8 py-3 font-semibold transition-colors hover:bg-white/10">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Everything You Need for Malta TCN Compliance
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Built specifically for the 2026 Labour Migration Policy with real-time tracking and
              automated compliance.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-100 bg-slate-50 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                  <feature.icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="compliance" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Malta 2026 Compliance Coverage
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Every aspect of the new Labour Migration Policy handled automatically.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {complianceItems.map((section, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-4 text-xl font-semibold text-slate-900">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Why Maltese Employers Trust TCN Comply</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-2 text-4xl font-bold text-amber-400">120,000+</div>
              <div className="text-slate-300">TCN Applications Processed</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-amber-400">98%</div>
              <div className="text-slate-300">Compliance Rate</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-amber-400">70%</div>
              <div className="text-slate-300">Time Savings</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-amber-400">€200k+</div>
              <div className="text-slate-300">Saved in Penalties</div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">Get Started Today</h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-600">
            Join hundreds of Maltese employers who have simplified their TCN compliance with{' '}
            {SITE_NAME}.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-left">
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                  Ready to onboard your team?
                </h3>
                <p className="text-slate-600">
                  Our compliance specialists can help you get started quickly.
                </p>
                <p className="mt-2 font-medium text-slate-800">
                  Contact:{' '}
                  <a
                    href={`mailto:${SITE_CONTACT_EMAIL}`}
                    className="text-amber-600 hover:underline"
                  >
                    {SITE_CONTACT_EMAIL}
                  </a>
                </p>
              </div>
              <button className="btn-primary">Request Demo</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
