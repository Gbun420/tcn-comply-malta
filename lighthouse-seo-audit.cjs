const { default: lighthouse } = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const path = require('path')

const AUDIT_DIR = path.join(__dirname, 'docs', 'audits')

function ensureAuditDirectory() {
  fs.mkdirSync(AUDIT_DIR, { recursive: true })
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

async function runSEOAudit(url) {
  ensureAuditDirectory()

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox'],
  })

  const options = {
    port: chrome.port,
    output: 'json',
    onlyCategories: ['seo'],
  }

  try {
    const { lhr } = await lighthouse(url, options)
    const seoCategory = lhr.categories.seo

    console.log('\n🔍 SEO AUDIT RESULTS')
    console.log('='.repeat(50))
    console.log(`URL: ${url}`)
    console.log(`Overall SEO Score: ${Math.round(seoCategory.score * 100)}/100\n`)

    const audits = lhr.audits
    const criticalIssues = []
    const warnings = []
    const passed = []

    Object.entries(audits).forEach(([key, audit]) => {
      if (audit.score !== null) {
        const score = audit.score
        const item = {
          id: audit.id,
          title: audit.title,
          description: audit.description,
          score: Math.round(score * 100),
          displayValue: audit.displayValue,
        }

        if (score < 0.7) criticalIssues.push(item)
        else if (score < 0.9) warnings.push(item)
        else passed.push(item)
      }
    })

    if (criticalIssues.length > 0) {
      console.log('❌ CRITICAL SEO ISSUES:')
      criticalIssues.forEach((issue) => {
        console.log(`\n${issue.title}: ${issue.score}/100`)
        console.log(`Description: ${issue.description}`)
      })
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  SEO WARNINGS:')
      warnings.forEach((warning) => {
        console.log(`${warning.title}: ${warning.score}/100`)
      })
    }

    if (passed.length > 0) {
      console.log('\n✅ PASSED SEO AUDITS:')
      passed.forEach((pass) => {
        console.log(`${pass.title}: ${pass.score}/100`)
      })
    }

    console.log('\n🎯 TCN COMPLY MALTA SPECIFIC RECOMMENDATIONS:')
    console.log('1. Ensure all pages mention "Malta 2026 Labour Migration Policy"')
    console.log('2. Include keywords: "TCN compliance Malta", "Third-Country Nationals Malta"')
    console.log('3. Add structured data for local business (Malta-based)')
    console.log('4. Optimize meta descriptions with Malta-specific content')
    console.log('5. Ensure hreflang tags for international audience')

    return { score: seoCategory.score, criticalIssues, warnings, passed }
  } finally {
    await chrome.kill()
  }
}

async function runAllSEOAudits() {
  const urls = [
    'https://tcn-comply-malta.vercel.app/',
    'https://tcn-comply-malta.vercel.app/auth/login',
    'https://tcn-comply-malta.vercel.app/dashboard',
  ]

  const results = []

  for (const url of urls) {
    console.log(`\n📊 Testing SEO for: ${url}`)
    try {
      const result = await runSEOAudit(url)
      results.push({ url, result })
    } catch (error) {
      console.error(`Error testing ${url}:`, error.message)
    }
  }

  const outputFile = path.join(AUDIT_DIR, `seo-audit-${timestamp()}.json`)
  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        results,
      },
      null,
      2
    )
  )

  console.log(`\n📄 SEO audit output saved to: ${outputFile}`)

  return results
}

if (require.main === module) {
  runAllSEOAudits().then((results) => {
    const validResults = results.filter((r) => r.result && r.result.score !== null)
    const avgScore =
      validResults.reduce((sum, { result }) => sum + result.score, 0) / validResults.length
    console.log(`\n📈 AVERAGE SEO SCORE: ${Math.round(avgScore * 100)}/100`)
  })
}

module.exports = { runSEOAudit, runAllSEOAudits }
