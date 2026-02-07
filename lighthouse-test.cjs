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

function urlSlug(url) {
  const pathname = new URL(url).pathname
  if (!pathname || pathname === '/') {
    return 'home'
  }

  return pathname.replace(/^\/+/, '').replace(/\//g, '-')
}

async function runLighthouse(url, options = {}) {
  ensureAuditDirectory()

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
  })

  const runOptions = {
    ...options,
    port: chrome.port,
    logLevel: 'info',
  }

  try {
    const runnerResult = await lighthouse(url, runOptions)
    const stamp = timestamp()
    const slug = urlSlug(url)
    const reportFile = path.join(AUDIT_DIR, `lighthouse-report-${slug}-${stamp}.html`)
    const summaryFile = path.join(AUDIT_DIR, `lighthouse-summary-${slug}-${stamp}.json`)

    fs.writeFileSync(reportFile, runnerResult.report)

    const categoryScores = Object.fromEntries(
      Object.entries(runnerResult.lhr.categories).map(([key, category]) => [
        key,
        Math.round((category.score || 0) * 100),
      ])
    )

    fs.writeFileSync(
      summaryFile,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          url,
          categoryScores,
        },
        null,
        2
      )
    )

    console.log('\n📊 LIGHTHOUSE RESULTS: ' + url)
    console.log('='.repeat(50))

    Object.entries(categoryScores).forEach(([key, score]) => {
      console.log(`${key}: ${score}/100`)
    })

    console.log(`\n📄 Full report saved to: ${reportFile}`)
    console.log(`📄 Summary saved to: ${summaryFile}`)

    return { url, categoryScores, reportFile, summaryFile }
  } finally {
    await chrome.kill()
  }
}

async function runAllTests() {
  const urls = [
    'https://tcn-comply-malta.vercel.app/',
    'https://tcn-comply-malta.vercel.app/auth/login',
    'https://tcn-comply-malta.vercel.app/dashboard',
  ]

  const results = []

  for (const url of urls) {
    try {
      console.log(`\n🚀 Testing: ${url}`)
      const result = await runLighthouse(url)
      results.push(result)
    } catch (error) {
      console.error(`❌ Error testing ${url}:`, error.message)
    }
  }

  const aggregateFile = path.join(AUDIT_DIR, `lighthouse-aggregate-${timestamp()}.json`)
  fs.writeFileSync(
    aggregateFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        results,
      },
      null,
      2
    )
  )
  console.log(`\n📄 Aggregate summary saved to: ${aggregateFile}`)
}

if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = { runLighthouse, runAllTests }
