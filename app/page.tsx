'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navigation from '@/app/components/Navigation';
import TableSelector from '@/app/components/TableSelector';
import MatchCard from '@/app/components/MatchCard';

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

export default function Home() {
  const [stats, setStats] = useState<HráčStats[]>([]);
  const [recentStats, setRecentStats] = useState<HráčStats[]>([]);
  const [allMatches, setAllMatches] = useState<FullMatch[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchesRes, statsRes, recentStatsRes] = await Promise.all([
        fetch('/api/games'),
        fetch('/api/stats'),
        fetch('/api/recent-stats'),
      ]);

      const matchesData: FullMatch[] = await matchesRes.json();
      const statsData: HráčStats[] = await statsRes.json();
      const recentStatsData: HráčStats[] = await recentStatsRes.json();

      setStats(statsData || []);
      setRecentStats(recentStatsData || []);
      setAllMatches(matchesData || []);

      const playerMap = new Map(statsData.map((p) => [p.id, p.name]));
      const transformed: Match[] = (matchesData || []).map((m) => ({
        id: m.id,
        player1_name: playerMap.get(m.player1_id) || 'Unknown',
        player2_name: playerMap.get(m.player2_id) || 'Unknown',
        date: m.date,
        player1_score: m.player1_score,
        player2_score: m.player2_score,
      }));

      setRecentMatches(transformed.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Načítání...</div>
        ) : (
          <>
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
                Zatím nejsou zaznamenány žádné zápasy.{' '}
                <Link
                  href="/new-game"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Vytvoř jeden!
                </Link>
              </div>
            )}

            {recentMatches.length > 0 && (
              <div className="bg-white shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-black mb-6">
                  Poslední zápasy
                </h2>
                <div className="space-y-3">
                  {recentMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                  <Link
                    href="/games"
                    className="inline-block mt-6 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Zobrazit všechny zápasy →
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
