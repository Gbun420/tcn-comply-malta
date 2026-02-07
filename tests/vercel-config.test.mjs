import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const vercelConfigPath = path.join(process.cwd(), 'vercel.json')
const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'))

function getCspHeaderValue() {
  for (const headerBlock of vercelConfig.headers || []) {
    if (headerBlock.source !== '/(.*)') continue

    for (const header of headerBlock.headers || []) {
      if (header.key.toLowerCase() === 'content-security-policy') {
        return header.value
      }
    }
  }

  return ''
}

test('vercel CSP allows Vercel feedback script origin', () => {
  const csp = getCspHeaderValue()
  assert.match(csp, /script-src[^;]*vercel\.live/i)
})

test('vercel CSP allows fallback font host used by browser helpers', () => {
  const csp = getCspHeaderValue()
  assert.match(csp, /font-src[^;]*r2cdn\.perplexity\.ai/i)
})
