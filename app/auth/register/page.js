'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowUpRight, Building, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { GlassCard } from '../../../components/ui/glass-card.js'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <GlassCard intense className="overflow-hidden p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <span className="glass-chip">New Employer Setup</span>
            <h1 className="font-display text-3xl font-semibold text-white">
              Create your 2026 workspace
            </h1>
            <p className="text-sm text-slate-200">
              Register your company, assign your first admin account, and launch into the compliance
              cockpit immediately.
            </p>

            <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/20 bg-white/10 p-2">
                  <Image
                    src="/logo.svg"
                    alt="TCN Comply Malta"
                    fill
                    sizes="44px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Fast onboarding</p>
                  <p className="text-xs text-slate-200">No separate setup wizard required</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-200">
              Already onboarded?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-cyan-100 underline underline-offset-4"
              >
                Sign in here
              </Link>
              .
            </p>
          </div>

          <form method="post" onSubmit={handleSubmit} className="space-y-3">
            {error ? (
              <div className="flex items-center gap-2 rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ) : null}

            <label className="block space-y-2 text-sm text-slate-100">
              <span>Full name</span>
              <span className="relative block">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200" />
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="Jane Smith"
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm text-slate-100">
              <span>Email</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="name@company.mt"
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm text-slate-100">
              <span>Company</span>
              <span className="relative block">
                <Building className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200" />
                <input
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="Example Hospitality Ltd"
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm text-slate-100">
              <span>Password</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200" />
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="Minimum 6 characters"
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm text-slate-100">
              <span>Confirm password</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-200" />
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="Re-enter password"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="cta-primary inline-flex w-full items-center justify-center gap-2 py-3"
            >
              {loading ? 'Creating account...' : 'Create account'}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  )
}
