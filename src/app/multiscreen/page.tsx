'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MultiScreenPlayer from '@/components/MultiScreenPlayer';

function MultiScreenContent() {
  const searchParams = useSearchParams();
  const game1 = searchParams.get('game1') || undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <MultiScreenPlayer initialGameSlug={game1} />
      </main>
    </div>
  );
}

export default function MultiScreenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Multi-Screen Mode...</div>}>
      <MultiScreenContent />
    </Suspense>
  );
}
