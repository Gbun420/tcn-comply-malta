import { getPublicMetrics } from '../../../lib/metrics.js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await getPublicMetrics()
    return Response.json(result)
  } catch (error) {
    console.error('Metrics API error:', error)
    return Response.json(
      { error: 'Failed to load metrics' },
      { status: 500 }
    )
  }
}
