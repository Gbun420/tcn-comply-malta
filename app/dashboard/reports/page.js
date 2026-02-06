import PortalShell from '../../../components/PortalShell.js'

export default function ReportsPage() {
  return (
    <PortalShell
      title="Reports"
      subtitle="Export compliance summaries and audit trails"
      actions={<button className="btn-accent">Generate Report</button>}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Reporting Center</h2>
        <p className="text-sm text-slate-600 mt-2">
          Generate PDF exports, compliance timelines, and audit-ready summaries.
        </p>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {[
            'Monthly compliance snapshot',
            'Renewal pipeline summary',
            'Skills Pass status export',
            'Vacancy posting history',
          ].map((item) => (
            <div key={item} className="border border-slate-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-slate-900">{item}</p>
              <p className="text-xs text-slate-500 mt-1">Ready to generate.</p>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  )
}
