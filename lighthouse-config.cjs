const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const config = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
    },
  },
}

const categories = {
  performance: {
    title: 'Performance',
    auditRefs: [
      { id: 'first-contentful-paint', weight: 10 },
      { id: 'largest-contentful-paint', weight: 25 },
      { id: 'speed-index', weight: 10 },
      { id: 'interactive', weight: 10 },
      { id: 'total-blocking-time', weight: 30 },
      { id: 'cumulative-layout-shift', weight: 15 },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    auditRefs: [
      { id: 'accesskeys', weight: 3 },
      { id: 'aria-allowed-attr', weight: 5 },
    ],
  },
  'best-practices': {
    title: 'Best Practices',
    auditRefs: [
      { id: 'doctype', weight: 1 },
      { id: 'errors-in-console', weight: 5 },
    ],
  },
  seo: {
    title: 'SEO',
    auditRefs: [
      { id: 'meta-description', weight: 5 },
      { id: 'title', weight: 10 },
    ],
  },
}

module.exports = { config, categories }
