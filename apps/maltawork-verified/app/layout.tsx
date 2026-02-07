import './globals.css'
import type { ReactNode } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'MaltaWork Verified',
  description: 'Malta-focused verified jobs and anonymous workplace reviews with pre-moderation.',
}

function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          MaltaWork Verified
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/jobs" className="hover:underline">
            Jobs
          </Link>
          <Link href="/employers" className="hover:underline">
            Employers
          </Link>
          <Link href="/reviews/new" className="hover:underline">
            Write a review
          </Link>
          <Link href="/account" className="hover:underline">
            Account
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-600">
        <div className="flex flex-wrap gap-3">
          <Link href="/legal/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/legal/review-guidelines" className="hover:underline">
            Review guidelines
          </Link>
          <Link href="/dsa/notice" className="hover:underline">
            Notice & action
          </Link>
          <Link href="/dsa/appeal" className="hover:underline">
            Appeal/complaint
          </Link>
          <Link href="/transparency" className="hover:underline">
            Transparency
          </Link>
        </div>
        <p className="mt-3">
          Safety note: Reviews and employer responses are pre-moderated and only become public after
          Admin publish. Evidence is private.
        </p>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
