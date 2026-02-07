import Link from 'next/link'
import { GlassCard } from '../components/ui/glass-card.js'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <GlassCard intense className="p-8 text-center md:p-10">
        <p className="glass-chip mx-auto">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-200">
          The page you requested is not available. Use the links below to get back to your
          compliance workspace.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="cta-primary">
            Return Home
          </Link>
          <Link href="/auth/login" className="cta-ghost">
            Open Portal
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
