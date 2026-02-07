import fs from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.AUDIT_BASE_URL || 'https://tcn-comply-malta.vercel.app'
const OUTPUT_DIR = path.join(process.cwd(), 'docs', 'audits')

const INDEXABLE_ROUTES = [
  '/',
  '/audit-app',
  '/solutions',
  '/coverage',
  '/workflow',
  '/contact',
  '/privacy',
  '/terms',
]

const AUTH_ROUTES = ['/auth/login', '/auth/register']
const EXCLUDED_SITEMAP_PATHS = ['/auth/login', '/auth/register', '/dashboard']

const PROHIBITED_CLAIMS = [
  { label: 'guaranteed compliance', pattern: /guaranteed compliance/i },
  { label: 'guaranteed approval', pattern: /guaranteed approval/i },
  { label: '100% compliance or approval', pattern: /100%\s*(compliance|approval)/i },
  { label: 'unsupported success-rate claim', pattern: /\b\d{2,}\s*%\s*(success|approval|faster)/i },
]

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

function toReportPath() {
  return path.join(OUTPUT_DIR, `content-check-${stamp()}.json`)
}

async function request(pathname) {
  const url = new URL(pathname, BASE_URL).toString()
  const response = await fetch(url, {
    headers: { 'user-agent': 'TCN-Audit-Bot/1.0 (+https://tcn-comply-malta.vercel.app)' },
    redirect: 'follow',
  })
  const body = await response.text()
  return { pathname, url, status: response.status, headers: response.headers, body }
}

function readTagValue(html, pattern) {
  const match = html.match(pattern)
  if (!match?.[1]) {
    return null
  }
  return match[1].trim()
}

function parseMetadata(html) {
  return {
    title: readTagValue(html, /<title>([^<]*)<\/title>/i),
    description: readTagValue(
      html,
      /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']([^"']+)["'])[^>]*>/i
    ),
    robots: readTagValue(
      html,
      /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']([^"']+)["'])[^>]*>/i
    ),
  }
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSitemapPaths(xml) {
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g)
  const paths = []

  for (const match of matches) {
    try {
      const url = new URL(match[1])
      paths.push(url.pathname)
    } catch {
      // Ignore invalid entries and fail downstream via missing expected paths.
    }
  }

  return paths
}

function findDuplicates(values, field) {
  const map = new Map()
  for (const value of values) {
    const item = value[field]
    if (!item) continue
    const key = item.toLowerCase()
    const routes = map.get(key) || []
    routes.push(value.pathname)
    map.set(key, routes)
  }

  return Array.from(map.entries())
    .filter(([, routes]) => routes.length > 1)
    .map(([item, routes]) => ({ item, routes }))
}

async function run() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const failures = []
  const pageResults = []

  for (const pathname of INDEXABLE_ROUTES) {
    const response = await request(pathname)
    const metadata = parseMetadata(response.body)
    const text = stripHtml(response.body)

    pageResults.push({
      pathname,
      status: response.status,
      title: metadata.title,
      description: metadata.description,
      robots: metadata.robots,
    })

    if (response.status !== 200) {
      failures.push(`${pathname}: expected HTTP 200, got ${response.status}`)
      continue
    }

    if (metadata.robots?.toLowerCase().includes('noindex')) {
      failures.push(`${pathname}: indexable route has noindex robots metadata`)
    }

    for (const claim of PROHIBITED_CLAIMS) {
      if (claim.pattern.test(text)) {
        failures.push(`${pathname}: prohibited wording detected (${claim.label})`)
      }
    }
  }

  const duplicateTitles = findDuplicates(pageResults, 'title')
  const duplicateDescriptions = findDuplicates(pageResults, 'description')

  for (const duplicate of duplicateTitles) {
    failures.push(`duplicate title across routes: ${duplicate.routes.join(', ')}`)
  }

  for (const duplicate of duplicateDescriptions) {
    failures.push(`duplicate description across routes: ${duplicate.routes.join(', ')}`)
  }

  const sitemapResponse = await request('/sitemap.xml')
  const sitemapPaths = extractSitemapPaths(sitemapResponse.body)

  if (sitemapResponse.status !== 200) {
    failures.push(`sitemap.xml: expected HTTP 200, got ${sitemapResponse.status}`)
  }

  for (const expectedPath of INDEXABLE_ROUTES) {
    if (!sitemapPaths.includes(expectedPath)) {
      failures.push(`sitemap.xml: missing expected route ${expectedPath}`)
    }
  }

  for (const excludedPath of EXCLUDED_SITEMAP_PATHS) {
    if (sitemapPaths.includes(excludedPath)) {
      failures.push(`sitemap.xml: contains excluded route ${excludedPath}`)
    }
  }

  const unexpectedSitemapPaths = sitemapPaths.filter(
    (pathValue) => !INDEXABLE_ROUTES.includes(pathValue)
  )
  for (const pathValue of unexpectedSitemapPaths) {
    failures.push(`sitemap.xml: unexpected route present (${pathValue})`)
  }

  const robotsResponse = await request('/robots.txt')
  const robotsTxt = robotsResponse.body

  if (robotsResponse.status !== 200) {
    failures.push(`robots.txt: expected HTTP 200, got ${robotsResponse.status}`)
  }

  const requiredDisallowRules = ['Disallow: /api/', 'Disallow: /dashboard/', 'Disallow: /auth/']
  for (const rule of requiredDisallowRules) {
    if (!robotsTxt.includes(rule)) {
      failures.push(`robots.txt: missing rule "${rule}"`)
    }
  }

  if (!robotsTxt.includes('Sitemap:')) {
    failures.push('robots.txt: missing sitemap declaration')
  }

  const authResults = []
  for (const pathname of AUTH_ROUTES) {
    const response = await request(pathname)
    const metadata = parseMetadata(response.body)
    authResults.push({
      pathname,
      status: response.status,
      robots: metadata.robots,
    })

    if (response.status !== 200) {
      failures.push(`${pathname}: expected HTTP 200, got ${response.status}`)
      continue
    }

    if (!metadata.robots || !metadata.robots.toLowerCase().includes('noindex')) {
      failures.push(`${pathname}: expected noindex robots metadata`)
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    passCount: pageResults.length + authResults.length + 2 - failures.length,
    failCount: failures.length,
    pages: pageResults,
    authPages: authResults,
    sitemapPaths,
    failures,
  }

  const reportPath = toReportPath()
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2))

  console.log(`Content audit report: ${reportPath}`)
  if (failures.length > 0) {
    console.error('Content audit failures:')
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exitCode = 1
  }
}

run().catch((error) => {
  console.error('Content audit failed:', error)
  process.exitCode = 1
})
