const DEFAULT_PRODUCTION_SITE_URL = 'https://tcn-comply-malta.vercel.app'
const DEFAULT_LOCAL_SITE_URL = 'http://localhost:3000'

function normalizeUrl(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) {
    return normalizeUrl(configured)
  }

  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_PRODUCTION_SITE_URL
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`)
  }

  return DEFAULT_LOCAL_SITE_URL
}

export const siteUrl = getSiteUrl()

export function absoluteUrl(pathname = '/') {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return new URL(normalizedPath, `${siteUrl}/`).toString()
}
