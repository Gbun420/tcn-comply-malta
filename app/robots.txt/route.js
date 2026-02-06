export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://tcn-comply-malta.vercel.app/sitemap.xml

# Disallow admin/private areas
Disallow: /api/
Disallow: /dashboard/
Disallow: /auth/
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
