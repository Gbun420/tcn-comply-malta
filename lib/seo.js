import { SITE_NAME } from './site-content.js'
import { absoluteUrl, siteUrl } from './site.js'

export const SITE_URL = siteUrl
export const OG_IMAGE_PATH = '/og-image.svg'

export const BASE_KEYWORDS = [
  'Malta TCN compliance',
  'Third-Country Nationals Malta',
  '2026 Labour Migration Policy',
  'Malta immigration compliance',
  'TCN employer portal',
  'Jobsplus and EURES evidence',
  'Skills Pass tracking',
]

const FALLBACK_SITEMAP_LASTMOD = '2026-02-07T12:00:00.000Z'

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

export function toAbsoluteUrl(pathname) {
  return absoluteUrl(normalizePath(pathname))
}

export function getStableLastModified() {
  const candidates = [
    process.env.SITEMAP_LASTMOD,
    process.env.VERCEL_GIT_COMMIT_DATE,
    process.env.BUILD_TIMESTAMP,
  ]

  for (const value of candidates) {
    if (!value) continue

    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  }

  return FALLBACK_SITEMAP_LASTMOD
}

export function buildPageMetadata({
  title,
  description,
  pathname,
  keywords = [],
  index = true,
  follow = true,
}) {
  const canonicalPath = normalizePath(pathname)
  const canonicalUrl = toAbsoluteUrl(canonicalPath)
  const fullTitle = `${title} | ${SITE_NAME}`
  const metadata = {
    title: fullTitle,
    description,
    keywords: [...BASE_KEYWORDS, ...keywords].join(', '),
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_MT',
      type: 'website',
      images: [OG_IMAGE_PATH],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [OG_IMAGE_PATH],
    },
    robots: index
      ? { index: true, follow }
      : {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        },
  }

  if (index) {
    metadata.alternates = {
      canonical: canonicalPath,
    }
  }

  return metadata
}
