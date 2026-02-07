import { SITE_CONTACT_EMAIL, SITE_CONTACT_PHONE } from './site-content.js'

export const MARKETING_NAV_LINKS = [
  { href: '/audit-app', label: 'Audit App' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/coverage', label: 'Coverage' },
  { href: '/workflow', label: 'Workflow' },
  { href: '/contact', label: 'Contact' },
]

export const PUBLIC_MARKETING_PATHS = MARKETING_NAV_LINKS.map((item) => item.href)

export const PORTAL_OFFERINGS = {
  solutions: [
    {
      title: 'Onboarding Compliance Workspace',
      detail:
        'Track pre-departure obligations, qualifications, and salary conditions in one client console.',
    },
    {
      title: 'Vacancy Publication Control',
      detail:
        'Capture Jobsplus and EURES posting evidence with date windows for regulator-ready history.',
    },
    {
      title: 'Renewal Deadline Intelligence',
      detail:
        'Surface permit expiries and exception risks with role-based reminders for HR and operations.',
    },
    {
      title: 'Audit Pack Exports',
      detail:
        'Compile route-level evidence and activity summaries for legal, compliance, and board reporting.',
    },
  ],
  coverage: [
    'Pre-departure learning and evidence milestones',
    'Skills Pass requirement visibility for tourism and hospitality',
    'Quota and workforce ratio awareness before submission',
    'Electronic salary and employer condition checklist',
  ],
  workflow: [
    {
      step: '01',
      title: 'Intake',
      detail: 'Create employee and vacancy records with policy-critical fields from day one.',
    },
    {
      step: '02',
      title: 'Validate',
      detail: 'Run compliance checks against timeline and sector obligations before filing.',
    },
    {
      step: '03',
      title: 'Operate',
      detail: 'Monitor workforce status, renewals, and risk alerts in live dashboards.',
    },
    {
      step: '04',
      title: 'Audit',
      detail:
        'Generate evidence views and share test outputs with internal and external reviewers.',
    },
  ],
  contactChannels: [
    {
      label: 'Compliance Support',
      value: SITE_CONTACT_EMAIL,
      href: `mailto:${SITE_CONTACT_EMAIL}`,
    },
    {
      label: 'Client Success Line',
      value: SITE_CONTACT_PHONE,
      href: null,
    },
    {
      label: 'Implementation Briefing',
      value: 'Request a portal rollout session',
      href: '/auth/register',
    },
  ],
}

export const DASHBOARD_MODULES = [
  {
    href: '/dashboard',
    label: 'Overview',
    summary: 'Real-time posture view with alerts, completion levels, and action priorities.',
  },
  {
    href: '/dashboard/employees',
    label: 'Employees',
    summary: 'Manage workforce records, lifecycle status, and onboarding controls.',
  },
  {
    href: '/dashboard/vacancies',
    label: 'Vacancies',
    summary: 'Publish and track vacancy evidence with regulation-aware validation.',
  },
  {
    href: '/dashboard/audit',
    label: 'Audit',
    summary: 'Centralize audit checks, testing steps, and regulator-ready evidence.',
  },
]
