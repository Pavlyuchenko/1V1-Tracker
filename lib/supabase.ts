import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check your .env.local file.')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export type Player = {
  id: string
  name: string
  created_at: string
}

export type Match = {
  id: string
  player1_id: string
  player2_id: string
  player1_name?: string
  player2_name?: string
  player1_score: number
  player2_score: number
  winner_id: string
  winner_name?: string
  date: string
  created_at: string
}
