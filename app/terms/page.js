import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'
import { SITE_CONTACT_EMAIL, SITE_NAME } from '../../lib/site-content.js'

export const metadata = buildPageMetadata({
  ...PUBLIC_PAGE_COPY.terms,
  keywords: ['terms of service Malta', 'compliance platform terms'],
})

const clauses = [
  {
    title: '1. Service Scope',
    copy: `${SITE_NAME} provides software tools to support compliance workflow visibility. The platform does not provide legal advice.`,
  },
  {
    title: '2. Account Responsibilities',
    copy: 'You are responsible for maintaining account security and ensuring data submitted to the platform is accurate and lawful.',
  },
  {
    title: '3. Regulatory Responsibility',
    copy: 'Employers remain responsible for meeting all legal obligations under applicable Maltese regulations.',
  },
  {
    title: '4. Acceptable Use',
    copy: 'You agree not to misuse the service, attempt unauthorized access, or upload data that violates applicable law.',
  },
]

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <GlassCard intense className="p-7 md:p-9">
        <span className="glass-chip">Legal</span>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-200">
          Last updated: {new Date().toLocaleDateString('en-MT')}
        </p>
      </GlassCard>

      {clauses.map((clause) => (
        <GlassCard key={clause.title} className="p-6 md:p-7">
          <h2 className="font-display text-2xl font-semibold text-white">{clause.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-100/95">{clause.copy}</p>
        </GlassCard>
      ))}

      <GlassCard className="p-6">
        <h2 className="font-display text-2xl font-semibold text-white">Contact</h2>
        <p className="mt-3 text-sm text-slate-100/95">
          For terms-related questions, contact{' '}
          <a
            className="font-semibold text-cyan-100 underline underline-offset-4"
            href={`mailto:${SITE_CONTACT_EMAIL}`}
          >
            {SITE_CONTACT_EMAIL}
          </a>
          .
        </p>
      </GlassCard>
    </div>
  )
}
