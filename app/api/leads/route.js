import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

function getDb() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!projectId || !clientEmail || !privateKey) {
      return null
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    })
  }

  return getFirestore()
}

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 })
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid request body')
  }

  const name = body?.name?.trim()
  const email = body?.email?.trim()
  const company = body?.company?.trim()

  if (!name || !email || !company) {
    return badRequest('Name, email, and company are required')
  }

  const db = getDb()
  if (!db) {
    return Response.json({ error: 'Lead capture is not configured yet' }, { status: 503 })
  }

  try {
    const ref = db.collection('leads').doc()
    await ref.set({
      id: ref.id,
      name,
      email,
      company,
      role: body?.role?.trim() || '',
      companySize: body?.companySize?.trim() || '',
      sector: body?.sector?.trim() || '',
      message: body?.message?.trim() || '',
      referrer: request.headers.get('referer') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'new',
      createdAt: new Date().toISOString(),
    })

    return Response.json({ success: true, leadId: ref.id }, { status: 201 })
  } catch (error) {
    console.error('Lead capture error:', error)
    return Response.json({ error: 'Unable to save lead request' }, { status: 500 })
  }
}
