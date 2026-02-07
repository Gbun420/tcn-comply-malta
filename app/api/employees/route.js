import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { applyCorsHeaders, preflightResponse } from '../../../lib/api-cors.js'
import { requireAuth } from '../../../lib/request-auth.js'

export const dynamic = 'force-dynamic'
const CORS_OPTIONS = { methods: 'GET,POST,OPTIONS' }

let db = null

function withCors(request, response) {
  return applyCorsHeaders(request, response, CORS_OPTIONS)
}

export function OPTIONS(request) {
  return preflightResponse(request, CORS_OPTIONS)
}

function getFirebaseAdmin() {
  if (db) return db

  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

    if (!projectId || !privateKey || !clientEmail) {
      return null
    }

    try {
      initializeApp({
        credential: cert({
          projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail,
        }),
      })
    } catch (error) {
      console.warn('Firebase admin initialization skipped:', error.message)
      return null
    }
  }

  try {
    db = getFirestore()
  } catch (error) {
    console.warn('Firestore get failed:', error.message)
    return null
  }

  return db
}

export async function POST(request) {
  const { errorResponse } = requireAuth(request)
  if (errorResponse) {
    return withCors(request, errorResponse)
  }

  try {
    const db = getFirebaseAdmin()
    if (!db) {
      return withCors(request, Response.json({ error: 'Database not configured' }, { status: 503 }))
    }

    const body = await request.json()
    const { passportNumber, nationality, position, salary, email, sector } = body

    const requiresSkillsPass = ['hospitality', 'tourism'].includes(sector)

    const employeeRef = db.collection('employees').doc()
    const employeeData = {
      id: employeeRef.id,
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

    return withCors(
      request,
      Response.json({
        success: true,
        employeeId: employeeRef.id,
        MaltaComplianceSummary: {
          preDepartureStatus: 'enrolled',
          skillsPassRequired: requiresSkillsPass,
          regulatoryRequirements: [
            'Complete pre-departure course within 42 days',
            requiresSkillsPass ? 'Complete sector-specific Skills Pass' : 'No Skills Pass required',
          ],
        },
      })
    )
  } catch (error) {
    console.error('Employee API Error:', error)
    return withCors(request, Response.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export async function GET(request) {
  const { errorResponse } = requireAuth(request)
  if (errorResponse) {
    return withCors(request, errorResponse)
  }

  try {
    const db = getFirebaseAdmin()
    if (!db) {
      return withCors(request, Response.json({ employees: [] }))
    }

    const employeesRef = db.collection('employees')
    const snapshot = await employeesRef.get()
    const employees = snapshot.docs.map((doc) => doc.data())

    return withCors(request, Response.json({ employees }))
  } catch {
    return withCors(request, Response.json({ error: 'Failed to fetch employees' }, { status: 500 }))
  }
}
