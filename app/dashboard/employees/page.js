'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Download, Users } from 'lucide-react'
import PortalShell from '../../../components/PortalShell.js'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetch('/api/employees')
        const data = await response.json()
        setEmployees(data.employees || [])
        setSetupRequired(Boolean(data.setupRequired))
      } catch (error) {
        setEmployees([])
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.passportNumber?.includes(searchTerm)
    const matchesFilter = filterStatus === 'all' || employee.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'overdue':
        return 'bg-rose-100 text-rose-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <PortalShell
      title="TCN Employees"
      subtitle="Manage your Third-Country National workforce"
      actions={
        <button className="btn-accent flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      }
    >
      {setupRequired && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900">Connect your database</h2>
          <p className="text-sm text-slate-700 mt-2">
            Configure Firestore to start tracking employees and compliance status.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-amber focus:border-brand-amber"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-slate-500">Loading employees...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="table-header">Employee</th>
                  <th className="table-header">Position</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Course</th>
                  <th className="table-header">Renewal</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-brand-blue/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-brand-blue" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {employee.name || 'Unnamed'}
                          </div>
                          <div className="text-sm text-slate-500">
                            {employee.passportNumber || employee.passport}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-slate-900">{employee.position || '—'}</div>
                      <div className="text-sm text-slate-500">{employee.nationality || '—'}</div>
                    </td>
                    <td className="table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          employee.status
                        )}`}
                      >
                        {(employee.status || 'pending').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell text-slate-900">
                      {employee.courseStatus || employee.certificates?.pre_departure?.status || '—'}
                    </td>
                    <td className="table-cell text-slate-900">
                      {employee.renewalDate || '—'}
                    </td>
                    <td className="table-cell text-right">
                      <button className="text-brand-blue hover:text-brand-blue/80 mr-3">View</button>
                      <button className="text-slate-600 hover:text-slate-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmployees.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-2">No employees found</div>
                <div className="text-sm text-slate-500">
                  Try adjusting your search or add a new employee.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PortalShell>
  )
}
