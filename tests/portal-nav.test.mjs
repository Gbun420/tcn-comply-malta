import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const navPath = new URL('../components/PortalNav.js', import.meta.url)

test('portal nav includes compliance tracking', async () => {
  const nav = await readFile(navPath, 'utf8')
  assert.ok(nav.includes('Compliance Tracking'))
})
