'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Plus, Search, Users } from 'lucide-react'
import { DashboardShell } from '../../../components/dashboard/dashboard-shell.js'
import { GlassCard } from '../../../components/ui/glass-card.js'

const employeeSeed = [
  {
    id: 'EMP001',
    name: 'Maria Santos',
    passport: 'PH1234567',
    nationality: 'Philippines',
    position: 'Hotel Receptionist',
    status: 'active',
    courseStatus: 'completed',
    skillsPass: 'not_required',
    permitExpiry: '2024-12-15',
    salary: '€22,000',
  },
  {
    id: 'EMP002',
    name: 'Ahmed Hassan',
    passport: 'EG7654321',
    nationality: 'Egypt',
    position: 'Chef',
    status: 'pending',
    courseStatus: 'in_progress',
    skillsPass: 'pending',
    permitExpiry: '2025-01-20',
    salary: '€28,000',
  },
  {
    id: 'EMP003',
    name: 'Keiko Tanaka',
    passport: 'JP1122334',
    nationality: 'Japan',
    position: 'IT Specialist',
    status: 'overdue',
    courseStatus: 'not_started',
    skillsPass: 'not_required',
    permitExpiry: '2024-11-30',
    salary: '€35,000',
  },
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(employeeSeed)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [userEmail, setUserEmail] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    nationality: '',
    position: '',
    salary: '',
    email: '',
    sector: 'hospitality',
  })
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const data = await response.json()
      setUserEmail(data.user?.email || '')
    } catch {
      router.push('/auth/login')
    }
  }, [router])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.passport.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || employee.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [employees, filterStatus, searchTerm])

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'border-emerald-200/40 bg-emerald-200/20 text-emerald-100'
      case 'pending':
        return 'border-amber-200/40 bg-amber-200/20 text-amber-100'
      case 'overdue':
        return 'border-rose-200/40 bg-rose-200/20 text-rose-100'
      case 'draft':
        return 'border-sky-200/40 bg-sky-200/20 text-sky-100'
      default:
        return 'border-white/30 bg-white/10 text-slate-100'
    }
  }

  const handleCreateEmployee = async (event) => {
    event.preventDefault()
    setSaving(true)
    setNotice('')

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passportNumber: formData.passportNumber,
          nationality: formData.nationality,
          position: formData.position,
          salary: Number(formData.salary || 0),
          email: formData.email,
          sector: formData.sector,
        }),
      })

      if (response.status === 401) {
        router.push('/auth/login')
        return
      }

      const data = await response.json()

      if (!response.ok && response.status !== 503) {
        setNotice(data.error || 'Failed to create employee')
        return
      }

      const nextEmployee = {
        id: data.employeeId || `LOCAL-${Date.now()}`,
        name: formData.name,
        passport: formData.passportNumber,
        nationality: formData.nationality,
        position: formData.position,
        status: response.status === 503 ? 'draft' : 'pending',
        courseStatus: 'in_progress',
        skillsPass:
          formData.sector === 'hospitality' || formData.sector === 'tourism'
            ? 'pending'
            : 'not_required',
        permitExpiry: 'Pending assignment',
        salary: `€${Number(formData.salary || 0).toLocaleString('en-US')}`,
      }

      setEmployees((current) => [nextEmployee, ...current])
      setNotice(
        response.status === 503
          ? 'Employee saved in local draft mode. Database is not configured.'
          : 'Employee created successfully.'
      )
      setFormData({
        name: '',
        passportNumber: '',
        nationality: '',
        position: '',
        salary: '',
        email: '',
        sector: 'hospitality',
      })
      setShowCreateForm(false)
    } catch {
      setNotice('Network error while creating employee.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardShell
      title="Employee records"
      subtitle="Search, filter, and review workforce compliance attributes in a single interface."
      activePath="/dashboard/employees"
      userEmail={userEmail}
      onLogout={handleLogout}
      actions={
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="cta-primary inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {showCreateForm ? 'Close Form' : 'Add Employee'}
        </button>
      }
    >
      {showCreateForm ? (
        <GlassCard className="p-5">
          <form onSubmit={handleCreateEmployee} className="grid gap-3 md:grid-cols-2">
            <label className="block space-y-2 text-sm text-slate-100">
              <span>Full name</span>
              <input
                required
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="input-field"
                placeholder="Employee name"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-100">
              <span>Passport number</span>
              <input
                required
                value={formData.passportNumber}
                onChange={(event) =>
                  setFormData({ ...formData, passportNumber: event.target.value })
                }
                className="input-field"
                placeholder="AB1234567"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-100">
              <span>Nationality</span>
              <input
                required
                value={formData.nationality}
                onChange={(event) => setFormData({ ...formData, nationality: event.target.value })}
                className="input-field"
                placeholder="Philippines"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-100">
              <span>Position</span>
              <input
                required
                value={formData.position}
                onChange={(event) => setFormData({ ...formData, position: event.target.value })}
                className="input-field"
                placeholder="Hotel Receptionist"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-100">
              <span>Annual salary (EUR)</span>
              <input
                required
                min="0"
                type="number"
                value={formData.salary}
                onChange={(event) => setFormData({ ...formData, salary: event.target.value })}
                className="input-field"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-100">
              <span>Email</span>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="input-field"
                placeholder="employee@company.mt"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-100 md:col-span-2">
              <span>Sector</span>
              <select
                value={formData.sector}
                onChange={(event) => setFormData({ ...formData, sector: event.target.value })}
                className="input-field"
              >
                <option value="hospitality">Hospitality</option>
                <option value="tourism">Tourism</option>
                <option value="general">General</option>
              </select>
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="cta-primary inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {saving ? 'Creating...' : 'Create employee'}
              </button>
            </div>
          </form>
        </GlassCard>
      ) : null}

      {notice ? (
        <GlassCard className="p-4">
          <p className="text-sm text-cyan-100">{notice}</p>
        </GlassCard>
      ) : null}

      <GlassCard className="p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-200" />
            <input
              type="text"
              placeholder="Search by name or passport"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </label>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field max-w-[180px] bg-white/10"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>

          <button type="button" className="cta-ghost inline-flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="border-b border-white/15">
              <tr>
                <th className="table-header">Employee</th>
                <th className="table-header">Position</th>
                <th className="table-header">Status</th>
                <th className="table-header">Course</th>
                <th className="table-header">Skills Pass</th>
                <th className="table-header">Permit Expiry</th>
                <th className="table-header">Salary</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-white/10 last:border-b-0">
                  <td className="table-cell">
                    <p className="font-medium text-white">{employee.name}</p>
                    <p className="text-xs text-slate-300">{employee.passport}</p>
                  </td>
                  <td className="table-cell">
                    <p>{employee.position}</p>
                    <p className="text-xs text-slate-300">{employee.nationality}</p>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs uppercase tracking-[0.08em] ${getStatusClass(employee.status)}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="table-cell">{employee.courseStatus.replace('_', ' ')}</td>
                  <td className="table-cell">{employee.skillsPass.replace('_', ' ')}</td>
                  <td className="table-cell">{employee.permitExpiry}</td>
                  <td className="table-cell">{employee.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-200">
            No employees found. Try a different filter or search term.
          </div>
        ) : null}
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Workforce Status Mix</p>
          <p className="mt-2 font-display text-3xl text-white">62% Active</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Upcoming Renewals</p>
          <p className="mt-2 font-display text-3xl text-white">3 in 30 days</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-300">Skills Pass Pending</p>
          <p className="mt-2 font-display text-3xl text-white">4 records</p>
        </GlassCard>
      </div>
    </DashboardShell>
  )
}
