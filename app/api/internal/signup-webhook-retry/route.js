import { processSignupWebhookQueue } from '../../../../lib/signup/webhook-dispatch.js'

export const dynamic = 'force-dynamic'

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function POST(request) {
  const expectedSecret = process.env.INTERNAL_CRON_SECRET
  if (!expectedSecret) {
    return Response.json({ error: 'INTERNAL_CRON_SECRET is not configured' }, { status: 503 })
  }

  const providedSecret = request.headers.get('x-internal-secret') || ''
  if (providedSecret !== expectedSecret) {
    return unauthorized()
  }

  try {
    const summary = await processSignupWebhookQueue()
    return Response.json({ success: true, summary }, { status: 200 })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
