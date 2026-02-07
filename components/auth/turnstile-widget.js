'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export function TurnstileWidget({
  onTokenChange,
  siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
}) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!siteKey) {
      onTokenChange('')
      setLoadError('Human verification is unavailable right now. Please try again later.')
    }
  }, [onTokenChange, siteKey])

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current) {
      return undefined
    }

    const turnstile = globalThis?.turnstile
    if (!turnstile?.render) {
      onTokenChange('')
      setLoadError('Human verification failed to initialize. Please refresh and try again.')
      return undefined
    }

    if (widgetIdRef.current) {
      return undefined
    }

    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => {
        setLoadError('')
        onTokenChange(token)
      },
      'expired-callback': () => onTokenChange(''),
      'error-callback': () => {
        onTokenChange('')
        setLoadError('Human verification failed. Please refresh and try again.')
      },
    })

    return () => {
      if (widgetIdRef.current && globalThis?.turnstile?.remove) {
        globalThis.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [onTokenChange, scriptReady, siteKey])

  return (
    <div className="space-y-2 rounded-xl border border-white/15 bg-white/5 p-3">
      <p className="text-xs text-slate-200">
        Complete human verification to continue registration.
      </p>
      {siteKey ? (
        <>
          <Script
            src={TURNSTILE_SCRIPT_URL}
            strategy="afterInteractive"
            onLoad={() => setScriptReady(true)}
          />
          <div ref={containerRef} />
        </>
      ) : null}
      {loadError ? (
        <p aria-live="polite" className="text-xs text-rose-100">
          {loadError}
        </p>
      ) : null}
    </div>
  )
}
