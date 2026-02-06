import test from 'node:test'
import assert from 'node:assert/strict'
import { computeDashboardStats } from '../lib/dashboard.js'

test('computeDashboardStats derives totals and pending renewals', () => {
  const result = computeDashboardStats({
    employees: [
      { courseStatus: 'Completed', renewalDate: '2099-01-01' },
      { courseStatus: 'In Progress', renewalDate: '2099-01-10' },
    ],
    complianceEvents: [{ severity: 'high' }],
  })
  assert.equal(result.totalEmployees, 2)
  assert.equal(result.coursesCompleted, 1)
})
