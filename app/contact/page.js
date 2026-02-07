import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MarketingPageShell } from '../../components/site/marketing-page-shell.js'
import { GlassCard } from '../../components/ui/glass-card.js'
import { PORTAL_OFFERINGS } from '../../lib/portal-content.js'

export default function ContactPage() {
  return (
    <MarketingPageShell
      kicker="Contact"
      title="Plan client rollout, onboarding, and support with our compliance team"
      description="Use these channels to scope implementation, align portal modules to your process, and coordinate testing with your stakeholders."
      actions={[
        <Link
          key="register"
          href="/auth/register"
          className="cta-primary inline-flex items-center gap-2"
        >
          Start Client Onboarding
          <ArrowUpRight className="h-4 w-4" />
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
