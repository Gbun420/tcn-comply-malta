import Link from 'next/link'
import { StatusPanel } from '../../components/site/status-panel.js'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.status)

export default function StatusPage() {
  return (
    <MarketingPageShell
      kicker="Status"
      title="Platform health and availability"
      description="Service health is monitored continuously and surfaced on this page for operational transparency."
      actions={[
        <Link key="demo" href="/demo" className="cta-ghost inline-flex items-center gap-2">
          Book demo
        </Link>,
      ]}
    >
      <GlassCard className="p-6">
        <StatusPanel />
      </GlassCard>
    </MarketingPageShell>
  )
}
