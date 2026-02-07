import { getStableLastModified, SITE_URL } from '../../lib/seo.js'

export async function GET() {
  const baseUrl = SITE_URL
  const lastmod = getStableLastModified()
  const pages = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/audit-app', changefreq: 'weekly', priority: '0.8' },
    { url: '/solutions', changefreq: 'weekly', priority: '0.8' },
    { url: '/coverage', changefreq: 'weekly', priority: '0.8' },
    { url: '/workflow', changefreq: 'weekly', priority: '0.8' },
    { url: '/contact', changefreq: 'weekly', priority: '0.8' },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms', changefreq: 'yearly', priority: '0.3' },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      <lastmod>${lastmod}</lastmod>
    </url>
  `
    )
    .join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
