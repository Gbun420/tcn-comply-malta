'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Shield, Users, Clock, AlertTriangle, CheckCircle, LogOut } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { name: 'Total Employees', value: '24', change: '+12%', icon: Users },
    { name: 'Courses Completed', value: '18', change: '+25%', icon: BookOpen },
    { name: 'Pending Renewals', value: '3', change: '-2', icon: Clock },
    { name: 'Compliance Rate', value: '92%', change: '+5%', icon: CheckCircle },
  ]

  const employees = [
    { id: 'EMP001', name: 'Maria Santos', passport: 'PH1234567', status: 'active', course: 'Completed', renewal: '2024-12-15', skillsPass: 'Not Required' },
    { id: 'EMP002', name: 'Ahmed Hassan', passport: 'EG7654321', status: 'pending', course: 'In Progress', renewal: '2025-01-20', skillsPass: 'Pending' },
    { id: 'EMP003', name: 'Keiko Tanaka', passport: 'JP1122334', status: 'overdue', course: 'Not Started', renewal: '2024-11-30', skillsPass: 'Not Required' }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-3">
              <img src="/logo.svg" alt="TCN Comply Malta Logo" className="w-12 h-12" />
              <div>
                <span className="text-xl font-bold text-slate-800">TCN Comply</span>
                <span className="text-xl font-bold text-amber-500">Malta</span>
              </div>
            </a>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 hover:text-amber-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Welcome back, {user?.name}. Here's what's happening with your TCN compliance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-sm text-emerald-600 font-medium mt-4">{stat.change} from last period</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">TCN Employees</h2>
            <p className="text-sm text-slate-600">Manage your Third-Country National workforce compliance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-header">Employee</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Course</th>
                  <th className="table-header">Skills Pass</th>
                  <th className="table-header">Renewal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                          <div className="text-sm text-slate-500">{emp.passport}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        emp.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell text-slate-900">{emp.course}</td>
                    <td className="table-cell text-slate-900">{emp.skillsPass}</td>
                    <td className="table-cell text-slate-900">{emp.renewal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Renewals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Keiko Tanaka</p>
                  <p className="text-sm text-slate-600">Renewal due in 15 days</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Ahmed Hassan</p>
                  <p className="text-sm text-slate-600">Course completion overdue</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Compliance Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 mr-3" />
                <p className="text-sm text-slate-700">All vacancies posted for 3+ weeks as required</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 mr-3" />
                <p className="text-sm text-slate-700">Electronic salary payments verified</p>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-3" />
                <p className="text-sm text-slate-700">Approaching workforce quota limit (85%)</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
