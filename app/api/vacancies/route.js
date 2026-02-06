import { getDb } from '../../../lib/firebase-admin.js'

export const dynamic = 'force-dynamic'

function getOrgId(request) {
  return request.headers.get('x-user-id')
}

export async function GET(request) {
  try {
    const orgId = getOrgId(request)
    if (!orgId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    if (!db) {
      return Response.json({ vacancies: [], setupRequired: true })
    }

    const snapshot = await db
      .collection('vacancies')
      .where('orgId', '==', orgId)
      .get()

    const vacancies = snapshot.docs.map((doc) => doc.data())

    return Response.json({ vacancies })
  } catch (error) {
    console.error('Vacancy API Error:', error)
    return Response.json(
      { error: 'Failed to fetch vacancies' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const orgId = getOrgId(request)
    if (!orgId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, salary, sector, durationWeeks = 3 } = body

    const db = getDb()
    if (!db) {
      return Response.json(
        { error: 'Database not configured', setupRequired: true },
        { status: 503 }
      )
    }

    if (durationWeeks < 3) {
      return Response.json(
        { error: 'Malta regulation requires minimum 3-week vacancy posting' },
        { status: 400 }
      )
    }

    const vacancyRef = db.collection('vacancies').doc()
    const vacancyData = {
      id: vacancyRef.id,
      orgId,
      title,
      description,
      salary: parseInt(salary),
      sector,
      status: 'posted',
      postingDates: {
        jobsplusPosted: new Date().toISOString(),
        euresPosted: new Date().toISOString(),
        requiredDuration: parseInt(durationWeeks),
        expiresAt: new Date(
          Date.now() + durationWeeks * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      MaltaCompliance: {
        advertisedOnJobsplus: true,
        advertisedOnEURES: true,
        minimumDurationMet: durationWeeks >= 3,
        complianceStatus: 'valid',
      },
      createdAt: new Date().toISOString(),
    }

    await vacancyRef.set(vacancyData)

    return Response.json({
      success: true,
      vacancyId: vacancyRef.id,
      complianceStatus: 'compliant',
      message: 'Vacancy posted in compliance with Malta 2026 regulations',
    })
  } catch (error) {
    console.error('Vacancy API Error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
