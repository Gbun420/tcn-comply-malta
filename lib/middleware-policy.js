export function evaluateMiddlewareRequest({
  pathname,
  hasToken,
  isApiRoute,
  isAuthApiRoute,
  publicPaths,
}) {
  if (isApiRoute && !isAuthApiRoute && !hasToken) {
    return 'api-unauthorized'
  }

  if (!publicPaths.has(pathname) && !isApiRoute && !hasToken) {
    return 'redirect-login'
  }

  return 'allow'
}
