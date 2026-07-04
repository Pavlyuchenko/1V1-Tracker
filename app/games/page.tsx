'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Match = {
  id: string
  player1_name: string
  player2_name: string
  winner_name: string
  date: string
  player1_score: number
  player2_score: number
}

export default function Games() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/games')
      const data = await res.json()
      if (Array.isArray(data)) {
        setMatches(data)
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
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
            <nav className="flex gap-4 sm:gap-8 items-center flex-shrink-0">
              <Link
                href="/settings"
                className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 font-medium transition whitespace-nowrap"
              >
                Settings
              </Link>
              <Link
                href="/new-game"
                className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm sm:text-base rounded-lg transition shadow-lg flex-shrink-0"
              >
                New Game
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No matches recorded yet.</p>
            <Link href="/new-game" className="text-blue-600 hover:text-blue-700 font-semibold">
              Record your first match →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="border border-gray-200 rounded-lg p-5 hover:bg-blue-50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Date */}
                  <div className="text-sm text-gray-500 min-w-fit">
                    {new Date(match.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>

                  {/* Match Result - Main Focus */}
                  <div className="flex-1 flex items-center justify-center gap-4 min-w-0">
                    <div className="text-right">
                      <div className="font-bold text-black text-lg truncate">{match.player1_name}</div>
                      <div className="text-3xl font-black text-blue-600 leading-none">{match.player1_score}</div>
                    </div>

                    <div className="text-gray-400 text-2xl font-light flex-shrink-0">-</div>

                    <div className="text-left">
                      <div className="font-bold text-black text-lg truncate">{match.player2_name}</div>
                      <div className="text-3xl font-black text-blue-600 leading-none">{match.player2_score}</div>
                    </div>
                  </div>

                  {/* Winner Badge */}
                  <div className="min-w-fit">
                    <div className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full whitespace-nowrap">
                      {match.winner_name === match.player1_name ? '✓' : '✗'} {match.winner_name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
