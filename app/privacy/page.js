export const metadata = {
  title: 'Privacy Policy - TCN Comply Malta',
  description: 'Privacy policy for TCN Comply Malta - Automated TCN compliance platform for Maltese employers.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg text-gray-600">
        <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-MT')}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="mb-4">
            TCN Comply Malta (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use 
            our TCN compliance management platform.
          </p>
          <p>
            By using TCN Comply Malta, you agree to the collection and use of information in accordance 
            with this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Name and contact information (email address)</li>
            <li>Employer/organization details</li>
            <li>TCN (Third-Country National) employee data</li>
            <li>Compliance documentation and records</li>
          </ul>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Technical Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address and browser type</li>
            <li>Usage data and analytics</li>
            <li>Session cookies for authentication</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our TCN compliance services</li>
            <li>Authenticate users and secure access to the platform</li>
            <li>Track TCN employee compliance status</li>
            <li>Generate compliance reports and documentation</li>
            <li>Communicate with users about their accounts</li>
            <li>Improve our services and user experience</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Protection (GDPR Compliance)</h2>
          <p className="mb-4">
            TCN Comply Malta is designed to comply with the General Data Protection Regulation (GDPR) 
            and Malta&apos;s Data Protection Act.
          </p>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your Rights</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
            <li>Right to data portability</li>
            <li>Right to restrict processing</li>
            <li>Right to object to processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational security measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>HTTP-only cookies for session management</li>
            <li>Secure authentication protocols</li>
            <li>Regular security assessments</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
          <p className="mb-4">We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Vercel</strong> - Hosting and deployment (Germany/EU data centers)</li>
            <li><strong>Firebase</strong> - Authentication and database (GDPR compliant)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
          <p className="mb-4">We use essential cookies for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>User authentication (session management)</li>
            <li>Security and fraud prevention</li>
            <li>Remembering your preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
          <p className="mb-4">
            We retain your personal data for as long as your account is active or as needed to 
            provide our services. After account termination, data is retained for legal compliance 
            purposes in accordance with Malta&apos;s immigration requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
          <p className="mb-4">For privacy-related inquiries or to exercise your rights:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Glenn Bundy</strong></p>
            <p>Email: bundyglenn@gmail.com</p>
            <p>Malta</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>
      </div>
    </div>
  )
}
