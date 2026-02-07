import fs from 'node:fs/promises'
import path from 'node:path'

const AUDIT_DIR = path.join(process.cwd(), 'docs', 'audits')
const REPORT_PATH = path.join(AUDIT_DIR, 'latest-audit-report.md')

async function getLatestFile(prefix) {
  try {
    const files = await fs.readdir(AUDIT_DIR)
    const matching = files
      .filter((f) => f.startsWith(prefix) && f.endsWith('.json'))
      .sort()
      .reverse()
    return matching[0]
  } catch (error) {
    return null
  }
}

async function run() {
  const apiFile = await getLatestFile('api-check-')
  const seoFile = await getLatestFile('seo-check-')
  const contentFile = await getLatestFile('content-check-')

  let report = `# TCN Comply Malta - Automated Audit Report\n\n`
  report += `Generated at: ${new Date().toISOString()}\n\n`

  if (apiFile) {
    const data = JSON.parse(await fs.readFile(path.join(AUDIT_DIR, apiFile), 'utf-8'))
    report += `## API Audit\n`
    report += `- **Status**: ${data.failCount === 0 ? '✅ PASS' : '❌ FAIL'}\n`
    report += `- **Passed**: ${data.passCount}\n`
    report += `- **Failed**: ${data.failCount}\n\n`

    if (data.failCount > 0) {
      report += `### API Failures\n`
      for (const res of data.results.filter(r => !r.pass)) {
        report += `- ${res.name}: ${res.error || 'Assertion failed'}\n`
      }
      report += `\n`
    }
  } else {
    report += `## API Audit\n- No recent API audit found.\n\n`
  }

  if (seoFile) {
    const data = JSON.parse(await fs.readFile(path.join(AUDIT_DIR, seoFile), 'utf-8'))
    report += `## SEO Audit\n`
    report += `- **Status**: ${data.failCount === 0 ? '✅ PASS' : '❌ FAIL'}\n`
    report += `- **Passed**: ${data.passCount}\n`
    report += `- **Failed**: ${data.failCount}\n\n`

    if (data.failures && data.failures.length > 0) {
      report += `### SEO Failures\n`
      for (const failure of data.failures) {
        report += `- ${failure}\n`
      }
      report += `\n`
    }
  } else {
    report += `## SEO Audit\n- No recent SEO audit found.\n\n`
  }

  if (contentFile) {
    const data = JSON.parse(await fs.readFile(path.join(AUDIT_DIR, contentFile), 'utf-8'))
    report += `## Content Audit\n`
    report += `- **Status**: ${data.failCount === 0 ? '✅ PASS' : '❌ FAIL'}\n`
    report += `- **Passed**: ${data.passCount}\n`
    report += `- **Failed**: ${data.failCount}\n\n`

    if (data.failures && data.failures.length > 0) {
      report += `### Content Failures\n`
      for (const failure of data.failures) {
        report += `- ${failure}\n`
      }
      report += `\n`
    }
  } else {
    report += `## Content Audit\n- No recent Content audit found.\n\n`
  }

  await fs.writeFile(REPORT_PATH, report)
  console.log(`✅ Consolidated audit report generated at: ${REPORT_PATH}`)
}

run().catch((error) => {
  console.error('Failed to generate audit report:', error)
  process.exitCode = 1
})
