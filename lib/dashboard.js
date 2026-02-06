import { getDb } from './firebase-admin.js'

function isRenewalWithinDays(dateValue, days) {
  if (!dateValue) return false
  const renewal = new Date(dateValue)
  if (Number.isNaN(renewal.getTime())) return false
  const today = new Date()
  const diffTime = renewal - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days && diffDays >= 0
}

export function computeDashboardStats({ employees = [], complianceEvents = [] } = {}) {
  const safeEmployees = Array.isArray(employees) ? employees : []
  const safeEvents = Array.isArray(complianceEvents) ? complianceEvents : []

  const totalEmployees = safeEmployees.length
  const coursesCompleted = safeEmployees.filter(
    (emp) => emp?.courseStatus === 'Completed'
  ).length
  const pendingRenewals = safeEmployees.filter((emp) =>
    isRenewalWithinDays(emp?.renewalDate, 90)
  ).length
  const complianceAlerts = safeEvents.filter(
    (event) => event?.severity === 'high' || event?.severity === 'medium'
  ).length

  return {
    totalEmployees,
    coursesCompleted,
    pendingRenewals,
    complianceAlerts,
  }
}

export async function getDashboardData(orgId) {
  const db = getDb()
  if (!db) {
    return {
      setupRequired: true,
      stats: computeDashboardStats({ employees: [], complianceEvents: [] }),
      recentApplications: [],
      complianceEvents: [],
    }
  }

  const employeesSnapshot = await db
    .collection('employees')
    .where('orgId', '==', orgId)
    .get()

  const applicationsSnapshot = await db
    .collection('applications')
    .where('orgId', '==', orgId)
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()

  const eventsSnapshot = await db
    .collection('complianceEvents')
    .where('orgId', '==', orgId)
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()

  const employees = employeesSnapshot.docs.map((doc) => doc.data())
  const complianceEvents = eventsSnapshot.docs.map((doc) => doc.data())

  return {
    setupRequired: false,
    stats: computeDashboardStats({ employees, complianceEvents }),
    recentApplications: applicationsSnapshot.docs.map((doc) => doc.data()),
    complianceEvents,
  }
}
