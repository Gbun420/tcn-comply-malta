import './globals.css'
import { Mail, Phone } from 'lucide-react'

export const metadata = {
  title: 'TCN Comply Malta - Automated TCN Compliance for Maltese Employers | 2026 Labour Migration Policy',
  description: 'Streamline Malta TCN compliance with automated pre-departure course tracking, Skills Pass integration, and quota monitoring. Stay compliant with the 2026 Labour Migration Policy.',
  keywords: [
    'Malta TCN compliance', 'Third-Country Nationals Malta', '2026 Labour Migration Policy',
    'Malta immigration software', 'TCN onboarding Malta', 'Jobsplus integration Malta',
    'Skills Pass tracking', 'Malta employer compliance', 'Pre-departure course Malta',
    'Third-country national compliance', 'Malta work permits', 'Malta immigration 2026',
    'TCN hiring Malta', 'Malta labor migration', 'compliance platform Malta',
    'bundyglenn@gmail.com', 'Malta business software', 'HR compliance Malta'
  ].join(', '),
  authors: [{ name: 'Glenn Bundy', email: 'bundyglenn@gmail.com' }],
  creator: 'Glenn Bundy',
  publisher: 'TCN Comply Malta',
  metadataBase: new URL('https://tcn-comply-malta.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TCN Comply Malta - Automated TCN Compliance Platform',
    description: 'Navigate Malta\'s 2026 Labour Migration Policy with confidence. Automate TCN onboarding, tracking, and compliance.',
    type: 'website',
    locale: 'en_MT',
    siteName: 'TCN Comply Malta',
    url: 'https://tcn-comply-malta.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TCN Comply Malta - TCN Compliance Made Simple',
    description: 'Navigate Malta\'s 2026 Labour Migration Policy with confidence',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': 'TCN Comply Malta',
  'applicationCategory': 'BusinessApplication',
  'operatingSystem': 'Web',
  'description': 'TCN compliance platform for Maltese employers managing Third-Country Nationals under Malta\'s 2026 Labour Migration Policy',
  'url': 'https://tcn-comply-malta.vercel.app',
  'author': {
    '@type': 'Organization',
    'name': 'TCN Comply Malta',
    'url': 'https://tcn-comply-malta.vercel.app',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'MT'
    }
  },
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'EUR'
  }
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
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <a href="/" className="flex items-center space-x-3">
                <img src="/logo.svg" alt="TCN Comply Malta Logo" className="w-12 h-12" />
                <div>
                  <span className="text-xl font-bold text-slate-800">TCN Comply</span>
                  <span className="text-xl font-bold text-amber-500">Malta</span>
                </div>
              </a>
              
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="nav-link">Features</a>
                <a href="#compliance" className="nav-link">Compliance</a>
                <a href="#contact" className="nav-link">Contact</a>
                <a href="/auth/login" className="btn-primary">Login</a>
              </nav>
              
              <div className="hidden md:flex items-center">
                <a href="/auth/register" className="btn-accent">Free Trial</a>
              </div>
            </div>
          </div>
        </header>

        <main>
          {children}
        </main>

        <footer className="bg-slate-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img src="/logo.svg" alt="TCN Comply Malta Logo" className="w-10 h-10" />
                  <span className="font-semibold">TCN Comply Malta</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Navigate Malta's 2026 Labour Migration Policy with confidence.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href="mailto:bundyglenn@gmail.com">bundyglenn@gmail.com</a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+356 XXXX XXXX</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Compliance</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>Malta 2026 Labour Migration Policy</li>
                  <li>GDPR Compliant</li>
                  <li>Jobsplus Integration</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
              <p>© 2024 TCN Comply Malta. Development version by Glenn Bundy.</p>
              <p className="mt-2">
                <a href="/privacy" className="hover:text-amber-400">Privacy Policy</a> • 
                <a href="/terms" className="hover:text-amber-400 ml-2">Terms of Service</a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
