'use client';

import { useState } from 'react';

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

type SortKey = keyof HráčStats;
type SortDirection = 'asc' | 'desc';

interface RecentStatsTableProps {
  data: HráčStats[];
}

export default function RecentStatsTable({ data }: RecentStatsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('winRate');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const sortStats = (statsData: HráčStats[], key: SortKey, direction: SortDirection) => {
    return [...statsData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const numA = typeof aVal === 'string' ? parseFloat(aVal) : aVal;
      const numB = typeof bVal === 'string' ? parseFloat(bVal) : bVal;

      return direction === 'asc' ? numA - numB : numB - numA;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const getSortIndicator = (key: SortKey) => {
    if (key !== sortKey) return '';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-blue-200">
            <th className="px-3 py-2 text-left text-sm font-bold text-black">
              Pořadí
            </th>
            <th
              className="px-3 py-2 text-left text-sm font-bold text-black cursor-pointer hover:text-blue-600 overflow-hidden text-ellipsis"
              onClick={() => handleSort('name')}
            >
              Hráč{getSortIndicator('name')}
            </th>
            <th
              className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600 overflow-hidden text-ellipsis"
              onClick={() => handleSort('total')}
            >
              Zápasy{getSortIndicator('total')}
            </th>
            <th
              className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600 overflow-hidden text-ellipsis"
              onClick={() => handleSort('wins')}
            >
              Výhry{getSortIndicator('wins')}
            </th>
            <th
              className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600 overflow-hidden text-ellipsis"
              onClick={() => handleSort('losses')}
            >
              Prohry{getSortIndicator('losses')}
            </th>
            <th
              className="px-3 py-2 text-center text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700 overflow-hidden text-ellipsis"
              onClick={() => handleSort('winRate')}
            >
              Winrate{getSortIndicator('winRate')}
            </th>
            <th
              className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600 overflow-hidden text-ellipsis"
              onClick={() => handleSort('goalsFor')}
            >
              Góly{getSortIndicator('goalsFor')}
            </th>
            <th
              className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600 overflow-hidden text-ellipsis"
              onClick={() => handleSort('goalRozdíl')}
            >
              GD{getSortIndicator('goalRozdíl')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortStats(data, sortKey, sortDir).map((player, idx) => (
            <tr
              key={player.id}
              className="border-b border-gray-200 hover:bg-blue-50 transition"
            >
              <td className="px-3 py-2 font-bold text-black">
                #{idx + 1}
              </td>
              <td className="px-3 py-2 font-semibold text-black">
                {player.name}
              </td>
              <td className="px-3 py-2 text-center text-black font-medium">
                {player.total}
              </td>
              <td className="px-3 py-2 text-center font-bold text-black">
                {player.wins}
              </td>
              <td className="px-3 py-2 text-center text-black font-medium">
                {player.losses}
              </td>
              <td className="px-3 py-2 text-center font-bold text-blue-600">
                {player.winRate}%
              </td>
              <td className="px-3 py-2 text-center text-black font-medium">
                {player.goalsFor}-{player.goalsAgainst}
              </td>
              <td className="px-3 py-2 text-center text-black font-medium">
                {player.goalRozdíl > 0 ? '+' : ''}
                {player.goalRozdíl}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
