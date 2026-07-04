'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navigation from '@/app/components/Navigation'

type Hráč = {
  id: string
  name: string
}

export default function Nastavení() {
  const [players, setHráčs] = useState<Hráč[]>([])
  const [newHráčName, setNewHráčName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchHráčs()
  }, [])

  const fetchHráčs = async () => {
    try {
      const res = await fetch('/api/players')
      const data = await res.json()
      if (Array.isArray(data)) {
        setHráčs(data)
      } else {
        setError('Načtení hráčů se nezdařilo')
      }
    } catch (error) {
      setError('Načtení hráčů se nezdařilo')
    } finally {
      setLoading(false)
    }
  }

  const handleAddHráč = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newHráčName.trim()) {
      setError('Jméno hráče je povinné')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newHráčName.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Přidání hráče se nezdařilo')
      }

      setHráčs([...players, data])
      setNewHráčName('')
      setSuccess('Hráč přidán!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Přidání hráče se nezdařilo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Nastavení */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Add New Hráč */}
        <div className="border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-bold text-black mb-4">Přidat nového hráče</h2>

          <form onSubmit={handleAddHráč} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Jméno hráče"
              value={newHráčName}
              onChange={(e) => setNewHráčName(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-black placeholder-gray-500 text-sm sm:text-base"
              autoFocus
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition text-sm sm:text-base"
            >
              {submitting ? 'Přidávání...' : 'Přidat'}
            </button>
          </form>

          {error && <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 text-xs sm:text-sm">{error}</div>}
          {success && <div className="mt-3 p-3 bg-green-100 border border-green-300 text-green-700 text-xs sm:text-sm">{success}</div>}
        </div>

        {/* Hráčs List */}
        <div className="border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-black mb-4">Aktuální hráči</h2>

          {loading ? (
            <div className="text-gray-600">Načítání...</div>
          ) : players.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              Zatím žádní hráči. Přidejte svého prvního hráče výše!
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200"
                >
                  <div className="text-xl">⚽</div>
                  <div className="font-medium text-black">{player.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
