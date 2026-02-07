import { GlassCard } from '../../components/ui/glass-card.js'
import { buildPageMetadata } from '../../lib/seo.js'
import { PUBLIC_PAGE_COPY } from '../../lib/site-copy.js'
import { SITE_CONTACT_EMAIL, SITE_CONTACT_LOCATION, SITE_NAME } from '../../lib/site-content.js'

export const metadata = buildPageMetadata({
  ...PUBLIC_PAGE_COPY.privacy,
  keywords: ['privacy policy Malta', 'GDPR compliance platform'],
})

const sections = [
  {
    title: '1. Introduction',
    content: [
      `${SITE_NAME} ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information while you use the platform.`,
      `By using ${SITE_NAME}, you agree to the collection and use of information in accordance with this policy.`,
    ],
  },
  {
    title: '2. Information We Collect',
    bullets: [
      'Personal data such as names, contact details, and company information.',
      'Operational compliance records related to workforce workflows.',
      'Technical data including browser metadata and session security logs.',
    ],
  },
  {
    title: '3. How We Use Information',
    bullets: [
      'Deliver and improve compliance tracking services.',
      'Authenticate users and secure access to the employer console.',
      'Generate compliance summaries and audit-support exports.',
      'Communicate account, policy, and support updates.',
    ],
  },
  {
    title: '4. Data Protection and GDPR',
    content: [
      `${SITE_NAME} is designed to support GDPR-aligned controls and secure operational data handling.`,
    ],
    bullets: [
      'Access, rectification, and portability rights for personal data.',
      'Data minimization and access controls for compliance records.',
      'Secure storage and transport protections for sensitive information.',
    ],
  },
  {
    title: '5. Retention and Security',
    content: [
      'Data is retained only as long as required for service delivery and regulatory obligations.',
      'We apply encryption, access controls, and audit logging to protect customer data.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <GlassCard intense className="p-7 md:p-9">
        <span className="glass-chip">Legal</span>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-200">
          Last updated: {new Date().toLocaleDateString('en-MT')}
        </p>
      </GlassCard>

      {sections.map((section) => (
        <GlassCard key={section.title} className="p-6 md:p-7">
          <h2 className="font-display text-2xl font-semibold text-white">{section.title}</h2>

          {section.content?.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-sm leading-7 text-slate-100/95">
              {paragraph}
            </p>
          ))}

          {section.bullets ? (
            <ul className="mt-4 space-y-2 text-sm text-slate-100/95">
              {section.bullets.map((item) => (
                <li key={item} className="rounded-xl border border-white/12 bg-white/7 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </GlassCard>
      ))}

      <GlassCard className="p-6">
        <h2 className="font-display text-2xl font-semibold text-white">Contact</h2>
        <p className="mt-3 text-sm text-slate-100/95">For privacy-related inquiries:</p>
        <p className="mt-2 text-sm text-slate-100">
          <strong>{SITE_NAME} Privacy Team</strong>
        </p>
        {SITE_CONTACT_EMAIL ? (
          <p className="text-sm text-slate-100">Email: {SITE_CONTACT_EMAIL}</p>
        ) : (
          <p className="text-sm text-slate-100">Email available on request via contact page.</p>
        )}
        <p className="text-sm text-slate-100">Location: {SITE_CONTACT_LOCATION}</p>
      </GlassCard>
    </div>
  )
}
