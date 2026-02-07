# Lint Cleanup and Post-Audit Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clear lint errors from unescaped JSX entities, update public contact info, and capture post-redesign Lighthouse audits.

**Architecture:** Use existing ESLint rules as the regression test for JSX text; apply minimal text edits only; record audits in docs for comparison.

**Tech Stack:** Next.js (App Router), React, ESLint, Node test runner, Lighthouse CLI.

**Skills:** @superpowers:systematic-debugging, @superpowers:test-driven-development, @superpowers:verification-before-completion

### Task 1: Resolve JSX unescaped-entity lint failures

**Files:**

- Modify: `app/dashboard/page.js`
- Modify: `app/layout.js`
- Modify: `app/not-found.js`
- Modify: `app/page.js`

**Step 1: Write the failing test**

Run: `npm run lint`  
Expected: FAIL with `react/no-unescaped-entities` in the files above.

**Step 2: Write minimal implementation**

Apply the following edits:

```jsx
<p className="text-sm text-slate-500">No active alerts. You&apos;re in good shape.</p>
```

```jsx
<p className="text-slate-300 text-sm">
  Navigate Malta&apos;s 2026 Labour Migration Policy with confidence.
</p>
<a href="mailto:hello@tcncomply.com">hello@tcncomply.com</a>
```

```jsx
<p className="text-slate-500 mb-8">
  Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
</p>
```

```jsx
<h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mt-4">
  Compliance Built for Malta&apos;s 2026 Policy
</h2>
<p className="text-slate-600">
  &ldquo;TCN Comply saved us 15 hours per month on compliance tasks.&rdquo;
</p>
<p className="text-slate-600">
  &ldquo;We finally have a single dashboard showing every renewal and Skills Pass status.&rdquo;
</p>
```

**Step 3: Verify fix (GREEN)**

Run: `npm run lint`  
Expected: PASS (warnings about `<img>` or custom fonts may remain).

**Step 4: Commit**

```bash
git add app/dashboard/page.js app/layout.js app/not-found.js app/page.js
git commit -m "fix: escape jsx entities and update footer contact"
```

### Task 2: Run automated tests

**Files:**

- Test: `tests/*.test.mjs`

**Step 1: Run tests**

Run: `node --test tests/*.test.mjs`  
Expected: PASS.

**Step 2: Commit (if test-related changes were needed)**

```bash
git add tests/*.test.mjs
git commit -m "test: confirm portal and seo coverage"
```

### Task 3: Capture post-redesign Lighthouse audits

**Files:**

- Create: `docs/audits/2026-02-06-lighthouse-post.md`

**Step 1: Run performance audits**

Run: `npm run lighthouse`  
Expected: Reports written to `docs/audits/` and `lighthouse-report-*.html`.

**Step 2: Run SEO audits**

Run: `npm run lighthouse:seo`  
Expected: SEO scores recorded in output and reports.

**Step 3: Record results**

Create `docs/audits/2026-02-06-lighthouse-post.md` with summary and links, similar to baseline. Example:

```markdown
# Lighthouse Post-Redesign Audit (2026-02-06)

## Summary

- `/`: Performance XX, Accessibility XX, Best Practices XX, SEO XX
- `/auth/login`: Performance XX, Accessibility XX, Best Practices XX, SEO XX
- `/dashboard`: Performance XX, Accessibility XX, Best Practices XX, SEO XX

## Notes

- Keep `lighthouse-report-*.html` files for reference.
```

**Step 4: Commit**

```bash
git add docs/audits/2026-02-06-lighthouse-post.md
git commit -m "docs: add post-redesign lighthouse audit"
```
