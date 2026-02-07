import { siteUrl } from '../../lib/site.js'

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /dashboard/
Disallow: /auth/

Sitemap: ${siteUrl}/sitemap.xml
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
