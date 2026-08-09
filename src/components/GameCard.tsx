'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Trophy, Box, ThumbsUp } from 'lucide-react';
import { GameItem } from '@/lib/games-data';

interface GameCardProps {
  game: GameItem;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/play/${game.slug}`}
      className="group flex flex-col theme-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl border transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
        {/* Game Image */}
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dynamic Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
          {game.gameType === 'THREEJS_3D' && (
            <span className="p-1.5 rounded-full bg-sky-500 text-white shadow-md flex items-center justify-center" title="Interactive 3D Game">
              <Box className="w-3.5 h-3.5" />
            </span>
          )}

          {game.isFeatured && (
            <span className="p-1.5 rounded-full bg-orange-500 text-white shadow-md flex items-center justify-center animate-pulse" title="Hot Game">
              <Flame className="w-3.5 h-3.5" />
            </span>
          )}

          {game.playsCount >= 50 && (
            <span className="p-1.5 rounded-full bg-rose-500 text-white shadow-md flex items-center justify-center" title="Top Played">
              <Trophy className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Hover Overlay Play Icon */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center font-black shadow-lg transform group-hover:scale-110 transition-transform">
            ▶
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-lime-400 text-[10px] font-extrabold flex items-center gap-1 border border-slate-700/60">
          <ThumbsUp className="w-2.5 h-2.5" />
          <span>{game.likesCount || 0}</span>
        </div>
      </div>

      {/* Title Bar */}
      <div className="p-2.5 flex-1 flex flex-col justify-between border-t theme-border">
        <h3 className="text-xs font-bold theme-text-primary group-hover:text-lime-400 truncate tracking-tight">
          {game.title}
        </h3>
        <p className="text-[10px] theme-text-secondary font-semibold mt-0.5 truncate">
          {game.category}
        </p>
      </div>
    </Link>
  );
}
