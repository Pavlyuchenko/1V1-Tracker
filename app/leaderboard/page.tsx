'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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

export default function Leaderboard() {
  const [stats, setStats] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      if (Array.isArray(data)) {
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
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

      {/* Leaderboard */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : stats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No players or matches yet.</p>
            <Link href="/settings" className="text-blue-600 hover:text-blue-700 font-semibold">
              Add players →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.slice(0, 3).map((player, idx) => (
                <div
                  key={player.id}
                  className="border-2 border-blue-600 rounded-lg p-6 bg-blue-50 relative"
                >
                  <div className="absolute top-2 right-4 text-3xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>

                  <div className="text-sm text-gray-600 font-medium">#{idx + 1}</div>
                  <h3 className="text-xl font-bold text-black mb-4 mt-1">{player.name}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Wins</span>
                      <span className="font-bold text-blue-600">{player.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Win Rate</span>
                      <span className="font-bold">{player.winRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">Player</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Matches</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Wins</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Losses</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Win %</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Goals</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((player, idx) => (
                      <tr
                        key={player.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 font-semibold text-black">#{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-black">{player.name}</td>
                        <td className="px-4 py-3 text-center text-black">{player.total}</td>
                        <td className="px-4 py-3 text-center font-semibold text-blue-600">{player.wins}</td>
                        <td className="px-4 py-3 text-center text-black">{player.losses}</td>
                        <td className="px-4 py-3 text-center text-black">{player.winRate}%</td>
                        <td className="px-4 py-3 text-center text-black">
                          {player.goalsFor}-{player.goalsAgainst}
                        </td>
                        <td className={`px-4 py-3 text-center font-semibold ${
                          player.goalDiff > 0 ? 'text-blue-600' : 'text-black'
                        }`}>
                          {player.goalDiff > 0 ? '+' : ''}{player.goalDiff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
