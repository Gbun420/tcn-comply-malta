import PortalShell from '../../../components/PortalShell.js'

export default function SupportPage() {
  return (
    <PortalShell
      title="Support"
      subtitle="Get help with compliance workflows"
      actions={<button className="btn-accent">Open Ticket</button>}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Support Center</h2>
        <p className="text-sm text-slate-600 mt-2">
          Access onboarding guides, compliance FAQs, and direct support from our team.
        </p>
        <div className="mt-6 space-y-4">
          <div className="border border-slate-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-900">Knowledge Base</p>
            <p className="text-xs text-slate-500 mt-1">Search policy guides and how-to articles.</p>
          </div>
          <div className="border border-slate-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-900">Live Chat</p>
            <p className="text-xs text-slate-500 mt-1">Connect with a compliance specialist.</p>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
