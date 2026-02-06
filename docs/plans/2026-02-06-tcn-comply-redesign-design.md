# TCN Compliance Redesign - Design Plan (2026-02-06)

## Goals
- Redesign marketing site, auth, and dashboard to match professional compliance brand.
- Remove all public-facing dev/testing/disclaimer messaging.
- Replace mock data with real Firestore-backed data only.
- Provide live, credible metrics on the homepage (hybrid computed + admin-managed).
- Improve information architecture, accessibility, and mobile responsiveness.

## Non-Goals
- No deployment changes in this phase.
- No deep integrations (Jobsplus, Identita, Skills Pass) beyond placeholders and data model readiness.

## Scope
- Marketing site: homepage, footer, global header, privacy, and legal links.
- Auth: login and register pages.
- App: dashboard overview, employees, compliance tracking, reports, settings, support nav.
- New API routes for live metrics and dashboard aggregation.

## Brand and Visual Direction
- Colors:
  - Primary: #1a365d (professional blue)
  - Secondary: #2d8659 (trust green)
  - Accent: #d69e2e (compliance amber)
- Typography:
  - Headings: Space Grotesk
  - Body: Manrope
- Style:
  - Clean, high-contrast typography.
  - Subtle geometric background pattern in hero.
  - Reserved use of accent color for CTAs and signals.
  - Remove all developer/test language from UI and metadata.

## IA and UX
- Marketing header: Logo | Solutions | Resources | About | Support | Login | Free Trial
- Homepage sections:
  - Hero with CTA
  - Trust indicators (live metrics)
  - Features grid
  - Value proposition
  - Testimonial
  - CTA band
  - Compliance-focused footer with contact and legal links
- App shell:
  - Left nav: Dashboard, Applications, Compliance Tracking, Reports, Settings, Support
  - Top bar for org/user actions
- Dashboard:
  - Stat cards, quick actions, compliance widgets, recent applications table
- Empty state and onboarding:
  - Only show setup card when Firestore/config missing
  - Otherwise show clean empty states with primary CTA

## Data Model (Firestore)
Collections:
- orgs: profile, quota limits, policy flags, contact info
- applications: orgId, status, sector, createdAt, complianceStatus
- employees: orgId, status, renewalDate, courseStatus, skillsPassStatus
- vacancies: orgId, status, postingDates, complianceStatus
- complianceEvents: orgId, type, severity, createdAt, metadata
- metrics (document: global): timeSavingsPercent, penaltiesSavedEuro, updatedAt

All records include orgId and createdAt for aggregation and tenancy.

## Metrics Strategy (Hybrid)
- Computed metrics from Firestore:
  - applicationsProcessed (count of applications)
  - complianceRate (compliant / total)
- Admin-managed metrics:
  - timeSavingsPercent
  - penaltiesSavedEuro
- Public endpoint: GET /api/metrics
  - Returns computed + admin-managed values
  - Nulls if Firestore missing
- UI behavior:
  - Public pages display values or em dash when missing
  - Admin settings page allows updating admin-managed metrics

## API Routes
- GET /api/metrics (public): aggregated metrics only
- GET /api/dashboard (auth): stats + recent activity, scoped by orgId
- GET /api/employees (auth): list by orgId
- GET /api/vacancies (auth): list by orgId
- POST routes for create flows (applications, employees, vacancies)

## Auth and Access
- Firebase-only auth (remove demo credentials and fallback)
- Middleware remains, but allow public access to GET /api/metrics
- All non-metrics data behind auth; orgId required

## Error Handling
- API returns: error, code, setupRequired when configuration missing
- UI shows a single setup card for missing config
- Inline error states for forms and actions

## Accessibility and Performance
- WCAG 2.1 AA, keyboard-friendly forms
- Mobile nav drawer, stacked cards on small screens
- Lazy load non-critical sections
- Limit animations to hero fade-in and section stagger

## Testing
- Basic API tests for metrics and dashboard aggregation
- Smoke checks for homepage and auth
- Build and lint validation

## Risks and Mitigations
- Firestore not configured: handled via setupRequired and empty states
- Metrics credibility: computed when possible, admin managed otherwise
- Data migration: no reliance on mock data
