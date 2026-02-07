export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'tcn-comply-malta',
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
  })
}
