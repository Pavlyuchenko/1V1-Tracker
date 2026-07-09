"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navigation from "@/app/components/Navigation";
import MatchCard from "@/app/components/MatchCard";

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

type SortKey = keyof HráčStats;
type SortDirection = "asc" | "desc";

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
  const [matches, setZápasy] = useState<Match[]>([]);
  const [allMatches, setAllMatches] = useState<FullMatch[]>([]);
  const [stats, setStats] = useState<HráčStats[]>([]);
  const [recentStats, setRecentStats] = useState<HráčStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("winRate");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [recentSortKey, setRecentSortKey] = useState<SortKey>("winRate");
  const [recentSortDir, setRecentSortDir] = useState<SortDirection>("desc");
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>("");
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<"tabulka" | "forma" | "h2h">("tabulka");

  useEffect(() => {
    fetchData();
  }, []);

  const sortStats = (
    data: HráčStats[],
    key: SortKey,
    direction: SortDirection,
  ) => {
    return [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const numA = typeof aVal === "string" ? parseFloat(aVal) : aVal;
      const numB = typeof bVal === "string" ? parseFloat(bVal) : bVal;

      return direction === "asc" ? numA - numB : numB - numA;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleRecentSort = (key: SortKey) => {
    if (recentSortKey === key) {
      setRecentSortDir(recentSortDir === "asc" ? "desc" : "asc");
    } else {
      setRecentSortKey(key);
      setRecentSortDir("desc");
    }
  };

  const getSortIndicator = (
    key: SortKey,
    currentKey: SortKey,
    direction: SortDirection,
  ) => {
    if (key !== currentKey) return "";
    return direction === "asc" ? " ↑" : " ↓";
  };

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

  const fetchData = async () => {
    try {
      const [matchesRes, statsRes, recentStatsRes] = await Promise.all([
        fetch("/api/games"),
        fetch("/api/stats"),
        fetch("/api/recent-stats"),
      ]);

      const matchesData = await matchesRes.json();
      const statsData = await statsRes.json();
      const recentStatsData = await recentStatsRes.json();

      if (Array.isArray(matchesData)) {
        setZápasy(matchesData.slice(0, 5));
        setAllMatches(matchesData);
      }
      if (Array.isArray(statsData)) {
        setStats(statsData);
      }
      if (Array.isArray(recentStatsData)) {
        setRecentStats(recentStatsData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabulka Section */}
        {selectedTable === "tabulka" && (
        <div className="mb-12 bg-white shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-black">Tabulka</h2>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value as "tabulka" | "forma" | "h2h")}
              className="px-3 py-2 border border-gray-300 rounded text-black text-sm w-full md:w-auto"
            >
              <option value="tabulka">Tabulka (Celkové pořadí)</option>
              <option value="forma">Forma (Posledních 5 zápasů)</option>
              <option value="h2h">Vzájemné zápasy</option>
            </select>
          </div>

          {loading ? (
            <div className="text-gray-600">Načítání...</div>
          ) : stats.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p className="mb-3">Zatím žádní hráči nebo zápasy.</p>
              <Link
                href="/settings"
                className="text-blue-600 hover:text-blue-700 font-medium inline-block"
              >
                👤 Přidat hráče →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="px-3 py-2 text-left text-sm font-bold text-black">
                      Pořadí
                    </th>
                    <th
                      className="px-3 py-2 text-left text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleSort("name")}
                    >
                      Hráč{getSortIndicator("name", sortKey, sortDir)}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleSort("wins")}
                    >
                      Výhry{getSortIndicator("wins", sortKey, sortDir)}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleSort("losses")}
                    >
                      Prohry{getSortIndicator("losses", sortKey, sortDir)}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700"
                      onClick={() => handleSort("winRate")}
                    >
                      Winrate{getSortIndicator("winRate", sortKey, sortDir)}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleSort("goalsFor")}
                    >
                      Góly{getSortIndicator("goalsFor", sortKey, sortDir)}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleSort("goalRozdíl")}
                    >
                      GD{getSortIndicator("goalRozdíl", sortKey, sortDir)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortStats(stats, sortKey, sortDir).map((player, idx) => (
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
                        {player.goalRozdíl > 0 ? "+" : ""}
                        {player.goalRozdíl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Recent Form Section */}
        {selectedTable === "forma" && (
        <div className="mb-12 bg-white shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-black">
              Forma (Posledních 5 zápasů)
            </h2>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value as "tabulka" | "forma" | "h2h")}
              className="px-3 py-2 border border-gray-300 rounded text-black text-sm w-full md:w-auto"
            >
              <option value="tabulka">Tabulka (Celkové pořadí)</option>
              <option value="forma">Forma (Posledních 5 zápasů)</option>
              <option value="h2h">Vzájemné zápasy</option>
            </select>
          </div>

          {loading ? (
            <div className="text-gray-600">Načítání...</div>
          ) : recentStats.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>Zatím žádné nedávné zápasy.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="px-3 py-2 text-left text-sm font-bold text-black">
                      Pořadí
                    </th>
                    <th
                      className="px-3 py-2 text-left text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleRecentSort("name")}
                    >
                      Hráč
                      {getSortIndicator("name", recentSortKey, recentSortDir)}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleRecentSort("wins")}
                    >
                      Výhry
                      {getSortIndicator("wins", recentSortKey, recentSortDir)}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleRecentSort("losses")}
                    >
                      Prohry
                      {getSortIndicator("losses", recentSortKey, recentSortDir)}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700"
                      onClick={() => handleRecentSort("winRate")}
                    >
                      Winrate
                      {getSortIndicator(
                        "winRate",
                        recentSortKey,
                        recentSortDir,
                      )}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleRecentSort("goalsFor")}
                    >
                      Góly
                      {getSortIndicator(
                        "goalsFor",
                        recentSortKey,
                        recentSortDir,
                      )}
                    </th>
                    <th
                      className="px-3 py-2 text-center text-sm font-bold text-black cursor-pointer hover:text-blue-600"
                      onClick={() => handleRecentSort("goalRozdíl")}
                    >
                      GD
                      {getSortIndicator(
                        "goalRozdíl",
                        recentSortKey,
                        recentSortDir,
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortStats(recentStats, recentSortKey, recentSortDir).map(
                    (player, idx) => (
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
                          {player.goalRozdíl > 0 ? "+" : ""}
                          {player.goalRozdíl}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Head to Head Section */}
        {selectedTable === "h2h" && (
        <div className="mb-12 bg-white shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-black">Vzájemné zápasy</h2>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value as "tabulka" | "forma" | "h2h")}
              className="px-3 py-2 border border-gray-300 rounded text-black text-sm w-full md:w-auto"
            >
              <option value="tabulka">Tabulka (Celkové pořadí)</option>
              <option value="forma">Forma (Posledních 5 zápasů)</option>
              <option value="h2h">Vzájemné zápasy</option>
            </select>
          </div>

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
                {stats.map((player) => (
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
                {stats.map((player) => (
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
              const player1 = stats.find((p) => p.id === selectedPlayer1);
              const player2 = stats.find((p) => p.id === selectedPlayer2);

              if (!player1 || !player2) return null;

              return (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-blue-200">
                        <th className="px-3 py-2 text-left text-sm font-bold text-black">
                          Hráč
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
                        <td className="px-3 py-2 text-center font-bold text-blue-600">
                          {player1Stats.wins}
                        </td>
                        <td className="px-3 py-2 text-center text-black font-medium">
                          {player1Stats.losses}
                        </td>
                        <td className="px-3 py-2 text-center text-black font-medium">
                          {player1Stats.goalsFor}-{player1Stats.goalsAgainst}
                        </td>
                        <td className="px-3 py-2 text-center text-black font-medium">
                          {player1Stats.goalsFor - player1Stats.goalsAgainst > 0 ? "+" : ""}
                          {player1Stats.goalsFor - player1Stats.goalsAgainst}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                        <td className="px-3 py-2 font-semibold text-black">
                          {player2.name}
                        </td>
                        <td className="px-3 py-2 text-center font-bold text-blue-600">
                          {player2Stats.wins}
                        </td>
                        <td className="px-3 py-2 text-center text-black font-medium">
                          {player2Stats.losses}
                        </td>
                        <td className="px-3 py-2 text-center text-black font-medium">
                          {player2Stats.goalsFor}-{player2Stats.goalsAgainst}
                        </td>
                        <td className="px-3 py-2 text-center text-black font-medium">
                          {player2Stats.goalsFor - player2Stats.goalsAgainst > 0 ? "+" : ""}
                          {player2Stats.goalsFor - player2Stats.goalsAgainst}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-4 text-sm text-gray-600">
                    Celkem zápasů mezi sebou: <span className="font-semibold">{totalMatches}</span>
                  </div>
                </div>
              );
            })()
          )}
        </div>
        )}

        {/* Poslední zápasy Section */}
        <div className="bg-white shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-black mb-6">
            Poslední zápasy
          </h2>

          {loading ? (
            <div className="text-gray-600">Načítání...</div>
          ) : matches.length === 0 ? (
            <div className="text-gray-600 text-center py-8">
              Zatím nejsou zaznamenány žádné zápasy.{" "}
              <Link
                href="/new-game"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Vytvoř jeden!
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}

              <Link
                href="/games"
                className="inline-block mt-6 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Zobrazit všechny zápasy →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
