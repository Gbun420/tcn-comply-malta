import { buildPageMetadata } from '../../lib/seo.js'

export const metadata = buildPageMetadata({
  title: 'Employer Dashboard',
  description: 'Authenticated dashboard for employer compliance operations and audit workflows.',
  pathname: '/dashboard',
  index: false,
  follow: false,
  keywords: ['employer dashboard', 'authenticated compliance workspace'],
})

export default function DashboardLayout({ children }) {
  return children
}
