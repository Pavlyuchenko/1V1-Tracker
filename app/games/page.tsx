'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navigation from '@/app/components/Navigation'
import MatchCard from '@/app/components/MatchCard'

type Match = {
  id: string
  player1_name: string
  player2_name: string
  date: string
  player1_score: number
  player2_score: number
}

export default function Games() {
  const [matches, setZápasy] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchZápasy()
  }, [])

  const fetchZápasy = async () => {
    try {
      const res = await fetch('/api/games')
      const data = await res.json()
      if (Array.isArray(data)) {
        setZápasy(data)
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Zápasy List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-gray-600">Načítání...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Zatím nejsou zaznamenány žádné zápasy.</p>
            <Link href="/new-game" className="text-blue-600 hover:text-blue-700 font-semibold">
              Zaznamenej svůj první zápas →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
