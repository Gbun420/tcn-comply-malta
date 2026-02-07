export const INDEXABLE_ROUTES = [
  '/',
  '/product',
  '/pricing',
  '/demo',
  '/solutions',
  '/coverage',
  '/workflow',
  '/audit-app',
  '/guides',
  '/guides/onboarding-checklist',
  '/guides/vacancy-evidence',
  '/guides/renewal-monitoring',
  '/security',
  '/dpa',
  '/subprocessors',
  '/status',
  '/contact',
  '/privacy',
  '/terms',
]

export const LIGHTHOUSE_SEO_ROUTES = [
  '/',
  '/product',
  '/pricing',
  '/demo',
  '/coverage',
  '/security',
]

export const EXCLUDED_SITEMAP_PATHS = ['/auth/login', '/auth/register', '/dashboard']

export const PUBLIC_PATHS = new Set([
  ...INDEXABLE_ROUTES,
  '/auth/login',
  '/auth/register',
  '/robots.txt',
  '/sitemap.xml',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/health',
  '/api/leads',
])
