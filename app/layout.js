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
import { BASE_KEYWORDS, OG_IMAGE_PATH } from '../lib/seo.js'
import { siteUrl } from '../lib/site.js'

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
  title: {
    default: `${SITE_NAME} | Employer TCN Compliance Platform`,
    template: `%s`,
  },
  description:
    'Audit-ready compliance workspace for Maltese employers managing Third-Country Nationals under the 2026 Labour Migration Policy.',
  keywords: BASE_KEYWORDS.join(', '),
  authors: SITE_CONTACT_EMAIL ? [{ name: SITE_NAME, email: SITE_CONTACT_EMAIL }] : [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} | Employer TCN Compliance Platform`,
    description: 'Audit-ready compliance workspace for Maltese employers managing TCN obligations.',
    type: 'website',
    locale: 'en_MT',
    siteName: SITE_NAME,
    url: siteUrl,
    images: [OG_IMAGE_PATH],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Employer TCN Compliance Platform`,
    description: 'Audit-ready compliance workspace for Maltese employers managing TCN obligations.',
    images: [OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <span className="absolute -left-48 top-0 h-80 w-80 rounded-full bg-sky-300/12 blur-[110px]" />
          <span className="absolute right-[-8rem] top-1/3 h-96 w-96 rounded-full bg-teal-300/10 blur-[130px]" />
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
