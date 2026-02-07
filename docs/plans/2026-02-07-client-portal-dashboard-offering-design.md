# Client Portal and Dashboard Offering Design (2026-02-07)

## Objective

Define what TCN Comply Malta should offer to clients through portal and dashboard experiences, then map those offerings to concrete front-end modules and navigation routes.

## Client-Facing Offering Model

1. Onboarding Compliance Workspace: employee intake, pre-departure obligations, and document status.
2. Vacancy Publication Control: Jobsplus/EURES timeline awareness and posting evidence tracking.
3. Renewal and Risk Monitoring: permit deadlines, ratio pressure, and policy alerting.
4. Audit Evidence Operations: exportable records, testing checklist, and regulator-facing readiness.

## Functional Gaps Identified

1. `GET/POST /api/vacancies` had no front-end implementation.
2. Employee creation action in dashboard was present visually but not functional.
3. Marketing navigation (`Solutions`, `Coverage`, `Workflow`, `Contact`) was anchor-only, not separate pages.
4. No dedicated public audit/testing page for demonstrations and pre-release checks.

## UI/IA Decisions

1. Add separate pages for `/solutions`, `/coverage`, `/workflow`, `/contact`, and `/audit-app`.
2. Keep employer operational module under `/dashboard` and expand with:
   - `/dashboard/vacancies`
   - `/dashboard/audit`
3. Centralize content structure in `lib/portal-content.js` for consistency across marketing and portal surfaces.
4. Introduce fallback messaging for database-unavailable states so workflows remain testable in sandbox mode.

## Delivery Artifacts

1. Shared content model (`portal content`, `marketing nav`, `dashboard modules`).
2. New public route pages and updated site navigation.
3. Vacancy and audit dashboards plus functional employee creation flow.
4. Updated branding assets (logo redesign) and route visibility updates (`middleware`, sitemap).

## Acceptance Criteria

1. Pressing `Solutions`, `Coverage`, `Workflow`, `Contact`, or `Audit App` opens a separate route page.
2. Vacancies can be created and listed through dashboard UI, with graceful fallback when DB is unavailable.
3. Employees can be created from dashboard UI with visible result state.
4. Dashboard navigation exposes all client modules.
5. New route structure is represented in middleware and sitemap outputs.
