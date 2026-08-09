'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GamePlayer from '@/components/GamePlayer';
import GameCard from '@/components/GameCard';
import { GameItem } from '@/lib/games-data';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PlayGamePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [game, setGame] = useState<GameItem | null>(null);
  const [relatedGames, setRelatedGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchGame();
    }
  }, [slug]);

  const fetchGame = async () => {
    setLoading(true);
    try {
      // 1. Fetch exact game by slug or ID from PostgreSQL DB
      const res = await fetch(`/api/games/${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.game) {
          const fetchedGame = {
            ...data.game,
            tags: typeof data.game.tags === 'string' ? data.game.tags.split(',') : data.game.tags || [],
          };
          setGame(fetchedGame);

          // 2. Fetch related games
          const listRes = await fetch('/api/games');
          if (listRes.ok) {
            const listData = await listRes.json();
            const related = (listData.games || []).filter((g: GameItem) => g.slug !== slug && g.id !== fetchedGame.id);
            setRelatedGames(related.slice(0, 6));
          }

          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('Error fetching game details:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0f2fe] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-sky-800 text-xs font-bold shadow-sm hover:bg-sky-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Games</span>
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          </div>
        ) : game ? (
          <>
            {/* Main Game Player Stage */}
            <GamePlayer game={game} />

            {/* Related Games Grid */}
            {relatedGames.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-lg font-extrabold text-sky-900 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-lime-600" />
                  <span>More Games to Play</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {relatedGames.map((rel) => (
                    <GameCard key={rel.id} game={rel} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/80 p-12 rounded-2xl text-center text-slate-600 font-bold border border-sky-200 shadow-sm">
            Game not found in database.
          </div>
        )}
      </main>
    </div>
  );
}
