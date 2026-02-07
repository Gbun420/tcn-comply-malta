import { siteUrl } from '../lib/site.js'

const PUBLIC_ROUTES = [
  '/',
  '/solutions',
  '/coverage',
  '/workflow',
  '/audit-app',
  '/contact',
  '/privacy',
  '/terms',
]

export default function sitemap() {
  return PUBLIC_ROUTES.map((pathValue) => ({
    url: `${siteUrl}${pathValue}`,
    changeFrequency: pathValue === '/' ? 'weekly' : 'monthly',
    priority: pathValue === '/' ? 1 : 0.7,
  }))
}
