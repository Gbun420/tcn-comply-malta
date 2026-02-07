import fs from 'node:fs/promises'
import path from 'node:path'
import lighthouse from 'lighthouse'
import { launch as launchChrome } from 'chrome-launcher'
import { INDEXABLE_ROUTES, LIGHTHOUSE_SEO_ROUTES } from '../../lib/public-pages.js'

const BASE_URL = process.env.AUDIT_BASE_URL || 'https://tcn-comply-malta.vercel.app'
const CANONICAL_BASE_URL =
  process.env.AUDIT_CANONICAL_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://tcn-comply-malta.vercel.app'
const MIN_SEO_SCORE = Number.parseInt(process.env.AUDIT_MIN_SEO_SCORE || '95', 10)
const OUTPUT_DIR = path.join(process.cwd(), 'docs', 'audits')

const SEO_SCORE_ROUTES = LIGHTHOUSE_SEO_ROUTES

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

function toReportPath() {
  return path.join(OUTPUT_DIR, `seo-check-${stamp()}.json`)
}

function normalizeComparableUrl(value) {
  try {
    const url = new URL(value)
    if (url.pathname.endsWith('/') && url.pathname !== '/') {
      url.pathname = url.pathname.slice(0, -1)
    }
    return url.toString()
  } catch {
    return value
  }
}

function buildExpectedCanonical(route) {
  return normalizeComparableUrl(new URL(route, CANONICAL_BASE_URL).toString())
}

function readTagValue(html, pattern) {
  const match = html.match(pattern)
  if (!match?.[1]) {
    return null
  }
  return match[1].trim()
}

function parsePageMetadata(html) {
  const title = readTagValue(html, /<title>([^<]*)<\/title>/i)
  const description = readTagValue(
    html,
    /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']([^"']+)["'])[^>]*>/i
  )
  const canonical = readTagValue(
    html,
    /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/i
  )
  const robots = readTagValue(
    html,
    /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']([^"']+)["'])[^>]*>/i
  )

  return { title, description, canonical, robots }
}

async function fetchPage(route) {
  const url = new URL(route, BASE_URL).toString()
  const response = await fetch(url, {
    headers: { 'user-agent': 'TCN-Audit-Bot/1.0 (+https://tcn-comply-malta.vercel.app)' },
    redirect: 'follow',
  })
  const html = await response.text()
  const parsed = parsePageMetadata(html)

  return {
    route,
    url,
    status: response.status,
    ...parsed,
  }
}

async function runLighthouseSeoAudit(chrome, route) {
  const url = new URL(route, BASE_URL).toString()
  const runnerResult = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['seo'],
  })

  const score = Math.round((runnerResult?.lhr?.categories?.seo?.score || 0) * 100)
  return { route, url, seoScore: score }
}

function findDuplicates(values, field) {
  const byValue = new Map()

  for (const item of values) {
    const value = item[field]
    if (!value) continue
    const key = value.toLowerCase()
    const current = byValue.get(key) || []
    current.push(item.route)
    byValue.set(key, current)
  }

  return Array.from(byValue.entries())
    .filter(([, routes]) => routes.length > 1)
    .map(([value, routes]) => ({ value, routes }))
}

async function run() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const failures = []
  const pages = []

  for (const route of INDEXABLE_ROUTES) {
    const page = await fetchPage(route)
    pages.push(page)

    if (page.status !== 200) {
      failures.push(`${route}: expected HTTP 200, got ${page.status}`)
      continue
    }

    if (!page.title) {
      failures.push(`${route}: missing <title>`)
    }

    if (!page.description) {
      failures.push(`${route}: missing meta description`)
    }

    if (!page.canonical) {
      failures.push(`${route}: missing canonical link`)
    } else {
      const expected = buildExpectedCanonical(route)
      const actual = normalizeComparableUrl(new URL(page.canonical, BASE_URL).toString())
      if (expected !== actual) {
        failures.push(`${route}: canonical mismatch (expected ${expected}, got ${actual})`)
      }
    }

    if (page.robots?.toLowerCase().includes('noindex')) {
      failures.push(`${route}: should be indexable but has robots="${page.robots}"`)
    }
  }

  const duplicateTitles = findDuplicates(pages, 'title')
  const duplicateDescriptions = findDuplicates(pages, 'description')

  for (const duplicate of duplicateTitles) {
    failures.push(`duplicate title across routes: ${duplicate.routes.join(', ')}`)
  }

  for (const duplicate of duplicateDescriptions) {
    failures.push(`duplicate meta description across routes: ${duplicate.routes.join(', ')}`)
  }

  const lighthouseResults = []
  const chrome = await launchChrome({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    for (const route of SEO_SCORE_ROUTES) {
      const result = await runLighthouseSeoAudit(chrome, route)
      lighthouseResults.push(result)

      if (result.seoScore < MIN_SEO_SCORE) {
        failures.push(
          `${route}: lighthouse SEO score ${result.seoScore} is below minimum ${MIN_SEO_SCORE}`
        )
      }
    }
  } finally {
    await chrome.kill()
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    minSeoScore: MIN_SEO_SCORE,
    passCount: pages.length + lighthouseResults.length - failures.length,
    failCount: failures.length,
    pages,
    lighthouseResults,
    failures,
  }

  const reportPath = toReportPath()
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2))

  console.log(`SEO audit report: ${reportPath}`)
  for (const result of lighthouseResults) {
    console.log(`SEO ${result.route}: ${result.seoScore}`)
  }

  if (failures.length > 0) {
    console.error('SEO audit failures:')
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exitCode = 1
  }
}

run().catch((error) => {
  console.error('SEO audit failed:', error)
  process.exitCode = 1
})
