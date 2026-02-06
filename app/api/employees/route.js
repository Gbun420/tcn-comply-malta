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
      return Response.json({ employees: [], setupRequired: true })
    }

    const snapshot = await db
      .collection('employees')
      .where('orgId', '==', orgId)
      .get()

    const employees = snapshot.docs.map((doc) => doc.data())

    return Response.json({ employees })
  } catch (error) {
    console.error('Employees API Error:', error)
    return Response.json(
      { error: 'Failed to fetch employees' },
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

    const db = getDb()
    if (!db) {
      return Response.json(
        { error: 'Database not configured', setupRequired: true },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { passportNumber, nationality, position, salary, email, sector } = body

    const requiresSkillsPass = ['hospitality', 'tourism'].includes(sector)

    const employeeRef = db.collection('employees').doc()
    const employeeData = {
      id: employeeRef.id,
      orgId,
      passportNumber,
      nationality,
      position,
      salary: parseInt(salary),
      email,
      sector,
      status: 'pre_departure_in_progress',

      certificates: {
        pre_departure: {
          status: 'enrolled',
          enrollmentDate: new Date().toISOString(),
          cost: 250,
          paid: false,
          MaltaRequirement: {
            mandatory: true,
            deadline: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        skills_pass: {
          required: requiresSkillsPass,
          status: requiresSkillsPass ? 'pending' : 'not_required',
          sector: requiresSkillsPass ? sector : null,
        },
      },

      MaltaCompliance: {
        preDepartureCourseRequired: true,
        skillsPassRequired: requiresSkillsPass,
        electronicSalaryRequired: true,
        meets2026Standards: false,
      },

      createdAt: new Date().toISOString(),
    }

    await employeeRef.set(employeeData)

    return Response.json({
      success: true,
      employeeId: employeeRef.id,
      MaltaComplianceSummary: {
        preDepartureStatus: 'enrolled',
        skillsPassRequired: requiresSkillsPass,
        regulatoryRequirements: [
          'Complete pre-departure course within 42 days',
          requiresSkillsPass
            ? 'Complete sector-specific Skills Pass'
            : 'No Skills Pass required',
        ],
      },
    })
  } catch (error) {
    console.error('Employee API Error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
