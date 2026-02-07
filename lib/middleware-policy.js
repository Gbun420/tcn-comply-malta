export function evaluateMiddlewareRequest({
  method,
  pathname,
  hasToken,
  isApiRoute,
  isAuthApiRoute,
  publicPaths,
}) {
  if (isApiRoute && method === 'OPTIONS') {
    return 'api-preflight'
  }

  if (isApiRoute && !isAuthApiRoute && !hasToken) {
    return 'api-unauthorized'
  }

  if (!publicPaths.has(pathname) && !isApiRoute && !hasToken) {
    return 'redirect-login'
  }

  return 'allow'
}
