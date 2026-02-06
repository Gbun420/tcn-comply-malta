import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const cssPath = new URL('../app/globals.css', import.meta.url)

test('brand tokens exist in globals', async () => {
  const css = await readFile(cssPath, 'utf8')
  assert.ok(css.includes('--brand-blue'))
  assert.ok(css.includes('--brand-green'))
  assert.ok(css.includes('--brand-amber'))
})
