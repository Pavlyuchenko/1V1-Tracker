import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')

    if (playersError) throw playersError

    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')

    if (gamesError) throw gamesError

    const stats = (players || []).map((player: any) => {
      const playerGames = (games || []).filter(
        (game: any) => game.player1_id === player.id || game.player2_id === player.id
      )

      const wins = playerGames.filter((game: any) => game.bo5_winner_id === player.id).length
      const losses = playerGames.length - wins

      const goalStats = playerGames.reduce(
        (acc: any, game: any) => {
          const isPlayer1 = game.player1_id === player.id
          const matchesArray = game.matches || []

          const goalsFor = matchesArray.reduce((sum: number, match: any) => {
            return sum + (isPlayer1 ? match.player1_score : match.player2_score)
          }, 0)

          const goalsAgainst = matchesArray.reduce((sum: number, match: any) => {
            return sum + (isPlayer1 ? match.player2_score : match.player1_score)
          }, 0)

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
        bo5Wins: wins,
        bo5Losses: losses,
        bo5Total: playerGames.length,
        winRate: playerGames.length > 0 ? ((wins / playerGames.length) * 100).toFixed(1) : '0',
        goalsFor: goalStats.goalsFor,
        goalsAgainst: goalStats.goalsAgainst,
        goalDiff: goalStats.goalsFor - goalStats.goalsAgainst,
      }
    })

    return NextResponse.json(stats.sort((a: any, b: any) => b.bo5Wins - a.bo5Wins))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
