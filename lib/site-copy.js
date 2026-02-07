import { SITE_CONTACT_EMAIL } from './site-content.js'

export const HOME_COPY = {
  kicker: 'Professional Employer Platform',
  title: "Compliance Operations for Malta's 2026 TCN Requirements",
  description:
    'Operate onboarding, vacancy evidence, and renewal controls from a unified employer workspace built for audit traceability.',
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
