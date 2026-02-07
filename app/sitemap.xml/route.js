import { INDEXABLE_ROUTES } from '../../lib/public-pages.js'
import { siteUrl } from '../../lib/site.js'

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${INDEXABLE_ROUTES.map(
  (route) =>
    `  <url><loc>${siteUrl}${route}</loc><changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${route === '/' ? '1.0' : '0.7'}</priority></url>`
).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
