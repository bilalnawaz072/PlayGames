'use client';

import React from 'react';
import { Trash2, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { GameItem } from '@/lib/games-data';

interface DeleteGameModalProps {
  isOpen: boolean;
  game: GameItem | null;
  onClose: () => void;
  onConfirm: (gameId: string) => void;
  loading?: boolean;
}

export default function DeleteGameModal({
  isOpen,
  game,
  onClose,
  onConfirm,
  loading = false,
}: DeleteGameModalProps) {
  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Amazing Delete Confirmation Card */}
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 text-slate-100 shadow-2xl shadow-rose-950/80 space-y-5 transform hover:scale-[1.01] transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Warning Icon Badge */}
        <div className="flex justify-center pt-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center border-2 border-rose-500/40 shadow-inner animate-pulse">
              <Trash2 className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-rose-600 text-white shadow-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white tracking-wide">Delete Game?</h2>
          <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">
            Permanent Action Required
          </p>
        </div>

        {/* Game Preview Pill Box */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
          />
          <div className="overflow-hidden text-left">
            <h3 className="font-extrabold text-sm text-white truncate">{game.title}</h3>
            <p className="text-xs text-sky-400 font-medium truncate">{game.category}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {game.id}</p>
          </div>
        </div>

        {/* Warning Text */}
        <p className="text-xs text-slate-300 text-center leading-relaxed bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
          ⚠️ Are you sure you want to permanently delete <strong>"{game.title}"</strong> from the database? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={() => onConfirm(game.id)}
            disabled={loading}
            className="py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            {loading ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>YES, DELETE GAME</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
