import { buildPageMetadata } from '../../lib/seo.js'
import { AUTH_PAGE_COPY } from '../../lib/site-copy.js'

export const metadata = buildPageMetadata({
  title: AUTH_PAGE_COPY.title,
  description: AUTH_PAGE_COPY.description,
  pathname: '/auth/login',
  index: false,
  follow: false,
  keywords: ['employer login', 'secure compliance portal'],
})

export default function AuthLayout({ children }) {
  return children
}
