import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { PUBLIC_MARKETING_PATHS } from '../lib/portal-content.js'

function existsAny(candidatePaths) {
  return candidatePaths.some((candidate) => fs.existsSync(candidate))
}

test('all public marketing pages have an app router implementation', () => {
  const root = process.cwd()

  for (const route of PUBLIC_MARKETING_PATHS) {
    const normalized = route === '/' ? '' : route
    const dir = path.join(root, 'app', normalized)

    const candidates = [
      path.join(dir, 'page.js'),
      path.join(dir, 'page.jsx'),
      path.join(dir, 'page.tsx'),
      path.join(dir, 'page.ts'),
    ]

    assert.equal(
      existsAny(candidates),
      true,
      `missing page implementation for ${route} (expected one of: ${candidates.join(', ')})`
    )
  }
})
