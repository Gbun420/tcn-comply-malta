import { SITE_CONTACT_EMAIL, SITE_NAME } from '../../lib/site-content.js'

export const metadata = {
  title: `Terms of Service - ${SITE_NAME}`,
  description: `Terms of Service for ${SITE_NAME}.`,
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Terms of Service</h1>

      <div className="prose prose-lg text-gray-600">
        <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-MT')}</p>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">1. Service Scope</h2>
          <p>
            {SITE_NAME} provides software tools to help employers track and manage workforce
            compliance workflows. The platform is not a law firm and does not provide legal advice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">2. Account Responsibilities</h2>
          <p>
            You are responsible for keeping your account credentials secure and for ensuring the
            accuracy of data entered into the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">3. Compliance Responsibility</h2>
          <p>
            Employers remain responsible for meeting all legal obligations under applicable Maltese
            regulations. Platform workflows and reminders support, but do not replace, legal review.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">4. Contact</h2>
          <p>
            For terms-related questions, contact{' '}
            <a className="text-amber-600 hover:underline" href={`mailto:${SITE_CONTACT_EMAIL}`}>
              {SITE_CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
