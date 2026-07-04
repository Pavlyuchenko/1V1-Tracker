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

type PlayerStats = {
  id: string
  name: string
  wins: number
  losses: number
  total: number
  winRate: string
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([])
  const [stats, setStats] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [matchesRes, statsRes] = await Promise.all([
        fetch('/api/games'),
        fetch('/api/stats'),
      ])

      const matchesData = await matchesRes.json()
      const statsData = await statsRes.json()

      if (Array.isArray(matchesData)) {
        setMatches(matchesData.slice(0, 5))
      }
      if (Array.isArray(statsData)) {
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-black">⚽ Malé Hoštice</h1>
            </div>
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Standings Section */}
        <div className="mb-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Standings</h2>

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : stats.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p className="mb-3">No players or matches yet.</p>
              <Link href="/settings" className="text-blue-600 hover:text-blue-700 font-medium inline-block">
                👤 Add players →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="px-3 py-2 text-left text-sm font-bold text-black">Rank</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-black">Player</th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-blue-600">Wins</th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-black">Losses</th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-black">Goals</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((player, idx) => (
                    <tr
                      key={player.id}
                      className="border-b border-gray-200 hover:bg-blue-50 transition"
                    >
                      <td className="px-3 py-2 font-bold text-black">#{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold text-black">{player.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-blue-600">{player.wins}</td>
                      <td className="px-3 py-2 text-center text-black font-medium">{player.losses}</td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player.goalsFor}-{player.goalsAgainst}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Matches Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Recent Matches</h2>

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : matches.length === 0 ? (
            <div className="text-gray-600 text-center py-8">
              No matches recorded yet.{' '}
              <Link href="/new-game" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one!
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-sm text-gray-600">
                        {new Date(match.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-semibold text-black">{match.player1_name}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-semibold text-black">{match.player2_name}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {match.player1_score}-{match.player2_score}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">{match.winner_name}</div>
                  </div>
                </div>
              ))}

              <Link
                href="/games"
                className="inline-block mt-6 text-blue-600 hover:text-blue-700 font-semibold"
              >
                View all matches →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
