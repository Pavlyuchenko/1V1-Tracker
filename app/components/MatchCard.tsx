type Match = {
  id: string
  player1_name: string
  player2_name: string
  date: string
  player1_score: number
  player2_score: number
  created_by?: string
}

export default function MatchCard({ match }: { match: Match }) {
  return (
    <div className="border border-gray-200  p-5 hover:bg-blue-50 transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Date & Creator */}
        <div className="min-w-fit">
          <div className="text-sm text-gray-500">
            {new Date(match.date).toLocaleDateString('cs-CZ', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
          {match.created_by && <div className="text-xs text-gray-400 mt-1">({match.created_by})</div>}
        </div>

        {/* Match Result - Main Focus */}
        <div className="flex-1 flex items-center justify-center gap-4 min-w-0">
          <div className="text-right">
            <div className="font-bold text-black text-lg truncate">{match.player1_name}</div>
            <div className="text-3xl font-black text-blue-600 leading-none">{match.player1_score}</div>
          </div>

          <div className="text-gray-400 text-2xl font-light flex-shrink-0">-</div>

          <div className="text-left">
            <div className="font-bold text-black text-lg truncate">{match.player2_name}</div>
            <div className="text-3xl font-black text-blue-600 leading-none">{match.player2_score}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
