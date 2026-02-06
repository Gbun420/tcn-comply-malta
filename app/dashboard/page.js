'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  BookOpen,
  Clock,
  ShieldAlert,
  Plus,
  Upload,
  FileBarChart2,
} from 'lucide-react'
import PortalShell from '../../components/PortalShell.js'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch('/api/dashboard')
        const payload = await response.json()
        setData(payload)
      } catch (error) {
        setData({ error: 'Failed to load dashboard' })
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-amber mx-auto" />
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (data?.error) {
    return (
      <PortalShell title="Dashboard">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900">Unable to load dashboard</h2>
          <p className="text-sm text-slate-600 mt-2">{data.error}</p>
        </div>
      </PortalShell>
    )
  }

  const stats = [
    {
      name: 'Total Employees',
      value: data?.stats?.totalEmployees ?? '—',
      icon: Users,
    },
    {
      name: 'Courses Completed',
      value: data?.stats?.coursesCompleted ?? '—',
      icon: BookOpen,
    },
    {
      name: 'Pending Renewals',
      value: data?.stats?.pendingRenewals ?? '—',
      icon: Clock,
    },
    {
      name: 'Compliance Alerts',
      value: data?.stats?.complianceAlerts ?? '—',
      icon: ShieldAlert,
    },
  ]

  return (
    <PortalShell
      title="Dashboard"
      subtitle="Overview of compliance activity and upcoming deadlines"
      actions={
        <div className="flex items-center gap-2">
          <button className="btn-secondary">Download Report</button>
          <button className="btn-accent">New Application</button>
        </div>
      }
    >
      {data?.setupRequired && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900">Finish your setup</h2>
          <p className="text-sm text-slate-700 mt-2">
            Connect your Firestore project to unlock live compliance tracking and metrics.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-brand-blue" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
            <p className="text-sm text-slate-500">Latest TCN applications and statuses</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-header">Applicant</th>
                  <th className="table-header">Position</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(data?.recentApplications || []).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell">{app.candidateName || app.name || '—'}</td>
                    <td className="table-cell">{app.position || '—'}</td>
                    <td className="table-cell">
                      <span className="badge-info">{app.status || 'Pending'}</span>
                    </td>
                    <td className="table-cell">{app.updatedAt || app.createdAt || '—'}</td>
                  </tr>
                ))}
                {(data?.recentApplications || []).length === 0 && (
                  <tr>
                    <td className="table-cell text-slate-500" colSpan="4">
                      No applications yet. Start your first application to see it here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
            <div className="mt-4 space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg text-sm font-semibold">
                <Plus className="w-4 h-4" />
                New Application
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg text-sm font-semibold">
                <Upload className="w-4 h-4" />
                Upload Documents
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg text-sm font-semibold">
                <FileBarChart2 className="w-4 h-4" />
                View Reports
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Compliance Alerts</h3>
            <div className="mt-4 space-y-3">
              {(data?.complianceEvents || []).map((event) => (
                <div key={event.id} className="border border-slate-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-900">{event.title || 'Alert'}</p>
                  <p className="text-xs text-slate-500 mt-1">{event.description || 'Review required.'}</p>
                </div>
              ))}
              {(data?.complianceEvents || []).length === 0 && (
                <p className="text-sm text-slate-500">No active alerts. You're in good shape.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
