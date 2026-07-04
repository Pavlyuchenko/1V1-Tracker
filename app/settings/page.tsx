'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Player = {
  id: string
  name: string
}

export default function Settings() {
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players')
      const data = await res.json()
      if (Array.isArray(data)) {
        setPlayers(data)
      } else {
        setError('Failed to load players')
      }
    } catch (error) {
      setError('Failed to load players')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPlayerName.trim()) {
      setError('Player name is required')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlayerName.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add player')
      }

      setPlayers([...players, data])
      setNewPlayerName('')
      setSuccess('Player added!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to add player')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-black hover:text-blue-600 font-bold text-lg flex-shrink-0">
              ⚽ Malé Hoštice
            </Link>
            <Link
              href="/new-game"
              className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm sm:text-base rounded-lg transition shadow-lg flex-shrink-0"
            >
              New Game
            </Link>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add New Player */}
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-black mb-4">Add New Player</h2>

          <form onSubmit={handleAddPlayer} className="flex gap-3">
            <input
              type="text"
              placeholder="Player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
            >
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </form>

          {error && <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">{error}</div>}
          {success && <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">{success}</div>}
        </div>

        {/* Players List */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-black mb-4">Current Players</h2>

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : players.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No players yet. Add your first player above!
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
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
