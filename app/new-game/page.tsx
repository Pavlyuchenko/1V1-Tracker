'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Player = {
  id: string
  name: string
}

type GameInput = {
  winner_id: string
  loser_goals: number
}

export default function NewGame() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0])
  const [gameCount, setGameCount] = useState<number | null>(null)
  const [games, setGames] = useState<GameInput[]>([])
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

  const handleGameCountChange = (count: number) => {
    setGameCount(count)
    setGames(Array(count).fill(null).map(() => ({ winner_id: '', loser_goals: 0 })))
  }

  const handleGameChange = (idx: number, winnerId: string, loserGoals: number) => {
    const newGames = [...games]
    newGames[idx] = { winner_id: winnerId, loser_goals: loserGoals }
    setGames(newGames)
  }

  const getBO5Winner = () => {
    const player1Wins = games.filter((g) => g.winner_id === player1Id).length
    const player2Wins = games.filter((g) => g.winner_id === player2Id).length

    if (player1Wins > player2Wins) return player1Id
    if (player2Wins > player1Wins) return player2Id
    return null
  }

  const convertToMatches = () => {
    return games.map((g) => {
      if (g.winner_id === player1Id) {
        return { player1_score: 5, player2_score: g.loser_goals }
      } else {
        return { player1_score: g.loser_goals, player2_score: 5 }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!player1Id || !player2Id || player1Id === player2Id) {
      setError('Please select two different players')
      return
    }

    if (gameCount === null || games.length === 0) {
      setError('Please select number of games')
      return
    }

    if (games.some((g) => !g.winner_id)) {
      setError('Please select a winner for each game')
      return
    }

    const bo5Winner = getBO5Winner()
    if (!bo5Winner) {
      setError('BO5 winner could not be determined')
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
          date: gameDate,
          bo5_winner_id: bo5Winner,
          matches: convertToMatches(),
        }),
      })

      if (!res.ok) throw new Error('Failed to create game')

      router.push('/games')
    } catch (error) {
      setError('Failed to save game')
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
        <h1 className="text-3xl font-bold text-black mb-8">Record New Game</h1>

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

          {/* Game Date */}
          <div className="border border-gray-200 rounded-lg p-6">
            <label className="block text-sm font-medium text-black mb-2">Game Date</label>
            <input
              type="date"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>

          {/* Game Count Selection */}
          {player1Id && player2Id && (
            <div className="border border-gray-200 rounded-lg p-6">
              <label className="block text-sm font-medium text-black mb-4">How many games played?</label>
              <div className="grid grid-cols-3 gap-3">
                {[3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handleGameCountChange(count)}
                    className={`py-3 px-3 rounded-lg font-semibold text-lg transition ${
                      gameCount === count
                        ? 'bg-blue-600 text-white border-2 border-blue-600'
                        : 'border-2 border-gray-300 text-black hover:border-blue-600'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Game Results */}
          {gameCount && games.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-black mb-6">Enter Game Results</h2>
              <div className="space-y-4">
                {games.map((game, idx) => {
                  const p1Name = players.find((p) => p.id === player1Id)?.name || 'Player 1'
                  const p2Name = players.find((p) => p.id === player2Id)?.name || 'Player 2'

                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-3">Game {idx + 1}: Who won?</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleGameChange(idx, player1Id, game.loser_goals)}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                              game.winner_id === player1Id
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 text-black hover:border-blue-600'
                            }`}
                          >
                            {p1Name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleGameChange(idx, player2Id, game.loser_goals)}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                              game.winner_id === player2Id
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 text-black hover:border-blue-600'
                            }`}
                          >
                            {p2Name}
                          </button>
                        </div>
                      </div>

                      {game.winner_id && (
                        <div>
                          <label className="block text-sm font-medium text-black mb-3">
                            How many goals did the loser score?
                          </label>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3, 4].map((goals) => (
                              <button
                                key={goals}
                                type="button"
                                onClick={() => handleGameChange(idx, game.winner_id, goals)}
                                className={`flex-1 py-2 rounded-lg font-bold transition ${
                                  game.loser_goals === goals
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 text-black hover:border-blue-600'
                                }`}
                              >
                                {goals}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          {gameCount && games.every((g) => g.winner_id) && (
            <div className="border-2 border-blue-600 rounded-lg p-6 bg-blue-50">
              <h2 className="font-bold text-black mb-4">Summary</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">{players.find((p) => p.id === player1Id)?.name}</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {games.filter((g) => g.winner_id === player1Id).length}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-600">{players.find((p) => p.id === player2Id)?.name}</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {games.filter((g) => g.winner_id === player2Id).length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || gameCount === null || games.some((g) => !g.winner_id)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
          >
            {submitting ? 'Saving...' : 'Save Game'}
          </button>
        </form>
      </div>
    </div>
  )
}
