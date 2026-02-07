'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowUpRight, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { GlassCard } from '../../../components/ui/glass-card.js'
import { SITE_CONTACT_EMAIL } from '../../../lib/site-content.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <GlassCard intense className="overflow-hidden">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="border-b border-white/15 bg-white/6 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <div className="glass-chip">Secure Access</div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-white">Welcome back</h1>
            <p className="mt-3 text-sm text-slate-200">
              Sign in to manage employee compliance, renewals, and audit evidence in one glass
              workspace.
            </p>

            <div className="mt-6 rounded-2xl border border-white/15 bg-white/8 p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/20 bg-white/10">
                  <Image src="/logo.svg" alt="TCN Comply Malta" fill sizes="40px" className="object-contain p-1.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Employer Workspace</p>
                  <p className="text-xs text-slate-200">Malta 2026 Compliance Console</p>
                </div>
              </div>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-xs text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              Signed JWT sessions with role-aware route protection
            </p>
          </div>

          <div className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <div className="flex items-center gap-2 rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              ) : null}

              <label className="block space-y-2 text-sm text-slate-100">
                <span>Email</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-200" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="name@company.mt"
                  />
                </span>
              </label>

              <label className="block space-y-2 text-sm text-slate-100">
                <span>Password</span>
                <span className="relative block">
                  <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-200" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </span>
              </label>

              <button type="submit" disabled={loading} className="cta-primary inline-flex w-full items-center justify-center gap-2 py-3">
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-200">
              Need credentials?{' '}
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="font-semibold text-cyan-100 underline underline-offset-4">
                Contact support
              </a>
              .
            </p>
            <p className="mt-2 text-sm text-slate-200">
              New employer?{' '}
              <Link href="/auth/register" className="font-semibold text-cyan-100 underline underline-offset-4">
                Create an account
              </Link>
              .
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
