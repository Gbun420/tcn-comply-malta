import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DASHBOARD_MODULES,
  MARKETING_NAV_LINKS,
  PORTAL_OFFERINGS,
  PUBLIC_MARKETING_PATHS,
} from '../lib/portal-content.js'
import { GET as sitemapGet } from '../app/sitemap.xml/route.js'

test('marketing navigation includes required separate pages', () => {
  const labels = MARKETING_NAV_LINKS.map((item) => item.label)
  const paths = MARKETING_NAV_LINKS.map((item) => item.href)

  assert.deepEqual(labels, ['Audit App', 'Solutions', 'Coverage', 'Workflow', 'Contact'])
  assert.deepEqual(paths, ['/audit-app', '/solutions', '/coverage', '/workflow', '/contact'])
})

test('portal offerings define sections for client value proposition', () => {
  assert.equal(PORTAL_OFFERINGS.solutions.length >= 4, true)
  assert.equal(PORTAL_OFFERINGS.coverage.length >= 4, true)
  assert.equal(PORTAL_OFFERINGS.workflow.length >= 4, true)
  assert.equal(PORTAL_OFFERINGS.contactChannels.length >= 3, true)
})

test('dashboard modules include missing frontend surfaces now exposed to clients', () => {
  const routeSet = new Set(DASHBOARD_MODULES.map((module) => module.href))

  assert.equal(routeSet.has('/dashboard'), true)
  assert.equal(routeSet.has('/dashboard/employees'), true)
  assert.equal(routeSet.has('/dashboard/vacancies'), true)
  assert.equal(routeSet.has('/dashboard/audit'), true)
})

test('public marketing paths align with separate-page routing', () => {
  const expected = ['/audit-app', '/solutions', '/coverage', '/workflow', '/contact']
  assert.deepEqual(PUBLIC_MARKETING_PATHS, expected)
})

test('sitemap includes new public and dashboard module routes', async () => {
  const response = await sitemapGet()
  const xml = await response.text()

  assert.equal(xml.includes('/audit-app'), true)
  assert.equal(xml.includes('/solutions'), true)
  assert.equal(xml.includes('/coverage'), true)
  assert.equal(xml.includes('/workflow'), true)
  assert.equal(xml.includes('/contact'), true)
  assert.equal(xml.includes('/dashboard/vacancies'), true)
  assert.equal(xml.includes('/dashboard/audit'), true)
})
