'use client'

import { useEffect, useState } from 'react'
import { isAuthenticated, checkAuth, setAuthToken, clearAuthToken, getAuthUser } from '@/lib/auth'
import Navigation from './Navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated()) {
      const user = getAuthUser()
      setCurrentUser(user)
      setAuthenticated(true)
    }
  }, [])

  if (!mounted) return null

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const userName = checkAuth(password)
    if (userName) {
      setAuthToken(userName)
      setCurrentUser(userName)
      setAuthenticated(true)
      setPassword('')
    } else {
      setError('Špatné heslo')
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    setAuthenticated(false)
    setCurrentUser(null)
    setPassword('')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-black mb-2">Přihlášení</h1>
            <p className="text-gray-600 mb-6">Zadejte své heslo pro přidávání zápasů</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo"
                className="w-full px-4 py-2 border border-gray-300 text-black"
                autoFocus
              />
              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Přihlásit
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {children}
      <div className="fixed bottom-0 right-0 p-2 sm:p-4 z-50 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-white border-t border-l border-gray-200">
        <span className="text-black font-medium text-xs sm:text-sm">Přihlášen: <strong>{currentUser}</strong></span>
        <button
          onClick={handleLogout}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-300 text-black text-xs sm:text-sm font-medium whitespace-nowrap"
        >
          Odhlásit
        </button>
      </div>
    </div>
  )
}
