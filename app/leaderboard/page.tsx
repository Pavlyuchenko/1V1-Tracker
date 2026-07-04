'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navigation from '@/app/components/Navigation'

type HráčStats = {
  id: string
  name: string
  wins: number
  losses: number
  total: number
  winRate: string
  goalsFor: number
  goalsAgainst: number
  goalRozdíl: number
}

export default function Leaderboard() {
  const [stats, setStats] = useState<HráčStats[]>([])
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
      <Navigation />

      {/* Leaderboard */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-gray-600">Načítání...</div>
        ) : stats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Zatím žádní hráči nebo zápasy.</p>
            <Link href="/settings" className="text-blue-600 hover:text-blue-700 font-semibold">
              Přidat hráče →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.slice(0, 3).map((player, idx) => (
                <div
                  key={player.id}
                  className="border-2 border-blue-600 p-6 bg-blue-50 relative"
                >
                  <div className="absolute top-2 right-4 text-3xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>

                  <div className="text-sm text-gray-600 font-medium">#{idx + 1}</div>
                  <h3 className="text-xl font-bold text-black mb-4 mt-1">{player.name}</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Výhry</span>
                      <span className="font-bold text-blue-600">{player.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Procento vítězství</span>
                      <span className="font-bold">{player.winRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Table */}
            <div className="border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">Pořadí</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase">Hráč</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Zápasy</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Výhry</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Prohry</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Procento vítězství</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Góly</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-black uppercase">Rozdíl</th>
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
                          player.goalRozdíl > 0 ? 'text-blue-600' : 'text-black'
                        }`}>
                          {player.goalRozdíl > 0 ? '+' : ''}{player.goalRozdíl}
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
