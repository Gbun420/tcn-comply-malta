'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Lock, Mail } from 'lucide-react'
import { SITE_CONTACT_EMAIL } from '../../../lib/site-content.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4">
              <img src="/logo.svg" alt="TCN Comply Malta Logo" className="mx-auto h-20 w-20" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Sign in to TCN Comply</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center rounded-lg border border-rose-200 bg-rose-50 p-4">
                <AlertCircle className="mr-2 h-5 w-5 text-rose-500" />
                <span className="text-sm text-rose-700">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Password"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full px-4 py-3">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                Need access? Contact{' '}
                <a
                  href={`mailto:${SITE_CONTACT_EMAIL}`}
                  className="font-medium text-amber-600 hover:underline"
                >
                  {SITE_CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
