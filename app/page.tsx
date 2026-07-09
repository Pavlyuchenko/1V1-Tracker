import Link from "next/link";
import Navigation from "@/app/components/Navigation";
import TableSelector from "@/app/components/TableSelector";

type Match = {
  id: string;
  player1_name: string;
  player2_name: string;
  date: string;
  player1_score: number;
  player2_score: number;
};

type HráčStats = {
  id: string;
  name: string;
  wins: number;
  losses: number;
  total: number;
  winRate: string;
  goalsFor: number;
  goalsAgainst: number;
  goalRozdíl: number;
};

type FullMatch = {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_score: number;
  player2_score: number;
  winner_id: string;
  date: string;
};

async function fetchData() {
  console.log('[fetchData] Starting...');
  try {
    console.log('[fetchData] Fetching from APIs...');
    const [matchesRes, statsRes, recentStatsRes] = await Promise.all([
      fetch('/api/games'),
      fetch('/api/stats'),
      fetch('/api/recent-stats'),
    ]);

    console.log('[fetchData] Response statuses:', {
      matches: matchesRes.status,
      stats: statsRes.status,
      recentStats: recentStatsRes.status,
    });

    const matchesData: FullMatch[] = await matchesRes.json();
    const statsData: HráčStats[] = await statsRes.json();
    const recentStatsData: HráčStats[] = await recentStatsRes.json();

    console.log('[fetchData] Parsed data lengths:', {
      matchesData: matchesData?.length || 0,
      statsData: statsData?.length || 0,
      recentStatsData: recentStatsData?.length || 0,
    });

    const playerMap = new Map(statsData.map((p) => [p.id, p.name]));

    const transformedMatches: Match[] = (matchesData || []).map((m) => ({
      id: m.id,
      player1_name: playerMap.get(m.player1_id) || "Unknown",
      player2_name: playerMap.get(m.player2_id) || "Unknown",
      date: m.date,
      player1_score: m.player1_score,
      player2_score: m.player2_score,
    }));

    const result = {
      stats: statsData || [],
      recentStats: recentStatsData || [],
      allMatches: matchesData || [],
      recentMatches: transformedMatches.slice(0, 5),
    };

    console.log('[fetchData] Final result:', {
      stats: result.stats.length,
      recentStats: result.recentStats.length,
      allMatches: result.allMatches.length,
      recentMatches: result.recentMatches.length,
    });

    return result;
  } catch (error) {
    console.error("[fetchData] Error:", error);
    return {
      stats: [],
      recentStats: [],
      allMatches: [],
      recentMatches: [],
    };
  }
}

export default async function Home() {
  const { stats, recentStats, allMatches, recentMatches } = await fetchData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TableSelector
          stats={stats}
          recentStats={recentStats}
          allMatches={allMatches}
          recentMatches={recentMatches}
        />

        {stats.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p className="mb-3">Zatím žádní hráči nebo zápasy.</p>
            <Link
              href="/settings"
              className="text-blue-600 hover:text-blue-700 font-medium inline-block"
            >
              👤 Přidat hráče →
            </Link>
          </div>
        )}

        {recentMatches.length === 0 && stats.length > 0 && (
          <div className="text-gray-600 text-center py-8">
            Zatím nejsou zaznamenány žádné zápasy.{" "}
            <Link
              href="/new-game"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Vytvoř jeden!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
