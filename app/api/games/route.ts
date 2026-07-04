import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data: gamesWithBoth } = await supabase
      .from('games')
      .select(`
        id,
        player1_id,
        player2_id,
        date,
        bo5_winner_id,
        matches,
        created_at
      `)
      .order('date', { ascending: false })

    const enrichedGames = await Promise.all(
      gamesWithBoth?.map(async (game: any) => {
        const [p1, p2, winner] = await Promise.all([
          supabase.from('players').select('name').eq('id', game.player1_id).single(),
          supabase.from('players').select('name').eq('id', game.player2_id).single(),
          supabase.from('players').select('name').eq('id', game.bo5_winner_id).single(),
        ])
        return {
          ...game,
          player1_name: p1.data?.name,
          player2_name: p2.data?.name,
          bo5_winner_name: winner.data?.name,
        }
      }) || []
    )

    return NextResponse.json(enrichedGames)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { player1_id, player2_id, date, bo5_winner_id, matches } = await request.json()

    if (!player1_id || !player2_id || !date || !bo5_winner_id || !matches) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          player1_id,
          player2_id,
          date,
          bo5_winner_id,
          matches,
        },
      ])
      .select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
  }
}
