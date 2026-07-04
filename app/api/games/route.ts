import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false })

    const enrichedZápasy = await Promise.all(
      matches?.map(async (match: any) => {
        const [p1, p2, winner] = await Promise.all([
          supabase.from('players').select('name').eq('id', match.player1_id).single(),
          supabase.from('players').select('name').eq('id', match.player2_id).single(),
          supabase.from('players').select('name').eq('id', match.winner_id).single(),
        ])
        return {
          ...match,
          player1_name: p1.data?.name,
          player2_name: p2.data?.name,
          winner_name: winner.data?.name,
        }
      }) || []
    )

    return NextResponse.json(enrichedZápasy)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { player1_id, player2_id, date, player1_score, player2_score } = await request.json()

    if (!player1_id || !player2_id || !date || player1_score === undefined || player2_score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const winner_id = player1_score > player2_score ? player1_id : player2_id

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('matches')
      .insert([
        {
          player1_id,
          player2_id,
          date,
          player1_score,
          player2_score,
          winner_id,
        },
      ])
      .select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Vytvoření zápasu se nezdařilo' }, { status: 500 })
  }
}
