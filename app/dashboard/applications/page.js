import PortalShell from '../../../components/PortalShell.js'

export default function ApplicationsPage() {
  return (
    <PortalShell
      title="Applications"
      subtitle="Track TCN applications from intake to approval"
      actions={<button className="btn-accent">New Application</button>}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Application Workflow</h2>
        <p className="text-sm text-slate-600 mt-2">
          Start new applications and monitor progress in real time.
        </p>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {[
            'Pre-Application Checklist',
            'Candidate Information',
            'Document Verification',
            'Review and Submit',
          ].map((item) => (
            <div key={item} className="border border-slate-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-slate-900">{item}</p>
              <p className="text-xs text-slate-500 mt-1">Pending setup.</p>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  )
}
