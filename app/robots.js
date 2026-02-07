import { siteUrl } from '../lib/site.js'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/auth/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
