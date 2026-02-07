import './globals.css'
import { Mail, Phone } from 'lucide-react'
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE,
  SITE_NAME,
  SITE_SUPPORT_TAGLINE,
} from '../lib/site-content.js'

export const metadata = {
  title: `${SITE_NAME} - Automated TCN Compliance for Maltese Employers | 2026 Labour Migration Policy`,
  description:
    'Streamline Malta TCN compliance with automated pre-departure course tracking, Skills Pass integration, and quota monitoring. Stay compliant with the 2026 Labour Migration Policy.',
  keywords: [
    'Malta TCN compliance',
    'Third-Country Nationals Malta',
    '2026 Labour Migration Policy',
    'Malta immigration software',
    'TCN onboarding Malta',
    'Jobsplus integration Malta',
    'Skills Pass tracking',
    'Malta employer compliance',
    'Pre-departure course Malta',
    'Third-country national compliance',
    'Malta work permits',
    'Malta immigration 2026',
    'TCN hiring Malta',
    'Malta labor migration',
    'compliance platform Malta',
    'Malta business software',
    'HR compliance Malta',
  ].join(', '),
  authors: [{ name: SITE_NAME, email: SITE_CONTACT_EMAIL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL('https://tcn-comply-malta.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} - Automated TCN Compliance Platform`,
    description:
      'Navigate Malta\'s 2026 Labour Migration Policy with confidence. Automate TCN onboarding, tracking, and compliance.',
    type: 'website',
    locale: 'en_MT',
    siteName: SITE_NAME,
    url: 'https://tcn-comply-malta.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - TCN Compliance Made Simple`,
    description: "Navigate Malta's 2026 Labour Migration Policy with confidence",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    "TCN compliance platform for Maltese employers managing Third-Country Nationals under Malta's 2026 Labour Migration Policy",
  url: 'https://tcn-comply-malta.vercel.app',
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: 'https://tcn-comply-malta.vercel.app',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MT',
    },
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://tcn-comply-malta.vercel.app" />
      </head>
      <body className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <a href="/" className="flex items-center space-x-3">
              <img src="/logo.svg" alt="TCN Comply Malta Logo" className="h-12 w-12" />
              <div>
                <span className="text-xl font-bold text-slate-800">TCN Comply</span>
                <span className="text-xl font-bold text-amber-500">Malta</span>
              </div>
            </a>

            <nav className="hidden space-x-8 md:flex">
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#compliance" className="nav-link">
                Compliance
              </a>
              <a href="#contact" className="nav-link">
                Contact
              </a>
              <a href="/auth/login" className="btn-primary">
                Login
              </a>
            </nav>

            <span className="hidden text-sm text-slate-500 sm:inline">{SITE_SUPPORT_TAGLINE}</span>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-slate-800 py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="mb-4 flex items-center space-x-3">
                  <img src="/logo.svg" alt="TCN Comply Malta Logo" className="h-10 w-10" />
                  <span className="font-semibold">{SITE_NAME}</span>
                </div>
                <p className="text-sm text-slate-300">
                  Navigate Malta&apos;s 2026 Labour Migration Policy with confidence.
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Contact</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span>{SITE_CONTACT_PHONE}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Compliance</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>Malta 2026 Labour Migration Policy</li>
                  <li>GDPR Compliant</li>
                  <li>Jobsplus Integration</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
              <p>© 2026 {SITE_NAME}. All rights reserved.</p>
              <p className="mt-2">
                <a href="/privacy" className="hover:text-amber-400">
                  Privacy Policy
                </a>{' '}
                •
                <a href="/terms" className="ml-2 hover:text-amber-400">
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
