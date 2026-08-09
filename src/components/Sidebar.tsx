'use client';

import React from 'react';
import {
  Home,
  Flame,
  Trophy,
  Grid,
  Sparkles,
  Puzzle,
  SquareDot,
  Circle,
  Layers,
  Crown,
  Brain,
  Type,
  LayoutGrid,
  Car,
  Bike,
  Crosshair,
  Utensils,
  Smile,
  Baby,
  Gamepad2,
  Zap,
  Box,
  ChevronRight
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/games-data';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  activeFilter: 'all' | 'new' | 'popular' | '3d';
  onSelectFilter: (filter: 'all' | 'new' | 'popular' | '3d') => void;
  isOpenMobile?: boolean;
}

const ICON_MAP: { [key: string]: any } = {
  Home,
  Flame,
  Trophy,
  Grid,
  Sparkles,
  Puzzle,
  SquareDot,
  Circle,
  Layers,
  Crown,
  Brain,
  Type,
  LayoutGrid,
  Car,
  Bike,
  Crosshair,
  Utensils,
  Smile,
  Baby,
  Gamepad2,
  Zap,
  Box,
};

export default function Sidebar({
  activeCategory,
  onSelectCategory,
  activeFilter,
  onSelectFilter,
  isOpenMobile = false,
}: SidebarProps) {
  return (
    <aside
      className={`fixed md:sticky top-[57px] left-0 z-30 w-56 h-[calc(100vh-57px)] bg-[#76b813] border-r border-[#65a30d] text-white flex flex-col overflow-y-auto shadow-lg transition-transform duration-300 ease-in-out ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Top Main Navigation */}
      <div className="p-2 space-y-1 border-b border-[#65a30d]/50">
        <button
          onClick={() => {
            onSelectCategory('all');
            onSelectFilter('all');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-black tracking-wide uppercase transition-all ${
            activeFilter === 'all' && activeCategory === 'all'
              ? 'bg-[#5b960b] text-white shadow-inner font-extrabold'
              : 'hover:bg-[#68a70e] text-lime-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Home className="w-4 h-4" />
            <span>HOME</span>
          </div>
        </button>

        <button
          onClick={() => {
            onSelectCategory('all');
            onSelectFilter('new');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-black tracking-wide uppercase transition-all ${
            activeFilter === 'new'
              ? 'bg-[#5b960b] text-white shadow-inner'
              : 'hover:bg-[#68a70e] text-lime-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>NEW</span>
          </div>
          <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow-sm">
            42
          </span>
        </button>

        <button
          onClick={() => {
            onSelectCategory('all');
            onSelectFilter('popular');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-black tracking-wide uppercase transition-all ${
            activeFilter === 'popular'
              ? 'bg-[#5b960b] text-white shadow-inner'
              : 'hover:bg-[#68a70e] text-lime-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-orange-300" />
            <span>POPULAR</span>
          </div>
        </button>

        <button
          onClick={() => {
            onSelectCategory('3d-games');
            onSelectFilter('3d');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-black tracking-wide uppercase transition-all ${
            activeFilter === '3d'
              ? 'bg-[#5b960b] text-white shadow-inner'
              : 'hover:bg-[#68a70e] text-lime-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Box className="w-4 h-4 text-sky-200" />
            <span>3D GAMES</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white text-[9px] font-black uppercase">
            3D
          </span>
        </button>
      </div>

      {/* Categories Header */}
      <div className="px-3 py-2 bg-[#619c0d] text-[11px] font-black tracking-wider uppercase flex items-center gap-2 border-b border-[#528708]">
        <Grid className="w-3.5 h-3.5" />
        <span>ALL CATEGORIES</span>
      </div>

      {/* Category List */}
      <div className="flex-1 p-1 space-y-0.5 overflow-y-auto">
        {INITIAL_CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.iconName] || Gamepad2;
          const isActive = activeCategory === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.slug);
                onSelectFilter('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-[#4d8009] text-white font-extrabold shadow-sm'
                  : 'hover:bg-[#6ca810] text-lime-50'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <IconComp className="w-4 h-4 opacity-90 shrink-0" />
                <span className="truncate">{cat.name}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
