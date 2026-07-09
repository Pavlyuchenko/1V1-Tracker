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

type FullMatch = {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_score: number;
  player2_score: number;
  winner_id: string;
  date: string;
};

interface HeadToHeadTableProps {
  players: HráčStats[];
  allMatches: FullMatch[];
}

export default function HeadToHeadTable({ players, allMatches }: HeadToHeadTableProps) {
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>('');
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>('');

  const getHeadToHeadStats = (player1Id: string, player2Id: string) => {
    const h2hMatches = allMatches.filter(
      (match) =>
        (match.player1_id === player1Id && match.player2_id === player2Id) ||
        (match.player1_id === player2Id && match.player2_id === player1Id)
    );

    const player1Stats = {
      wins: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };

    const player2Stats = {
      wins: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };

    h2hMatches.forEach((match) => {
      const isPlayer1Home = match.player1_id === player1Id;
      const player1Score = isPlayer1Home ? match.player1_score : match.player2_score;
      const player2Score = isPlayer1Home ? match.player2_score : match.player1_score;

      player1Stats.goalsFor += player1Score;
      player1Stats.goalsAgainst += player2Score;
      player2Stats.goalsFor += player2Score;
      player2Stats.goalsAgainst += player1Score;

      if (match.winner_id === player1Id) {
        player1Stats.wins++;
        player2Stats.losses++;
      } else if (match.winner_id === player2Id) {
        player2Stats.wins++;
        player1Stats.losses++;
      }
    });

    return { player1Stats, player2Stats, totalMatches: h2hMatches.length };
  };

  return (
    <>
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-black mb-2">
            Hráč 1
          </label>
          <select
            value={selectedPlayer1}
            onChange={(e) => setSelectedPlayer1(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
          >
            <option value="">Vyberte hráče</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-black mb-2">
            Hráč 2
          </label>
          <select
            value={selectedPlayer2}
            onChange={(e) => setSelectedPlayer2(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
          >
            <option value="">Vyberte hráče</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedPlayer1 || !selectedPlayer2 ? (
        <div className="text-center py-12 text-gray-600">
          Vyberte dva hráče pro zobrazení jejich vzájemných zápasů.
        </div>
      ) : selectedPlayer1 === selectedPlayer2 ? (
        <div className="text-center py-12 text-gray-600">
          Vyberte dva různé hráče.
        </div>
      ) : (
        (() => {
          const { player1Stats, player2Stats, totalMatches } = getHeadToHeadStats(
            selectedPlayer1,
            selectedPlayer2
          );
          const player1 = players.find((p) => p.id === selectedPlayer1);
          const player2 = players.find((p) => p.id === selectedPlayer2);

          if (!player1 || !player2) return null;

          return (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-200">
                      <th className="px-3 py-2 text-left text-sm font-bold text-black">
                        Hráč
                      </th>
                      <th className="px-3 py-2 text-center text-sm font-bold text-black">
                        Zápasy
                      </th>
                      <th className="px-3 py-2 text-center text-sm font-bold text-black">
                        Výhry
                      </th>
                      <th className="px-3 py-2 text-center text-sm font-bold text-black">
                        Prohry
                      </th>
                      <th className="px-3 py-2 text-center text-sm font-bold text-black">
                        Góly
                      </th>
                      <th className="px-3 py-2 text-center text-sm font-bold text-black">
                        Rozdíl
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                      <td className="px-3 py-2 font-semibold text-black">
                        {player1.name}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player1Stats.wins + player1Stats.losses}
                      </td>
                      <td className="px-3 py-2 text-center font-bold text-black">
                        {player1Stats.wins}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player1Stats.losses}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player1Stats.goalsFor}-{player1Stats.goalsAgainst}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player1Stats.goalsFor - player1Stats.goalsAgainst > 0 ? '+' : ''}
                        {player1Stats.goalsFor - player1Stats.goalsAgainst}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                      <td className="px-3 py-2 font-semibold text-black">
                        {player2.name}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player2Stats.wins + player2Stats.losses}
                      </td>
                      <td className="px-3 py-2 text-center font-bold text-black">
                        {player2Stats.wins}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player2Stats.losses}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player2Stats.goalsFor}-{player2Stats.goalsAgainst}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player2Stats.goalsFor - player2Stats.goalsAgainst > 0 ? '+' : ''}
                        {player2Stats.goalsFor - player2Stats.goalsAgainst}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Celkem zápasů mezi sebou:{' '}
                <span className="font-semibold">{totalMatches}</span>
              </div>
            </>
          );
        })()
      )}
    </>
  );
}
