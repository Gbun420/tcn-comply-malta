import { getDashboardData } from '../../../lib/dashboard.js'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const orgId = request.headers.get('x-user-id')
    if (!orgId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await getDashboardData(orgId)
    return Response.json(data)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return Response.json(
      { error: 'Failed to load dashboard' },
      { status: 500 }
    )
  }
}
