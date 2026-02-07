import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { SiteFooter } from '../components/site/site-footer.js'
import { SiteHeader } from '../components/site/site-header.js'
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE,
  SITE_NAME,
  SITE_SUPPORT_TAGLINE,
} from '../lib/site-content.js'

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
})

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
      "Navigate Malta's 2026 Labour Migration Policy with confidence. Automate TCN onboarding, tracking, and compliance.",
    type: 'website',
    locale: 'en_MT',
    siteName: SITE_NAME,
    url: 'https://tcn-comply-malta.vercel.app',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - TCN Compliance Made Simple`,
    description: "Navigate Malta's 2026 Labour Migration Policy with confidence",
    images: ['/og-image.svg'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <span className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-[90px]" />
          <span className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-emerald-300/20 blur-[110px]" />
          <span className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-400/25 blur-[100px]" />
        </div>

        <div className="relative z-10 min-h-screen">
          <SiteHeader supportTagline={SITE_SUPPORT_TAGLINE} />
          <main>{children}</main>
          <SiteFooter
            siteName={SITE_NAME}
            contactEmail={SITE_CONTACT_EMAIL}
            contactPhone={SITE_CONTACT_PHONE}
          />
        </div>
      </body>
    </html>
  )
}
