'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/app/components/Navigation'
import AuthGuard from '@/app/components/AuthGuard'
import { getAuthUser } from '@/lib/auth'

type Match = {
  id: string
  player1_id: string
  player2_id: string
  player1_name: string
  player2_name: string
  player1_score: number
  player2_score: number
  winner_name: string
  date: string
  created_by?: string
}

type Hráč = {
  id: string
  name: string
}

export default function EditGame() {
  const [matches, setMatches] = useState<Match[]>([])
  const [players, setHráčs] = useState<Hráč[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state for editing
  const [formData, setFormData] = useState({
    player1Id: '',
    player2Id: '',
    player1Score: 0,
    player2Score: 0,
    date: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [matchesRes, playersRes] = await Promise.all([fetch('/api/games'), fetch('/api/players')])

      const matchesData = await matchesRes.json()
      const playersData = await playersRes.json()

      if (Array.isArray(matchesData)) setMatches(matchesData)
      if (Array.isArray(playersData)) setHráčs(playersData)
    } catch (err) {
      setError('Načtení dat se nezdařilo')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (match: Match) => {
    setEditingId(match.id)
    setFormData({
      player1Id: match.player1_id,
      player2Id: match.player2_id,
      player1Score: match.player1_score,
      player2Score: match.player2_score,
      date: match.date,
    })
    setError('')
    setSuccess('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setError('')
  }

  const handleSaveEdit = async (matchId: string) => {
    setError('')

    if (!formData.player1Id || !formData.player2Id || formData.player1Id === formData.player2Id) {
      setError('Vyberte si dva různé hráče')
      return
    }

    try {
      const currentUser = getAuthUser()
      const res = await fetch(`/api/games/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1_id: formData.player1Id,
          player2_id: formData.player2Id,
          player1_score: formData.player1Score,
          player2_score: formData.player2Score,
          date: formData.date,
          edited_by: currentUser,
        }),
      })

      if (!res.ok) throw new Error('Uložení změn se nezdařilo')

      const updated = await res.json()
      setMatches(matches.map((m) => (m.id === matchId ? { ...m, ...updated } : m)))
      setEditingId(null)
      setSuccess('Zápas aktualizován!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Uložení změn se nezdařilo')
    }
  }

  const editContent = (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8">Upravit zápasy</h1>

        {loading ? (
          <div className="text-gray-600">Načítání...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 text-gray-600">Zatím nejsou žádné zápasy k úpravě.</div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border border-gray-200 p-4 sm:p-6">
                {editingId === match.id ? (
                  // Edit Form
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveEdit(match.id)
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Player 1 */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Hráč 1</label>
                        <select
                          value={formData.player1Id}
                          onChange={(e) => setFormData({ ...formData, player1Id: e.target.value })}
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

                      {/* Player 2 */}
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Hráč 2</label>
                        <select
                          value={formData.player2Id}
                          onChange={(e) => setFormData({ ...formData, player2Id: e.target.value })}
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

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Datum zápasu</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 text-black"
                      />
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Skóre {players.find((p) => p.id === formData.player1Id)?.name}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={formData.player1Score}
                          onChange={(e) => setFormData({ ...formData, player1Score: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Skóre {players.find((p) => p.id === formData.player2Id)?.name}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={formData.player2Score}
                          onChange={(e) => setFormData({ ...formData, player2Score: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 text-black"
                        />
                      </div>
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        Uložit
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold"
                      >
                        Zrušit
                      </button>
                    </div>
                  </form>
                ) : (
                  // Display Mode
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          {new Date(match.date).toLocaleDateString('cs-CZ', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        {match.created_by && <div className="text-xs text-gray-400">Vytvořeno: {match.created_by}</div>}
                      </div>

                      <div className="flex-1 flex items-center justify-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-black">{match.player1_name}</div>
                          <div className="text-2xl font-black text-blue-600">{match.player1_score}</div>
                        </div>
                        <div className="text-gray-400 text-lg font-light">-</div>
                        <div className="text-left">
                          <div className="font-bold text-black">{match.player2_name}</div>
                          <div className="text-2xl font-black text-blue-600">{match.player2_score}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => startEdit(match)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm"
                      >
                        Upravit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {success && <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700">{success}</div>}
      </div>
    </div>
  )

  return <AuthGuard>{editContent}</AuthGuard>
}
