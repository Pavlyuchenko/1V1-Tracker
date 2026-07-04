'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/app/components/Navigation'

type Hráč = {
  id: string
  name: string
}

export default function NewGame() {
  const router = useRouter()
  const [players, setHráčs] = useState<Hráč[]>([])
  const [player1Id, setHráč1Id] = useState('')
  const [player2Id, setHráč2Id] = useState('')
  const [player1Score, setHráč1Score] = useState(0)
  const [player2Score, setHráč2Score] = useState(0)
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHráčs()
  }, [])

  const fetchHráčs = async () => {
    try {
      const res = await fetch('/api/players')
      const data = await res.json()
      if (Array.isArray(data)) {
        setHráčs(data)
        if (data.length >= 2) {
          setHráč1Id(data[0].id)
          setHráč2Id(data[1].id)
        }
      } else {
        setError('Načtení hráčů se nezdařilo')
      }
    } catch (error) {
      setError('Načtení hráčů se nezdařilo')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!player1Id || !player2Id || player1Id === player2Id) {
      setError('Vyberte si dva různé hráče')
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

      if (!res.ok) throw new Error('Vytvoření zápasu se nezdařilo')

      router.push('/games')
    } catch (error) {
      setError('Uložení zápasu se nezdařilo')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-black text-sm sm:text-base">Načítání...</div>

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8">Zaznamenat nový zápas</h1>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Hráč Selection */}
          <div className="border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-black mb-4">Vybrat hráče</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Hráč 1</label>
                <select
                  value={player1Id}
                  onChange={(e) => setHráč1Id(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-black"
                >
                  <option value="">Vybrat hráče</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Hráč 2</label>
                <select
                  value={player2Id}
                  onChange={(e) => setHráč2Id(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-black"
                >
                  <option value="">Vybrat hráče</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Datum zápasu */}
          <div className="border border-gray-200 p-4 sm:p-6">
            <label className="block text-sm font-medium text-black mb-2">Datum zápasu</label>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black"
            />
          </div>

          {/* Scores */}
          {player1Id && player2Id && (
            <div className="border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-black mb-6">Zadat skóre</h2>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                <div className="flex-1 text-center">
                  <label className="block text-xs sm:text-sm font-medium text-black mb-3">
                    {players.find((p) => p.id === player1Id)?.name}
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setHráč1Score(Math.max(0, player1Score - 1))}
                      className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold transition text-sm sm:text-base"
                    >
                      −
                    </button>
                    <div className="w-16 sm:w-20 px-3 sm:px-4 py-2 sm:py-3 text-center border border-gray-300 text-2xl sm:text-3xl font-bold text-blue-600 bg-white">
                      {player1Score}
                    </div>
                    <button
                      type="button"
                      onClick={() => setHráč1Score(Math.min(5, player1Score + 1))}
                      className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold transition text-sm sm:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-light text-gray-400">vs</div>

                <div className="flex-1 text-center">
                  <label className="block text-xs sm:text-sm font-medium text-black mb-3">
                    {players.find((p) => p.id === player2Id)?.name}
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setHráč2Score(Math.max(0, player2Score - 1))}
                      className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold transition text-sm sm:text-base"
                    >
                      −
                    </button>
                    <div className="w-16 sm:w-20 px-3 sm:px-4 py-2 sm:py-3 text-center border border-gray-300 text-2xl sm:text-3xl font-bold text-blue-600 bg-white">
                      {player2Score}
                    </div>
                    <button
                      type="button"
                      onClick={() => setHráč2Score(Math.min(5, player2Score + 1))}
                      className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold transition text-sm sm:text-base"
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
            <div className="border-2 border-blue-600 p-4 sm:p-6 bg-blue-50">
              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">VÍTĚZ</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {player1Score > player2Score
                    ? players.find((p) => p.id === player1Id)?.name
                    : players.find((p) => p.id === player2Id)?.name}
                </div>
              </div>
            </div>
          )}

          {error && <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 text-sm sm:text-base">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !player1Id || !player2Id || player1Id === player2Id}
            className="w-full py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition text-sm sm:text-base"
          >
            {submitting ? 'Ukládání...' : 'Uložit zápas'}
          </button>
        </form>
      </div>
    </div>
  )
}
