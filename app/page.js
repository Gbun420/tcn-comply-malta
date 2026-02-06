import { BookOpen, Shield, BarChart3, Users, Clock, CheckCircle, Target } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: "Pre-Departure Course Tracking",
      description: "Ensure compliance with Malta's mandatory €250 course requirement for all TCNs. Real-time status updates and certificate management."
    },
    {
      icon: Shield,
      title: "Skills Pass Integration",
      description: "Automated tracking for hospitality and tourism sector requirements with two-phase certification process management."
    },
    {
      icon: BarChart3,
      title: "Quota Monitoring",
      description: "Real-time alerts for workforce and termination limits based on company size. Prevent hiring freezes with predictive analytics."
    },
    {
      icon: Users,
      title: "Vacancy Compliance",
      description: "Jobsplus and EURES posting automation with 3-week mandatory advertising period tracking and compliance documentation."
    },
    {
      icon: Clock,
      title: "Permit Renewal Automation",
      description: "90-day and 30-day renewal alerts with health screening requirement tracking and electronic salary proof integration."
    },
    {
      icon: Target,
      title: "GDPR Compliance Hub",
      description: "Built-in data protection with encryption, consent management, and automated data subject request fulfillment."
    }
  ]

  const complianceItems = [
    {
      title: "2026 Labour Migration Policy",
      items: [
        "Mandatory Pre-Departure Course (€250)",
        "3-week vacancy advertising on Jobsplus + EURES",
        "Electronic salary payment verification",
        "Company-size based quota monitoring"
      ]
    },
    {
      title: "Sector Requirements",
      items: [
        "Skills Pass for hospitality/tourism",
        "Two-phase certification process",
        "Sector-specific training modules"
      ]
    },
    {
      title: "Employer Obligations",
      items: [
        "Workforce application limits",
        "Termination rate monitoring",
        "Renewal deadline compliance",
        "Disability employment quota (2%)"
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            TCN Compliance Made Simple for <span className="text-amber-400">Maltese Employers</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Navigate the 2026 Labour Migration Policy with confidence. Automate TCN onboarding, tracking, and compliance in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors">
              Start Free Trial
            </button>
            <button className="bg-transparent border-2 border-slate-300 hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need for Malta TCN Compliance</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Built specifically for the 2026 Labour Migration Policy with real-time tracking and automated compliance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="compliance" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Malta 2026 Compliance Coverage</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every aspect of the new Labour Migration Policy handled automatically.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {complianceItems.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Maltese Employers Trust TCN Comply</h2>
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            <div>
              <div className="text-4xl font-bold mb-2 text-amber-400">120,000+</div>
              <div className="text-slate-300">TCN Applications Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-amber-400">98%</div>
              <div className="text-slate-300">Compliance Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-amber-400">70%</div>
              <div className="text-slate-300">Time Savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-amber-400">€200k+</div>
              <div className="text-slate-300">Saved in Penalties</div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Get Started Today</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of Maltese employers who have simplified their TCN compliance with TCN Comply Malta.
          </p>
          
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Development Version</h3>
                <p className="text-slate-600">
                  This deployment is maintained by Glenn Bundy for testing purposes.
                </p>
                <p className="text-slate-800 font-medium mt-2">
                  Contact: <a href="mailto:bundyglenn@gmail.com" className="text-amber-600 hover:underline">
                    bundyglenn@gmail.com
                  </a>
                </p>
              </div>
              <button className="btn-primary">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
