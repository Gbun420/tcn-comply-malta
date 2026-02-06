import test from 'node:test'
import assert from 'node:assert/strict'
import { computeMetrics } from '../lib/metrics.js'

test('computeMetrics derives application and compliance stats', () => {
  const result = computeMetrics({
    applications: [{ complianceStatus: 'compliant' }, { complianceStatus: 'non_compliant' }],
    admin: { timeSavingsPercent: 70, penaltiesSavedEuro: 200000 },
  })
  assert.equal(result.applicationsProcessed, 2)
  assert.equal(result.complianceRate, 50)
  assert.equal(result.timeSavingsPercent, 70)
  assert.equal(result.penaltiesSavedEuro, 200000)
})
