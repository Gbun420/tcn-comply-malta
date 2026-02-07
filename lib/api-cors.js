const DEFAULT_ALLOWED_ORIGINS = ['https://tcn-comply-malta.vercel.app']

const DEFAULT_ALLOWED_METHODS = 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
const DEFAULT_ALLOWED_HEADERS = 'X-Requested-With, Content-Type, Authorization'

function mergeVary(existing, nextValue) {
  if (!existing) {
    return nextValue
  }

  const values = new Set(
    existing
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  )
  values.add(nextValue)
  return Array.from(values).join(', ')
}

export function getAllowedOrigins() {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (configuredOrigins.length > 0) {
    return configuredOrigins
  }

  return DEFAULT_ALLOWED_ORIGINS
}

export function isOriginAllowed(origin) {
  if (!origin) {
    return true
  }

  return getAllowedOrigins().includes(origin)
}

export function applyCorsHeaders(
  request,
  response,
  { methods = DEFAULT_ALLOWED_METHODS, headers = DEFAULT_ALLOWED_HEADERS } = {}
) {
  const origin = request.headers.get('origin')

  if (!origin) {
    response.headers.set('Access-Control-Allow-Origin', '*')
  } else if (isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  response.headers.set('Access-Control-Allow-Methods', methods)
  response.headers.set('Access-Control-Allow-Headers', headers)
  response.headers.set('Vary', mergeVary(response.headers.get('Vary'), 'Origin'))

  return response
}

export function preflightResponse(
  request,
  { methods = DEFAULT_ALLOWED_METHODS, headers = DEFAULT_ALLOWED_HEADERS } = {}
) {
  const origin = request.headers.get('origin')

  if (origin && !isOriginAllowed(origin)) {
    return applyCorsHeaders(
      request,
      Response.json({ error: 'Origin not allowed' }, { status: 403 }),
      { methods, headers }
    )
  }

  return applyCorsHeaders(request, new Response(null, { status: 204 }), { methods, headers })
}
