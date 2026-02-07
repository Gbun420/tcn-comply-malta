'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

const INITIAL_FORM = {
  name: '',
  email: '',
  company: '',
  role: '',
  companySize: '',
  sector: '',
  message: '',
}

export function DemoForm() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Demo request')
    const body = encodeURIComponent(
      [
        `Name: ${formData.name || '-'}`,
        `Email: ${formData.email || '-'}`,
        `Company: ${formData.company || '-'}`,
        `Role: ${formData.role || '-'}`,
        `Company size: ${formData.companySize || '-'}`,
        `Sector: ${formData.sector || '-'}`,
        '',
        `Message: ${formData.message || '-'}`,
      ].join('\n')
    )

    return `mailto:contact@tcncomply.mt?subject=${subject}&body=${body}`
  }, [formData])

  function updateField(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('submitting')
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const payload = await response.json()

      if (response.ok) {
        setStatus('success')
        return
      }

      setStatus('idle')
      setError(payload.error || 'Unable to submit demo request.')
    } catch {
      setStatus('idle')
      setError('Network error while sending your request.')
    }
  }

  if (status === 'success') {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200/30 bg-emerald-200/10 p-6">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-100">
          <CheckCircle2 className="h-4 w-4" />
          Demo request submitted
        </p>
        <p className="text-sm text-slate-100">
          Our team will contact you shortly to confirm your walkthrough.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Name</span>
          <input
            className="input-field"
            name="name"
            required
            autoComplete="name"
            value={formData.name}
            onChange={updateField}
            placeholder="Jane Smith"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Work email</span>
          <input
            className="input-field"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={updateField}
            placeholder="jane@company.mt"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Company</span>
          <input
            className="input-field"
            name="company"
            required
            autoComplete="organization"
            value={formData.company}
            onChange={updateField}
            placeholder="Example Hospitality Ltd"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Role</span>
          <input
            className="input-field"
            name="role"
            autoComplete="organization-title"
            value={formData.role}
            onChange={updateField}
            placeholder="HR Manager"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Company size</span>
          <select
            className="input-field"
            name="companySize"
            value={formData.companySize}
            onChange={updateField}
          >
            <option value="">Select</option>
            <option value="1-25">1-25 employees</option>
            <option value="26-100">26-100 employees</option>
            <option value="101-300">101-300 employees</option>
            <option value="301+">301+ employees</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span>Primary sector</span>
          <select className="input-field" name="sector" value={formData.sector} onChange={updateField}>
            <option value="">Select</option>
            <option value="hospitality">Hospitality</option>
            <option value="construction">Construction</option>
            <option value="healthcare">Healthcare</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span>Current challenge</span>
        <textarea
          className="input-field min-h-32"
          name="message"
          value={formData.message}
          onChange={updateField}
          placeholder="Tell us where you need help (renewals, vacancy evidence, audits, etc.)"
        />
      </label>

      {error ? (
        <div aria-live="polite" className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="cta-primary inline-flex items-center gap-2"
        >
          {status === 'submitting' ? 'Submitting...' : 'Request demo'}
          <ArrowUpRight className="h-4 w-4" />
        </button>
        <a href={mailtoHref} className="cta-ghost inline-flex items-center gap-2">
          Send via email
        </a>
      </div>
    </form>
  )
}
