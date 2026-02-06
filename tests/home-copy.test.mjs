import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const homePath = new URL('../app/page.js', import.meta.url)

test('homepage includes new hero headline and CTA copy', async () => {
  const home = await readFile(homePath, 'utf8')
  assert.ok(home.includes('TCN Compliance Made Simple for Maltese Employers'))
  assert.ok(home.includes('Start Free Trial'))
  assert.ok(home.includes('View Pricing'))
})
