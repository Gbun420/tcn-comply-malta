import test from 'node:test'
import assert from 'node:assert/strict'
import { metadata } from '../app/seo-metadata.js'

test('metadata includes Malta compliance keywords', () => {
  assert.ok(metadata.description.includes('Labour Migration Policy'))
  assert.ok(metadata.keywords.includes('TCN compliance Malta'))
})
