import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')

    if (playersError) throw playersError

    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')

    if (matchesError) throw matchesError

    const stats = (players || []).map((player: any) => {
      const playerMatches = (matches || []).filter(
        (match: any) => match.player1_id === player.id || match.player2_id === player.id
      )

      const wins = playerMatches.filter((match: any) => match.winner_id === player.id).length
      const losses = playerMatches.length - wins

      const goalStats = playerMatches.reduce(
        (acc: any, match: any) => {
          const isPlayer1 = match.player1_id === player.id
          const goalsFor = isPlayer1 ? match.player1_score : match.player2_score
          const goalsAgainst = isPlayer1 ? match.player2_score : match.player1_score

          return {
            goalsFor: acc.goalsFor + goalsFor,
            goalsAgainst: acc.goalsAgainst + goalsAgainst,
          }
        },
        { goalsFor: 0, goalsAgainst: 0 }
      )

      return {
        id: player.id,
        name: player.name,
        wins,
        losses,
        total: playerMatches.length,
        winRate: playerMatches.length > 0 ? ((wins / playerMatches.length) * 100).toFixed(1) : '0',
        goalsFor: goalStats.goalsFor,
        goalsAgainst: goalStats.goalsAgainst,
        goalDiff: goalStats.goalsFor - goalStats.goalsAgainst,
      }
    })

    return NextResponse.json(stats.sort((a: any, b: any) => b.wins - a.wins))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
