import { getDb } from './firebase-admin.js'

export function computeMetrics({ applications, admin } = {}) {
  const hasApplications = Array.isArray(applications)
  const applicationsProcessed = hasApplications ? applications.length : null

  let complianceRate = null
  if (hasApplications && applicationsProcessed > 0) {
    const compliantCount = applications.filter(
      (app) => app?.complianceStatus === 'compliant'
    ).length
    complianceRate = Math.round((compliantCount / applicationsProcessed) * 100)
  } else if (hasApplications) {
    complianceRate = 0
  }

  const timeSavingsPercent = Number.isFinite(admin?.timeSavingsPercent)
    ? admin.timeSavingsPercent
    : null
  const penaltiesSavedEuro = Number.isFinite(admin?.penaltiesSavedEuro)
    ? admin.penaltiesSavedEuro
    : null

  return {
    applicationsProcessed,
    complianceRate,
    timeSavingsPercent,
    penaltiesSavedEuro,
  }
}

export async function getPublicMetrics() {
  const db = getDb()
  if (!db) {
    return {
      setupRequired: true,
      metrics: computeMetrics({ applications: null, admin: null }),
    }
  }

  const applicationsSnapshot = await db.collection('applications').get()
  const compliantSnapshot = await db
    .collection('applications')
    .where('complianceStatus', '==', 'compliant')
    .get()

  const adminDoc = await db.collection('metrics').doc('global').get()
  const adminData = adminDoc.exists ? adminDoc.data() : null

  return {
    setupRequired: false,
    metrics: computeMetrics({
      applications: applicationsSnapshot.docs.map((doc) => doc.data()),
      admin: adminData,
    }),
  }
}
