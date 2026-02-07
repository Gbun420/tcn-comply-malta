import { SITE_CONTACT_EMAIL } from './site-content.js'

export const HOME_COPY = {
  kicker: 'For Malta Employers',
  title: 'Stay Audit-Ready for TCN Hiring in Malta',
  description:
    'Track onboarding, vacancy evidence, and renewal timelines in one compliance workspace built for audit readiness.',
}

export const EVIDENCE_SIGNALS = [
  {
    label: 'Policy-Mapped Controls',
    value: 'Mapped to documented Malta TCN obligations',
  },
  {
    label: 'Audit Evidence',
    value: 'Activity logs and evidence trails per workflow stage',
  },
  {
    label: 'Partner-Ready APIs',
    value: 'Authenticated routes with explicit preflight/CORS behavior',
  },
  {
    label: 'Operational Visibility',
    value: 'Dedicated dashboards for employees, vacancies, and audits',
  },
]

export const PUBLIC_PAGE_COPY = {
  home: {
    title: 'TCN Compliance Platform for Maltese Employers',
    description:
      'Manage TCN onboarding, vacancy proof, and renewal readiness with audit-first workflows aligned to Malta’s 2026 labour migration policy.',
    pathname: '/',
  },
  product: {
    title: 'Product Overview for TCN Compliance Operations',
    description:
      'Explore the compliance modules, workflow controls, and audit exports built for Malta employers managing TCN obligations.',
    pathname: '/product',
  },
  pricing: {
    title: 'Pricing Plans for Compliance Operations Teams',
    description:
      'Compare Starter, Growth, and Enterprise plans designed for employer compliance teams and partner-led rollouts.',
    pathname: '/pricing',
  },
  demo: {
    title: 'Book a Demo for TCN Comply Malta',
    description:
      'Schedule a walkthrough to evaluate coverage controls, workflow timelines, and evidence pack outputs for your organization.',
    pathname: '/demo',
  },
  solutions: {
    title: 'Compliance Solutions for TCN Workforce Operations',
    description:
      'Review portal modules that support onboarding checks, vacancy publication evidence, and renewal governance for Maltese employers.',
    pathname: '/solutions',
  },
  coverage: {
    title: 'Coverage Matrix for Malta TCN Compliance Controls',
    description:
      'Map each compliance obligation to evidence checkpoints, responsible actions, and audit outputs across your workforce workflows.',
    pathname: '/coverage',
  },
  workflow: {
    title: 'Operational Workflow for TCN Compliance Execution',
    description:
      'Run intake, validation, operation, and audit stages in a single compliance workflow for Maltese employer teams.',
    pathname: '/workflow',
  },
  contact: {
    title: 'Contact the TCN Compliance Implementation Team',
    description:
      'Coordinate rollout planning, onboarding support, and partner integration requirements for your compliance program.',
    pathname: '/contact',
  },
  auditApp: {
    title: 'Audit and Testing Workspace for Compliance Verification',
    description:
      'Use the dedicated audit app to verify API behavior, workflow readiness, and evidence completeness before stakeholder reviews.',
    pathname: '/audit-app',
  },
  guides: {
    title: 'Guides and Operational Templates for Malta TCN Compliance',
    description:
      'Use implementation guides and checklist templates to standardize onboarding, vacancy evidence, and renewal monitoring.',
    pathname: '/guides',
  },
  security: {
    title: 'Security and Data Handling',
    description:
      'Review platform security controls, access management, audit logging, and operational safeguards for compliance teams.',
    pathname: '/security',
  },
  dpa: {
    title: 'Data Processing Addendum Summary',
    description:
      'Understand processor responsibilities, security measures, and data governance commitments for customer compliance data.',
    pathname: '/dpa',
  },
  subprocessors: {
    title: 'Subprocessors and Infrastructure Services',
    description:
      'See infrastructure and service subprocessors used to deliver secure, reliable TCN Comply Malta operations.',
    pathname: '/subprocessors',
  },
  status: {
    title: 'Service Status and Uptime Health',
    description:
      'Monitor service availability and API health for production compliance workflows and partner integrations.',
    pathname: '/status',
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Read how TCN Comply Malta handles personal and operational data for secure, GDPR-aligned compliance operations.',
    pathname: '/privacy',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'Review service scope, account responsibilities, and regulatory boundaries for the TCN Comply Malta platform.',
    pathname: '/terms',
  },
}

export const AUTH_PAGE_COPY = {
  title: 'Employer Portal Access',
  description:
    'Secure sign-in and registration for authorized employer users managing TCN compliance workflows.',
}

export const COVERAGE_REGULATORY_SOURCES = [
  {
    name: 'Malta Migration Policy Document (June 2025)',
    url: 'https://identita.gov.mt/wp-content/uploads/2025/07/MIGRATION-POLICY-DOC-JUNE-2025.pdf',
    note: 'Primary policy source for current migration framework updates.',
  },
  {
    name: 'Identità Malta',
    url: 'https://identita.gov.mt/',
    note: 'Official authority information on residence, permits, and migration services.',
  },
  {
    name: 'Jobsplus',
    url: 'https://jobsplus.gov.mt/',
    note: 'Employment and vacancy publication authority referenced in recruitment workflows.',
  },
  {
    name: 'EURES Malta',
    url: 'https://eures.europa.eu/',
    note: 'EU recruitment channel commonly used for vacancy advertising evidence.',
  },
]

export const SUPPORT_MESSAGE = SITE_CONTACT_EMAIL
  ? `Need implementation support? Contact ${SITE_CONTACT_EMAIL}.`
  : 'Need implementation support? Submit a request through the contact page.'
