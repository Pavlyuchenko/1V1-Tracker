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

export default function Home() {
  const [matches, setZápasy] = useState<Match[]>([]);
  const [stats, setStats] = useState<HráčStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchesRes, statsRes] = await Promise.all([
        fetch("/api/games"),
        fetch("/api/stats"),
      ]);

      const matchesData = await matchesRes.json();
      const statsData = await statsRes.json();

      if (Array.isArray(matchesData)) {
        setZápasy(matchesData.slice(0, 5));
      }
      if (Array.isArray(statsData)) {
        setStats(statsData);
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
        <div className="mb-12 bg-white shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Tabulka</h2>

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
                    <th className="px-3 py-2 text-left text-sm font-bold text-black">
                      Hráč
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-blue-600">
                      Výhry
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-black">
                      Prohry
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-black">
                      Winrate
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-black">
                      Góly
                    </th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-black">
                      GD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((player, idx) => (
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
                      <td className="px-3 py-2 text-center font-bold text-blue-600">
                        {player.wins}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player.losses}
                      </td>
                      <td className="px-3 py-2 text-center text-black font-medium">
                        {player.winRate} %
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
