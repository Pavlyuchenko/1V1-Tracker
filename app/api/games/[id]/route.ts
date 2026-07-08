import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { player1_id, player2_id, player1_score, player2_score, date, edited_by } = await request.json()

    if (!player1_id || !player2_id || !date || player1_score === undefined || player2_score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const winner_id = player1_score > player2_score ? player1_id : player2_id

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('matches')
      .update({
        player1_id,
        player2_id,
        date,
        player1_score,
        player2_score,
        winner_id,
        edited_by,
        edited_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Zápas nebyl nalezen' }, { status: 404 })
    }

    // Enrich with player names
    const match = data[0]
    const [p1, p2, winner] = await Promise.all([
      supabase.from('players').select('name').eq('id', match.player1_id).single(),
      supabase.from('players').select('name').eq('id', match.player2_id).single(),
      supabase.from('players').select('name').eq('id', match.winner_id).single(),
    ])

    return NextResponse.json({
      ...match,
      player1_name: p1.data?.name,
      player2_name: p2.data?.name,
      winner_name: winner.data?.name,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Aktualizace zápasu se nezdařila' }, { status: 500 })
  }
}
