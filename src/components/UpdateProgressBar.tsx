'use client';

import React from 'react';
import { useDataUpdate } from './DataUpdateContext';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function UpdateProgressBar() {
  const { updateState } = useDataUpdate();
  const { isUpdating, progress, message, status } = updateState;

  if (!isUpdating && status === 'idle') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none flex flex-col items-center">
      {/* Top Linear Progress Bar */}
      <div className="w-full h-1.5 bg-slate-950/40 backdrop-blur-sm overflow-hidden relative">
        <div
          className={`h-full transition-all duration-300 ease-out rounded-r-full shadow-lg ${
            status === 'error'
              ? 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 shadow-rose-500/50'
              : status === 'success'
              ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 shadow-emerald-500/50'
              : 'bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 shadow-lime-400/50'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          {/* Shimmer Effect while updating */}
          {status === 'updating' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
          )}
        </div>
      </div>

      {/* Floating Status Toast Pill */}
      <div className="mt-3 px-4 py-2.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl flex items-center gap-3 text-sm font-medium text-slate-100 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
        {status === 'updating' && (
          <Loader2 className="w-4 h-4 text-lime-400 animate-spin flex-shrink-0" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        )}

        <span className="truncate max-w-xs md:max-w-md">{message || 'Updating data...'}</span>

        {status === 'updating' && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-lime-500/10 text-lime-400 border border-lime-500/20 font-mono">
            {progress}%
          </span>
        )}
        {status === 'success' && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            100%
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Secondary Inline Progress Component for Forms & Modals
 */
export function InlineUpdateProgressBar({
  progress,
  message,
  status = 'updating',
}: {
  progress: number;
  message?: string;
  status?: 'updating' | 'success' | 'error';
}) {
  return (
    <div className="w-full space-y-2 py-2">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-slate-300">
          {status === 'updating' && <Loader2 className="w-3.5 h-3.5 text-lime-400 animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          {status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
          {message || 'Updating data in database...'}
        </span>
        <span className="font-mono text-lime-400">{progress}%</span>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            status === 'error'
              ? 'bg-rose-500'
              : status === 'success'
              ? 'bg-emerald-400'
              : 'bg-gradient-to-r from-lime-400 to-emerald-400'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
