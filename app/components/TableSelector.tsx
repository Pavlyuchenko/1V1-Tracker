'use client';

import { useState } from 'react';
import StatsTable from './StatsTable';
import RecentStatsTable from './RecentStatsTable';
import HeadToHeadTable from './HeadToHeadTable';
import MatchCard from './MatchCard';

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

type Match = {
  id: string;
  player1_name: string;
  player2_name: string;
  date: string;
  player1_score: number;
  player2_score: number;
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

interface TableSelectorProps {
  stats: HráčStats[];
  recentStats: HráčStats[];
  allMatches: FullMatch[];
  recentMatches: Match[];
}

export default function TableSelector({
  stats,
  recentStats,
  allMatches,
  recentMatches,
}: TableSelectorProps) {
  const [selectedTable, setSelectedTable] = useState<'tabulka' | 'forma' | 'h2h'>('tabulka');

  return (
    <>
      {/* Tabulka Section */}
      {selectedTable === 'tabulka' && (
        <div className="mb-12 bg-white shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-black">Tabulka</h2>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value as 'tabulka' | 'forma' | 'h2h')}
              className="px-3 py-2 border border-gray-300 rounded text-black text-sm w-full md:w-auto"
            >
              <option value="tabulka">Tabulka (Celkové pořadí)</option>
              <option value="forma">Forma (Posledních 5 zápasů)</option>
              <option value="h2h">Vzájemné zápasy</option>
            </select>
          </div>

          {stats.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p className="mb-3">Zatím žádní hráči nebo zápasy.</p>
            </div>
          ) : (
            <StatsTable data={stats} />
          )}
        </div>
      )}

      {/* Recent Form Section */}
      {selectedTable === 'forma' && (
        <div className="mb-12 bg-white shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-black">
              Forma (Posledních 5 zápasů)
            </h2>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value as 'tabulka' | 'forma' | 'h2h')}
              className="px-3 py-2 border border-gray-300 rounded text-black text-sm w-full md:w-auto"
            >
              <option value="tabulka">Tabulka (Celkové pořadí)</option>
              <option value="forma">Forma (Posledních 5 zápasů)</option>
              <option value="h2h">Vzájemné zápasy</option>
            </select>
          </div>

          {recentStats.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>Zatím žádné nedávné zápasy.</p>
            </div>
          ) : (
            <RecentStatsTable data={recentStats} />
          )}
        </div>
      )}

      {/* Head to Head Section */}
      {selectedTable === 'h2h' && (
        <div className="mb-12 bg-white shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-black">Vzájemné zápasy</h2>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value as 'tabulka' | 'forma' | 'h2h')}
              className="px-3 py-2 border border-gray-300 rounded text-black text-sm w-full md:w-auto"
            >
              <option value="tabulka">Tabulka (Celkové pořadí)</option>
              <option value="forma">Forma (Posledních 5 zápasů)</option>
              <option value="h2h">Vzájemné zápasy</option>
            </select>
          </div>

          <HeadToHeadTable players={stats} allMatches={allMatches} />
        </div>
      )}
    </>
  );
}
