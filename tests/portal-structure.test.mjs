import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DASHBOARD_MODULES,
  FOOTER_TRUST_LINKS,
  FOOTER_RESOURCE_LINKS,
  MARKETING_NAV_LINKS,
  PORTAL_OFFERINGS,
  PUBLIC_MARKETING_PATHS
} from '../lib/portal-content.js'
import { GET as sitemapGet } from '../app/sitemap.xml/route.js'
import { INDEXABLE_ROUTES } from '../lib/public-pages.js'

test('marketing navigation aligns with conversion funnel', () => {
  const labels = MARKETING_NAV_LINKS.map((item) => item.label)
  const paths = MARKETING_NAV_LINKS.map((item) => item.href)

  assert.deepEqual(labels, ['Product', 'Pricing', 'Demo', 'Coverage', 'Guides', 'Security'])
  assert.deepEqual(paths, ['/product', '/pricing', '/demo', '/coverage', '/guides', '/security'])
})

test('portal offerings define sections for client value proposition', () => {
  assert.equal(PORTAL_OFFERINGS.solutions.length >= 4, true)
  assert.equal(PORTAL_OFFERINGS.coverage.length >= 4, true)
  assert.equal(PORTAL_OFFERINGS.workflow.length >= 4, true)
  assert.equal(PORTAL_OFFERINGS.contactChannels.length >= 1, true)
  assert.equal(
    PORTAL_OFFERINGS.contactChannels.some((channel) => channel.label === 'Demo Request'),
    true,
  )
})

test('dashboard modules include missing frontend surfaces now exposed to clients', () => {
  const routeSet = new Set(DASHBOARD_MODULES.map((module) => module.href))

  assert.equal(routeSet.has('/dashboard'), true)
  assert.equal(routeSet.has('/dashboard/employees'), true)
  assert.equal(routeSet.has('/dashboard/vacancies'), true)
  assert.equal(routeSet.has('/dashboard/audit'), true)
})

test('public marketing paths align with separate-page routing', () => {
  const expected = ['/product', '/pricing', '/demo', '/coverage', '/guides', '/security']
  assert.deepEqual(PUBLIC_MARKETING_PATHS, expected)
})

test('sitemap includes only public/legal indexable routes', async () => {
  const response = await sitemapGet()
  const xml = await response.text()

  for (const route of INDEXABLE_ROUTES) {
    assert.equal(xml.includes(route), true)
  }

  assert.equal(xml.includes('/dashboard'), false)
  assert.equal(xml.includes('/auth/login'), false)
  assert.equal(xml.includes('/auth/register'), false)
})

test('footer includes trust and resource sections for buyer enablement', () => {
  assert.equal(FOOTER_RESOURCE_LINKS.length >= 4, true)
  assert.equal(FOOTER_TRUST_LINKS.length >= 4, true)
})
