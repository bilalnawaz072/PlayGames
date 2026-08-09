'use client';

import React, { useState } from 'react';
import { GameItem, INITIAL_GAMES } from '@/lib/games-data';
import { Grid2X2, LayoutList, Gamepad2, Plus, X, Maximize2 } from 'lucide-react';
import Three3DGames from './Three3DGames';
import { cleanEmbedUrl } from '@/lib/url-cleaner';

interface MultiScreenPlayerProps {
  initialGameSlug?: string;
}

export default function MultiScreenPlayer({ initialGameSlug }: MultiScreenPlayerProps) {
  const [layoutMode, setLayoutMode] = useState<'dual' | 'quad'>('dual');
  const [selectedGames, setSelectedGames] = useState<Array<GameItem | null>>(() => {
    const found = INITIAL_GAMES.find((g) => g.slug === initialGameSlug) || INITIAL_GAMES[0];
    const second = INITIAL_GAMES.find((g) => g.slug === 'cyber-drift-3d') || INITIAL_GAMES[1];
    return [found, second, null, null];
  });

  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);

  const handleSelectGameForSlot = (game: GameItem) => {
    if (activeSlotModal === null) return;
    const next = [...selectedGames];
    next[activeSlotModal] = game;
    setSelectedGames(next);
    setActiveSlotModal(null);
  };

  const removeGameFromSlot = (index: number) => {
    const next = [...selectedGames];
    next[index] = null;
    setSelectedGames(next);
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Header Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-lime-500 text-slate-950 font-black">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">Multi-Screen Gaming Mode</h1>
            <p className="text-xs text-sky-400 font-medium">Play 2 or 4 games side-by-side on one screen!</p>
          </div>
        </div>

        {/* Layout Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setLayoutMode('dual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              layoutMode === 'dual'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span>Dual Play (2)</span>
          </button>
          <button
            onClick={() => setLayoutMode('quad')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              layoutMode === 'quad'
                ? 'bg-lime-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid2X2 className="w-4 h-4" />
            <span>Quad Play (4)</span>
          </button>
        </div>
      </div>

      {/* Multi-Screen Grid Display */}
      <div
        className={`grid gap-4 w-full ${
          layoutMode === 'dual' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {(layoutMode === 'dual' ? [0, 1] : [0, 1, 2, 3]).map((slotIndex) => {
          const game = selectedGames[slotIndex];

          return (
            <div
              key={slotIndex}
              className="relative w-full h-[400px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-center items-center"
            >
              {game ? (
                <div className="relative w-full h-full flex flex-col">
                  {/* Slot Bar */}
                  <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs z-10">
                    <span className="font-extrabold text-lime-400 truncate max-w-[200px]">
                      #{slotIndex + 1}: {game.title}
                    </span>
                    <button
                      onClick={() => removeGameFromSlot(slotIndex)}
                      className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                      title="Close game slot"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Game Viewport */}
                  <div className="relative flex-1 w-full h-full bg-black overflow-hidden">
                    {game.gameType === 'THREEJS_3D' && game.threeEngineId ? (
                      <Three3DGames
                        engineId={game.threeEngineId as any}
                        gameTitle={game.title}
                      />
                    ) : (
                      <iframe
                        src={cleanEmbedUrl(game.embedUrl)}
                        title={game.title}
                        className="absolute inset-0 w-full h-full border-0 block"
                        style={{
                          width: '100%',
                          height: '100%',
                          minWidth: '100%',
                          minHeight: '100%',
                          border: 'none',
                          outline: 'none',
                          display: 'block',
                          margin: 0,
                          padding: 0,
                          touchAction: 'manipulation',
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; microphone; camera"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* Empty Slot Button */
                <button
                  onClick={() => setActiveSlotModal(slotIndex)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-lime-500 hover:bg-slate-900/40 text-slate-400 hover:text-lime-400 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-sm">ADD GAME TO SLOT #{slotIndex + 1}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Game Selector Modal for Empty Slot */}
      {activeSlotModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col max-h-[80vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">Select Game for Slot #{activeSlotModal + 1}</h3>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Game Grid */}
            <div className="flex-1 overflow-y-auto py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INITIAL_GAMES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSelectGameForSlot(g)}
                  className="flex flex-col bg-slate-950 border border-slate-800 hover:border-lime-500 rounded-xl overflow-hidden text-left p-2 transition-all hover:scale-105 group"
                >
                  <img src={g.thumbnailUrl} alt={g.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                  <span className="font-bold text-xs text-white truncate group-hover:text-lime-400">{g.title}</span>
                  <span className="text-[10px] text-sky-400">{g.category}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
