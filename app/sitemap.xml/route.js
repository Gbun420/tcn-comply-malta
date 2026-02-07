export async function GET() {
  const baseUrl = 'https://tcn-comply-malta.vercel.app'
  const pages = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/auth/login', changefreq: 'monthly', priority: '0.8' },
    { url: '/auth/register', changefreq: 'monthly', priority: '0.8' },
    { url: '/dashboard', changefreq: 'daily', priority: '0.9' },
    { url: '/dashboard/employees', changefreq: 'daily', priority: '0.8' },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms', changefreq: 'yearly', priority: '0.3' },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
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
