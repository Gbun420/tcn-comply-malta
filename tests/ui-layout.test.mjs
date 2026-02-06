import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const layoutPath = new URL('../app/layout.js', import.meta.url)
const homePath = new URL('../app/page.js', import.meta.url)

test('public layout does not include dev markers', async () => {
  const layout = await readFile(layoutPath, 'utf8')
  const home = await readFile(homePath, 'utf8')
  assert.ok(!layout.includes('Development Version'))
  assert.ok(!layout.includes('GB'))
  assert.ok(!home.includes('Development Version'))
})
