'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GameCard from '@/components/GameCard';
import { GameItem } from '@/lib/games-data';
import { Sparkles, Box, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'title'>('popular');

  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, [sortBy, searchQuery]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      let url = `/api/games?sort=${sortBy}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setGames(data.games || []);
      }
    } catch (e) {
      console.error('Error loading games from database:', e);
    } finally {
      setLoading(false);
    }
  };

  const hero3DGames = games.filter((g) => g.gameType === 'THREEJS_3D' || g.isFeatured).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      
      {/* Sleek Top Navbar with Integrated Search, Sort & Theme Controls */}
      <Navbar
        onSearchChange={(q) => setSearchQuery(q)}
        onSortChange={(sort) => setSortBy(sort)}
      />

      {/* Main Home Content Container */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Featured 3D Highlights (If Any) */}
        {hero3DGames.length > 0 && !searchQuery && (
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-extrabold flex items-center gap-2 theme-text-primary">
              <Box className="w-5 h-5 theme-accent" />
              <span>Featured 3D Games & Highlights</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {hero3DGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* MAIN GAMES CATALOG GRID */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold flex items-center gap-2 theme-text-primary">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>
                All Games Library ({games.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
            </div>
          ) : games.length === 0 ? (
            <div className="theme-card p-12 rounded-2xl text-center border shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center mx-auto border border-lime-500/30">
                <Box className="w-6 h-6" />
              </div>
              <p className="text-lg font-extrabold theme-text-primary">No games currently added.</p>
              <p className="text-xs theme-text-secondary max-w-md mx-auto">
                Clean platform ready for actual games. Sign in as Admin to publish or duplicate real 3D / HTML5 games!
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs shadow-lg transition-all"
              >
                <span>Go to Admin Portal</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
