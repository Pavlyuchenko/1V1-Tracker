'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Player = {
  id: string
  name: string
}

export default function NewGame() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players')
      const data = await res.json()
      if (Array.isArray(data)) {
        setPlayers(data)
        if (data.length >= 2) {
          setPlayer1Id(data[0].id)
          setPlayer2Id(data[1].id)
        }
      } else {
        setError('Failed to load players')
      }
    } catch (error) {
      setError('Failed to load players')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!player1Id || !player2Id || player1Id === player2Id) {
      setError('Please select two different players')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1_id: player1Id,
          player2_id: player2Id,
          date: matchDate,
          player1_score: player1Score,
          player2_score: player2Score,
        }),
      })

      if (!res.ok) throw new Error('Failed to create match')

      router.push('/games')
    } catch (error) {
      setError('Failed to save match')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-black">Loading...</div>

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
              href="/settings"
              className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 font-medium transition whitespace-nowrap"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-black mb-8">Record New Match</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Player Selection */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-black mb-4">Select Players</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Player 1</label>
                <select
                  value={player1Id}
                  onChange={(e) => setPlayer1Id(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                >
                  <option value="">Select player</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Player 2</label>
                <select
                  value={player2Id}
                  onChange={(e) => setPlayer2Id(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                >
                  <option value="">Select player</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Match Date */}
          <div className="border border-gray-200 rounded-lg p-6">
            <label className="block text-sm font-medium text-black mb-2">Match Date</label>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>

          {/* Scores */}
          {player1Id && player2Id && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-black mb-6">Enter Score</h2>

              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 text-center">
                  <label className="block text-sm font-medium text-black mb-3">
                    {players.find((p) => p.id === player1Id)?.name}
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPlayer1Score(Math.max(0, player1Score - 1))}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition"
                    >
                      −
                    </button>
                    <div className="w-20 px-4 py-3 text-center border border-gray-300 rounded-lg text-3xl font-bold text-blue-600 bg-white">
                      {player1Score}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlayer1Score(Math.min(5, player1Score + 1))}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-3xl font-light text-gray-400">vs</div>

                <div className="flex-1 text-center">
                  <label className="block text-sm font-medium text-black mb-3">
                    {players.find((p) => p.id === player2Id)?.name}
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPlayer2Score(Math.max(0, player2Score - 1))}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition"
                    >
                      −
                    </button>
                    <div className="w-20 px-4 py-3 text-center border border-gray-300 rounded-lg text-3xl font-bold text-blue-600 bg-white">
                      {player2Score}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlayer2Score(Math.min(5, player2Score + 1))}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Winner Preview */}
          {player1Score !== player2Score && player1Id && player2Id && (
            <div className="border-2 border-blue-600 rounded-lg p-6 bg-blue-50">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">WINNER</div>
                <div className="text-2xl font-bold text-blue-600">
                  {player1Score > player2Score
                    ? players.find((p) => p.id === player1Id)?.name
                    : players.find((p) => p.id === player2Id)?.name}
                </div>
              </div>
            </div>
          )}

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !player1Id || !player2Id || player1Id === player2Id}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
          >
            {submitting ? 'Saving...' : 'Save Match'}
          </button>
        </form>
      </div>
    </div>
  )
}
