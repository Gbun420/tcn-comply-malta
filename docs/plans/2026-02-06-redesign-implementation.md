# TCN Compliance Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Audit and overhaul design + SEO, remove all dev/demo artifacts, and rebuild the portal/dashboard around real Firestore data with live metrics.

**Architecture:** Use Firestore as the only data source. Add small, testable aggregation helpers in `lib/` and expose them via API routes. UI is rebuilt with a new brand system, marketing layout, and a left-rail portal shell.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Firebase Admin SDK, Node test runner (`node --test`), Lighthouse scripts.

### Task 1: Baseline Lighthouse + SEO audit

**Files:**
- Create: `docs/audits/2026-02-06-lighthouse-baseline.md`

**Step 1: Run performance audit**
Run: `npm run lighthouse`
Expected: HTML report files in repo root and scores printed to console.

**Step 2: Run SEO audit**
Run: `npm run lighthouse:seo`
Expected: SEO scores printed for `/`, `/auth/login`, `/dashboard`.

**Step 3: Capture results**
Record scores + top issues in `docs/audits/2026-02-06-lighthouse-baseline.md`.

**Step 4: Commit**
```bash
git add docs/audits/2026-02-06-lighthouse-baseline.md
git commit -m "docs: add baseline lighthouse audit"
```

### Task 2: Remove dev/demo header and public references

**Files:**
- Create: `tests/ui-layout.test.mjs`
- Modify: `app/layout.js`
- Modify: `app/page.js`

**Step 1: Write the failing test**
```js
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
```

**Step 2: Run test to verify it fails**
Run: `node --test tests/ui-layout.test.mjs`
Expected: FAIL with assertion error.

**Step 3: Remove dev header/footer content**
- Delete the “Development Version” badge and “GB” avatar from `app/layout.js` header.
- Remove “Development Version” copy block in `app/page.js` CTA section.

**Step 4: Run test to verify it passes**
Run: `node --test tests/ui-layout.test.mjs`
Expected: PASS

**Step 5: Commit**
```bash
git add tests/ui-layout.test.mjs app/layout.js app/page.js
git commit -m "chore: remove dev markers from public UI"
```

### Task 3: Brand tokens, typography, and logo refresh

**Files:**
- Create: `tests/brand-tokens.test.mjs`
- Modify: `app/globals.css`
- Modify: `app/layout.js`
- Modify: `tailwind.config.js`
- Modify: `public/logo.svg`
- Modify: `public/favicon.svg`

**Step 1: Write the failing test**
```js
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
```

**Step 2: Run test to verify it fails**
Run: `node --test tests/brand-tokens.test.mjs`
Expected: FAIL

**Step 3: Add brand system and fonts**
- Define CSS variables in `app/globals.css` for #1a365d, #2d8659, #d69e2e.
- Add font stack for Space Grotesk (headings) and Manrope (body) in `app/layout.js` head.
- Update `tailwind.config.js` to reference new font families.
- Refresh `public/logo.svg` and `public/favicon.svg` to blue/green palette.

**Step 4: Run test to verify it passes**
Run: `node --test tests/brand-tokens.test.mjs`
Expected: PASS

**Step 5: Commit**
```bash
git add tests/brand-tokens.test.mjs app/globals.css app/layout.js tailwind.config.js public/logo.svg public/favicon.svg
git commit -m "style: add brand tokens and typography"
```

### Task 4: Metrics engine + public API

**Files:**
- Create: `lib/metrics.js`
- Create: `app/api/metrics/route.js`
- Create: `tests/metrics.test.mjs`
- Modify: `lib/firebase-admin.js` (create if missing)

**Step 1: Write the failing test**
```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { computeMetrics } from '../lib/metrics.js'

test('computeMetrics derives application and compliance stats', () => {
  const result = computeMetrics({
    applications: [{ complianceStatus: 'compliant' }, { complianceStatus: 'non_compliant' }],
    admin: { timeSavingsPercent: 70, penaltiesSavedEuro: 200000 }
  })
  assert.equal(result.applicationsProcessed, 2)
  assert.equal(result.complianceRate, 50)
  assert.equal(result.timeSavingsPercent, 70)
  assert.equal(result.penaltiesSavedEuro, 200000)
})
```

**Step 2: Run test to verify it fails**
Run: `node --test tests/metrics.test.mjs`
Expected: FAIL (module not found)

**Step 3: Implement metrics helpers + API**
- Add `lib/firebase-admin.js` with a safe `getDb()` returning null if not configured.
- Implement `computeMetrics` and `getPublicMetrics` in `lib/metrics.js`.
- Implement `GET /api/metrics` returning merged computed + admin-managed values and `setupRequired` on missing config.

**Step 4: Run test to verify it passes**
Run: `node --test tests/metrics.test.mjs`
Expected: PASS

**Step 5: Commit**
```bash
git add lib/firebase-admin.js lib/metrics.js app/api/metrics/route.js tests/metrics.test.mjs
git commit -m "feat: add metrics engine and public API"
```

### Task 5: Homepage redesign using live metrics

**Files:**
- Create: `tests/home-copy.test.mjs`
- Modify: `app/page.js`
- Modify: `app/globals.css`

**Step 1: Write the failing test**
```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const homePath = new URL('../app/page.js', import.meta.url)

test('homepage includes new hero headline', async () => {
  const home = await readFile(homePath, 'utf8')
  assert.ok(home.includes('TCN Compliance Made Simple for Maltese Employers'))
  assert.ok(home.includes('Start Free Trial'))
})
```

**Step 2: Run test to verify it fails**
Run: `node --test tests/home-copy.test.mjs`
Expected: FAIL

**Step 3: Implement redesigned homepage**
- Rebuild `app/page.js` to match the new layout (hero, trust indicators, features grid, value, testimonial, CTA, footer).
- Pull metrics via `getPublicMetrics()` and render em dash when missing.
- Update background and section styling in `app/globals.css`.

**Step 4: Run test to verify it passes**
Run: `node --test tests/home-copy.test.mjs`
Expected: PASS

**Step 5: Commit**
```bash
git add app/page.js app/globals.css tests/home-copy.test.mjs
git commit -m "feat: redesign homepage with live metrics"
```

### Task 6: Dashboard data engine + API

**Files:**
- Create: `lib/dashboard.js`
- Create: `app/api/dashboard/route.js`
- Modify: `app/api/employees/route.js`
- Modify: `app/api/vacancies/route.js`
- Create: `tests/dashboard.test.mjs`

**Step 1: Write the failing test**
```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { computeDashboardStats } from '../lib/dashboard.js'

test('computeDashboardStats derives totals and pending renewals', () => {
  const result = computeDashboardStats({
    employees: [
      { courseStatus: 'Completed', renewalDate: '2099-01-01' },
      { courseStatus: 'In Progress', renewalDate: '2099-01-10' }
    ],
    complianceEvents: [{ severity: 'high' }]
  })
  assert.equal(result.totalEmployees, 2)
  assert.equal(result.coursesCompleted, 1)
})
```

**Step 2: Run test to verify it fails**
Run: `node --test tests/dashboard.test.mjs`
Expected: FAIL

**Step 3: Implement dashboard helpers + API**
- Add `computeDashboardStats` and `getDashboardData` in `lib/dashboard.js`.
- Create `GET /api/dashboard` to return stats, recent applications, and compliance events.
- Add authenticated `GET /api/employees` and `GET /api/vacancies` using Firestore and `orgId`.

**Step 4: Run test to verify it passes**
Run: `node --test tests/dashboard.test.mjs`
Expected: PASS

**Step 5: Commit**
```bash
git add lib/dashboard.js app/api/dashboard/route.js app/api/employees/route.js app/api/vacancies/route.js tests/dashboard.test.mjs
git commit -m "feat: add dashboard aggregation API"
```

### Task 7: Portal shell + dashboard UI overhaul

**Files:**
- Create: `components/PortalShell.js`
- Create: `components/PortalNav.js`
- Modify: `app/dashboard/page.js`
- Modify: `app/dashboard/employees/page.js`
- Create: `app/dashboard/compliance/page.js`
- Create: `app/dashboard/reports/page.js`
- Create: `app/dashboard/settings/page.js`
- Create: `tests/portal-nav.test.mjs`

**Step 1: Write the failing test**
```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const navPath = new URL('../components/PortalNav.js', import.meta.url)

test('portal nav includes compliance tracking', async () => {
  const nav = await readFile(navPath, 'utf8')
  assert.ok(nav.includes('Compliance Tracking'))
})
```

**Step 2: Run test to verify it fails**
Run: `node --test tests/portal-nav.test.mjs`
Expected: FAIL

**Step 3: Build portal shell + pages**
- Add left-rail layout with top bar actions.
- Update dashboard to consume `/api/dashboard` and render stat cards, quick actions, widgets, and recent applications.
- Update employees page to fetch `/api/employees` and render status chips.
- Add Compliance, Reports, and Settings pages with clean empty states and primary actions.

**Step 4: Run test to verify it passes**
Run: `node --test tests/portal-nav.test.mjs`
Expected: PASS

**Step 5: Commit**
```bash
git add components/PortalShell.js components/PortalNav.js app/dashboard/page.js app/dashboard/employees/page.js app/dashboard/compliance/page.js app/dashboard/reports/page.js app/dashboard/settings/page.js tests/portal-nav.test.mjs
git commit -m "feat: redesign dashboard portal shell"
```

### Task 8: Remove mock data and demo auth fallback

**Files:**
- Create: `tests/auth-config.test.mjs`
- Modify: `lib/auth.js`
- Modify: `app/api/auth/login/route.js`
- Modify: `app/auth/login/page.js`
- Delete: `lib/database.js`

**Step 1: Write the failing test**
```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { isFirebaseConfigured } from '../lib/auth.js'

test('firebase config helper reports missing config', () => {
  assert.equal(isFirebaseConfigured({}), false)
})
```

**Step 2: Run test to verify it fails**
Run: `node --test tests/auth-config.test.mjs`
Expected: FAIL

**Step 3: Remove demo auth and mock data**
- Add `isFirebaseConfigured` in `lib/auth.js` and remove demo user fallback.
- Update login API to return 503 with `setupRequired: true` when Firebase config missing.
- Remove demo credentials text from `app/auth/login/page.js`.
- Delete `lib/database.js` and remove references.

**Step 4: Run test to verify it passes**
Run: `node --test tests/auth-config.test.mjs`
Expected: PASS

**Step 5: Commit**
```bash
git add lib/auth.js app/api/auth/login/route.js app/auth/login/page.js tests/auth-config.test.mjs
git rm lib/database.js
git commit -m "chore: remove mock data and demo auth"
```

### Task 9: SEO and metadata overhaul

**Files:**
- Create: `tests/seo-metadata.test.mjs`
- Modify: `app/layout.js`
- Modify: `app/seo-metadata.js`
- Modify: `app/robots.txt/route.js`
- Modify: `app/sitemap.xml/route.js`

**Step 1: Write the failing test**
```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { metadata } from '../app/seo-metadata.js'

test('metadata includes Malta compliance keywords', () => {
  assert.ok(metadata.description.includes('Labour Migration Policy'))
  assert.ok(metadata.keywords.includes('TCN compliance Malta'))
})
```

**Step 2: Run test to verify it fails**
Run: `node --test tests/seo-metadata.test.mjs`
Expected: FAIL

**Step 3: Update SEO metadata + structured data**
- Remove personal email from metadata.
- Strengthen title/description for 2026 policy alignment.
- Update robots and sitemap routes for new pages.
- Update JSON-LD to include business address and software category.

**Step 4: Run test to verify it passes**
Run: `node --test tests/seo-metadata.test.mjs`
Expected: PASS

**Step 5: Commit**
```bash
git add app/layout.js app/seo-metadata.js app/robots.txt/route.js app/sitemap.xml/route.js tests/seo-metadata.test.mjs
git commit -m "seo: refresh metadata and structured data"
```

### Task 10: Final lint + Lighthouse rerun

**Files:**
- Create: `docs/audits/2026-02-06-lighthouse-post.md`

**Step 1: Run lint**
Run: `npm run lint`
Expected: PASS (no errors)

**Step 2: Run tests**
Run: `node --test tests/*.test.mjs`
Expected: PASS

**Step 3: Rerun Lighthouse**
Run: `npm run lighthouse` and `npm run lighthouse:seo`
Expected: Improved scores vs baseline

**Step 4: Capture results**
Record scores and deltas in `docs/audits/2026-02-06-lighthouse-post.md`.

**Step 5: Commit**
```bash
git add docs/audits/2026-02-06-lighthouse-post.md
git commit -m "docs: add post-redesign lighthouse audit"
```
