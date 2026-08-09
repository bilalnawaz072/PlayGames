'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, ThumbsUp, ThumbsDown, Share2, Heart, Maximize2, Layers, Check, Smartphone, Monitor, ShieldAlert } from 'lucide-react';
import { GameItem } from '@/lib/games-data';
import { cleanEmbedUrl } from '@/lib/url-cleaner';
import Three3DGames from './Three3DGames';
import { useDataUpdate } from './DataUpdateContext';

interface GamePlayerProps {
  game: GameItem;
}

export default function GamePlayer({ game }: GamePlayerProps) {
  const { triggerUpdate } = useDataUpdate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(game.likesCount || 0);
  const [dislikes, setDislikes] = useState(game.dislikesCount || 0);
  const [hasRated, setHasRated] = useState<'LIKE' | 'DISLIKE' | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Automatic Gap Adjustment Scale State
  const [autoScaleFactor, setAutoScaleFactor] = useState<number>(1.12);
  const [autoGapFix, setAutoGapFix] = useState<boolean>(true);

  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLikes(game.likesCount || 0);
    setDislikes(game.dislikesCount || 0);
    
    try {
      const savedRate = localStorage.getItem(`gamevault_rated_${game.id}`);
      if (savedRate === 'LIKE' || savedRate === 'DISLIKE') {
        setHasRated(savedRate);
      } else {
        setHasRated(null);
      }
    } catch (e) {}
  }, [game.id, game.likesCount, game.dislikesCount]);

  const handlePlayClick = () => {
    setIsPlaying(true);
    fetch(`/api/games/${game.id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'PLAY' }),
    }).catch(() => {});
  };

  const handleRate = async (type: 'LIKE' | 'DISLIKE') => {
    if (hasRated === type) return;

    if (type === 'LIKE') {
      setLikes((prev) => prev + 1);
      if (hasRated === 'DISLIKE') setDislikes((prev) => Math.max(0, prev - 1));
    } else {
      setDislikes((prev) => prev + 1);
      if (hasRated === 'LIKE') setLikes((prev) => Math.max(0, prev - 1));
    }
    setHasRated(type);

    await triggerUpdate(
      async () => {
        localStorage.setItem(`gamevault_rated_${game.id}`, type);
        await fetch(`/api/games/${game.id}/rate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type }),
        });
      },
      `Saving game ${type === 'LIKE' ? 'upvote' : 'downvote'}...`,
      `Thank you! Game rating updated.`
    ).catch(() => {});
  };

  // Cross-device Mobile & Desktop Native Fullscreen Handler
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    const elem = playerContainerRef.current as any;

    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement && !(document as any).msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const directEmbedUrl = cleanEmbedUrl(game.embedUrl);

  return (
    <div className="w-full space-y-4">
      
      {/* Automatic Gap-Adjustment & Fullscreen Stage Controls */}
      <div className="theme-card px-4 py-2 rounded-xl border flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold theme-text-primary">
          <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
          <span>AUTOMATIC ZERO-GAP STAGE:</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-lime-500/20 text-lime-400 font-extrabold border border-lime-500/30">
            {autoGapFix ? 'AUTO GAP-FIX ACTIVE (100% AREA)' : 'STANDARD'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoGapFix(!autoGapFix)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              autoGapFix ? 'bg-lime-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {autoGapFix ? '⚡ AUTO GAP ADJUST: ON' : 'AUTO GAP ADJUST: OFF'}
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
            title="Play in 100% Mobile & Desktop Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>FULLSCREEN PLAY</span>
          </button>
        </div>
      </div>

      {/* Game Stage Player Container */}
      <div
        ref={playerContainerRef}
        className="relative w-full h-[65vh] min-h-[380px] sm:min-h-[500px] max-h-[750px] rounded-2xl overflow-hidden shadow-2xl bg-black border theme-border flex flex-col justify-center items-center"
        style={{ touchAction: 'manipulation' }}
      >
        {!isPlaying ? (
          /* PRE-GAME LAUNCHER SPLASH SCREEN */
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-6 select-none overflow-hidden">
            
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-xl scale-110 opacity-70"
              style={{ backgroundImage: `url(${game.thumbnailUrl})` }}
            />

            <div className="absolute inset-0 bg-slate-950/60" />

            <div className="relative z-10 my-auto flex flex-col items-center gap-5">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-white/60 shadow-2xl shadow-slate-950/80 transform hover:scale-105 transition-transform">
                <img
                  src={game.thumbnailUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={handlePlayClick}
                className="px-12 py-3.5 rounded-xl bg-[#5c8a21] hover:bg-[#6fa828] border-2 border-white/80 text-white font-black text-xl tracking-wider shadow-2xl transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-white" />
                <span>PLAY GAME</span>
              </button>
            </div>

            <div className="relative z-10 text-center pb-2">
              <h2 className="text-white font-extrabold text-sm md:text-base tracking-widest uppercase text-shadow-md">
                {game.title}
              </h2>
            </div>
          </div>
        ) : (
          /* LIVE GAME EMBED / 3D CANVAS STAGE WITH AUTOMATIC AD-BANNER STRIPPING & GAP-FREE CROPPING */
          <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
            {game.gameType === 'THREEJS_3D' && game.threeEngineId ? (
              <Three3DGames
                engineId={game.threeEngineId as any}
                gameTitle={game.title}
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                <iframe
                  src={directEmbedUrl}
                  title={game.title}
                  className="w-full h-full border-0 block"
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
                    transform: autoGapFix ? `scale(${autoScaleFactor})` : 'scale(1)',
                    transformOrigin: 'center center',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; microphone; camera"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACTION CONTROLS BAR BELOW PLAYER */}
      <div className="theme-card rounded-2xl p-3 border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Game Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-sky-300 shadow-sm shrink-0">
            <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg flex items-center gap-2 theme-text-primary">
              <span>{game.title}</span>
              <span className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-md px-1.5 py-0.5 text-[10px] font-black shadow-sm">
                3D
              </span>
            </h1>
            <p className="text-xs font-semibold theme-text-secondary">{game.category} • Developer: {game.developerName || 'GameVault Studio'}</p>
          </div>
        </div>

        {/* Right: Interactive Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Likes */}
          <button
            onClick={() => handleRate('LIKE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              hasRated === 'LIKE'
                ? 'bg-lime-500 text-slate-950 scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Like this game"
          >
            <ThumbsUp className={`w-4 h-4 ${hasRated === 'LIKE' ? 'fill-slate-950' : ''}`} />
            <span>{likes}</span>
          </button>

          {/* Dislikes */}
          <button
            onClick={() => handleRate('DISLIKE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              hasRated === 'DISLIKE'
                ? 'bg-rose-500 text-white scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Dislike this game"
          >
            <ThumbsDown className={`w-4 h-4 ${hasRated === 'DISLIKE' ? 'fill-white' : ''}`} />
            <span>{dislikes}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm"
            title="Share Game URL"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'COPIED!' : 'SHARE'}</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full text-xs transition-all shadow-sm ${
              isFavorite ? 'bg-rose-500 text-white' : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
            }`}
            title="Favorite Game"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          {/* Multi-Screen Play Mode */}
          <Link
            href={`/multiscreen?game1=${game.slug}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-lime-500 to-lime-600 text-slate-950 text-xs font-black transition-all shadow-sm hover:scale-105"
            title="Play multiple games side by side"
          >
            <Layers className="w-4 h-4" />
            <span>MULTI-SCREEN</span>
          </Link>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-sm"
            title="Toggle Fullscreen Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Game Description & Info */}
      <div className="theme-card rounded-2xl p-5 border shadow-sm space-y-3">
        <h3 className="text-base font-extrabold theme-text-primary border-b pb-2 theme-border">
          About {game.title}
        </h3>
        <p className="text-sm theme-text-secondary leading-relaxed">
          {game.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs font-bold theme-text-secondary">TAGS:</span>
          {game.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 text-xs font-semibold border border-sky-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
