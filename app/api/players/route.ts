import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('players')
        .insert([{ name: name.trim() }])
        .select()

      if (error) throw error
      return NextResponse.json(data[0], { status: 201 })
    } catch (dbError: any) {
      if (dbError.code === '23505' || dbError.message?.includes('duplicate')) {
        return NextResponse.json({ error: 'Player already exists' }, { status: 400 })
      }
      if (dbError.message?.includes('Missing Supabase')) {
        return NextResponse.json(
          { error: 'Missing Supabase environment variables. Check your .env.local file.' },
          { status: 500 }
        )
      }
      throw dbError
    }
  } catch (error: any) {
    console.error('Player creation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create player' },
      { status: 500 }
    )
  }
}
