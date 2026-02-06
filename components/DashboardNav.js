'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, BookOpen, Shield, AlertTriangle, CheckCircle, LogOut, Menu, X, ChevronDown } from 'lucide-react'

export default function DashboardNav({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">TCN</span>
                </div>
                <span className="text-xl font-bold text-slate-800">Comply<span className="text-amber-500">Malta</span></span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 text-sm text-slate-700 hover:text-slate-900"
                >
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500">{user?.company}</p>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-100">
                    <div className="px-4 py-2 text-xs text-slate-500 border-b">
                      Signed in as {user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <div className="px-3 py-2 flex items-center">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <p className="text-base font-medium text-slate-800">{user?.name}</p>
                  <p className="text-sm font-medium text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
