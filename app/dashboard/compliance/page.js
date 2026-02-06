import PortalShell from '../../../components/PortalShell.js'

export default function CompliancePage() {
  return (
    <PortalShell
      title="Compliance Tracking"
      subtitle="Monitor course, Skills Pass, quota, and vacancy compliance"
      actions={<button className="btn-accent">New Compliance Check</button>}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Compliance Overview</h2>
        <p className="text-sm text-slate-600 mt-2">
          Connect your data sources to see live compliance status across all TCN workflows.
        </p>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {[
            'Pre-Departure Course',
            'Skills Pass',
            'Quota Monitoring',
            'Vacancy Compliance',
          ].map((item) => (
            <div key={item} className="border border-slate-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-slate-900">{item}</p>
              <p className="text-xs text-slate-500 mt-1">Awaiting live data.</p>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  )
}
