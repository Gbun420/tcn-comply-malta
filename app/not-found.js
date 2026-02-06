'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-600 mb-4">Page Not Found</h2>
          <p className="text-slate-500 mb-8">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Go to Homepage
          </Link>
          <Link 
            href="/auth/login"
            className="block w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Login to Dashboard
          </Link>
        </div>

        <div className="mt-12 p-4 bg-white rounded-lg border border-slate-100">
          <p className="text-sm text-slate-500">
            TCN Comply Malta - TCN Compliance Platform
          </p>
        </div>
      </div>
    </div>
  )
}
