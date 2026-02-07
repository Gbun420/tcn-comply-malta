import fs from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.AUDIT_BASE_URL || 'https://tcn-comply-malta.vercel.app'
const OUTPUT_DIR = path.join(process.cwd(), 'docs', 'audits')

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

function toReportPath() {
  return path.join(OUTPUT_DIR, `api-check-${stamp()}.json`)
}

async function request(pathname, { method = 'GET', headers = {}, body } = {}) {
  const response = await fetch(new URL(pathname, BASE_URL), { method, headers, body })
  const text = await response.text()

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: text,
  }
}

async function run() {
  const checks = [
    {
      name: 'logout route clears auth cookie',
      run: () => request('/api/auth/logout', { method: 'POST' }),
      assert: (result) =>
        result.status === 200 && /auth-token=.*max-age=0/i.test(result.headers['set-cookie'] || ''),
    },
    {
      name: 'login missing credentials returns 400',
      run: () =>
        request('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }),
      assert: (result) => result.status === 400,
    },
    {
      name: 'auth/me without token returns 401',
      run: () => request('/api/auth/me'),
      assert: (result) => result.status === 401,
    },
    {
      name: 'employees GET without token returns 401',
      run: () => request('/api/employees'),
      assert: (result) => result.status === 401,
    },
    {
      name: 'employees POST without token returns 401',
      run: () =>
        request('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            passportNumber: 'A12345',
            nationality: 'MT',
            position: 'Analyst',
            salary: 25000,
            email: 'test@example.com',
            sector: 'general',
          }),
        }),
      assert: (result) => result.status === 401,
    },
    {
      name: 'vacancies GET without token returns 401',
      run: () => request('/api/vacancies'),
      assert: (result) => result.status === 401,
    },
    {
      name: 'vacancies POST without token returns 401',
      run: () =>
        request('/api/vacancies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'QA Vacancy',
            description: 'Audit test request',
            salary: 28000,
            sector: 'hospitality',
            durationWeeks: 3,
          }),
        }),
      assert: (result) => result.status === 401,
    },
    {
      name: 'employees OPTIONS preflight returns 204',
      run: () =>
        request('/api/employees', {
          method: 'OPTIONS',
          headers: {
            Origin: 'https://tcncomply.mt',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization',
          },
        }),
      assert: (result) =>
        result.status === 204 &&
        (result.headers['access-control-allow-origin'] === 'https://tcncomply.mt' ||
          result.headers['access-control-allow-origin'] === '*'),
    },
    {
      name: 'vacancies OPTIONS preflight returns 204',
      run: () =>
        request('/api/vacancies', {
          method: 'OPTIONS',
          headers: {
            Origin: 'https://tcncomply.mt',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization',
          },
        }),
      assert: (result) =>
        result.status === 204 &&
        (result.headers['access-control-allow-origin'] === 'https://tcncomply.mt' ||
          result.headers['access-control-allow-origin'] === '*'),
    },
  ]

  const results = []

  for (const check of checks) {
    try {
      const response = await check.run()
      const pass = check.assert(response)
      results.push({
        name: check.name,
        pass,
        status: response.status,
        body: response.body.slice(0, 200),
      })
    } catch (error) {
      results.push({
        name: check.name,
        pass: false,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    passCount: results.filter((item) => item.pass).length,
    failCount: results.filter((item) => !item.pass).length,
    results,
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  const reportPath = toReportPath()
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2))

  console.log(`API audit report: ${reportPath}`)
  for (const item of results) {
    console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.name} (${item.status || 'error'})`)
  }

  if (summary.failCount > 0) {
    process.exitCode = 1
  }
}

run().catch((error) => {
  console.error('API audit failed:', error)
  process.exitCode = 1
})
