import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { PORTAL_OFFERINGS } from '../../lib/portal-content.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'

export const metadata = buildPageMetadata(PUBLIC_PAGE_COPY.contact)

export default function ContactPage() {
  return (
    <MarketingPageShell
      kicker="Contact"
      title="Plan client rollout, onboarding, and support with our compliance team"
      description="Use these channels to scope implementation, align portal modules to your process, and confirm integration/security requirements with stakeholders."
      actions={[
        <Link
          key="demo"
          href="/demo"
          className="cta-primary inline-flex items-center gap-2"
        >
          Book Demo
          <ArrowUpRight className="h-4 w-4" />
        </Link>,
        <Link key="pricing" href="/pricing" className="cta-ghost inline-flex items-center gap-2">
          View Pricing
        </Link>,
      ]}
    >
      <div className="glass-grid md:grid-cols-3">
        {PORTAL_OFFERINGS.contactChannels.map((channel) => (
          <GlassCard key={channel.label} className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-100">{channel.label}</p>
            {channel.href ? (
              channel.href.startsWith('mailto:') ? (
                <a href={channel.href} className="mt-3 block text-lg font-semibold text-white">
                  {channel.value}
                </a>
              ) : (
                <Link href={channel.href} className="mt-3 block text-lg font-semibold text-white">
                  {channel.value}
                </Link>
              )
            ) : (
              <p className="mt-3 text-lg font-semibold text-white">{channel.value}</p>
            )}
          </GlassCard>
        ))}
      </div>
    </MarketingPageShell>
  )
}
