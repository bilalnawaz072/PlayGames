'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Shield, Menu, Layers, ArrowUpDown, Palette, LogIn, Lock, Gamepad2, Flame, Box, Trophy, Crown, Zap, Megaphone } from 'lucide-react';
import PlayBuddyModal from './PlayBuddyModal';
import { useTheme, ThemeMode } from './ThemeProvider';
import { useSiteConfig } from './SiteConfigProvider';

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: 'popular' | 'newest' | 'rating' | 'title') => void;
  toggleSidebar?: () => void;
}

export default function Navbar({ onSearchChange, onSortChange, toggleSidebar }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'title'>('popular');
  const [buddyOpen, setBuddyOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const { theme, setTheme } = useTheme();
  const { config } = useSiteConfig();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.role === 'SUPER_ADMIN') {
          setIsAdminLoggedIn(true);
        }
      }
    } catch (e) {}
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSort = (val: 'popular' | 'newest' | 'rating' | 'title') => {
    setSortBy(val);
    if (onSortChange) {
      onSortChange(val);
    }
  };

  // Helper to render dynamic custom brand icon
  const renderBrandIcon = () => {
    switch (config.customIcon) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'Box': return <Box className="w-5 h-5 text-sky-400 shrink-0" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'Zap': return <Zap className="w-5 h-5 text-lime-400 shrink-0" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />;
      default: return <Gamepad2 className="w-5 h-5 text-lime-400 shrink-0" />;
    }
  };

  const allowedThemeList = (config.allowedThemes || 'dark,light,soft,cyberpunk,hacker,arena').split(',');

  return (
    <>
      {/* Dynamic Announcement Ticker Banner */}
      {config.showAnnouncement && config.announcementText && (
        <div className="w-full bg-gradient-to-r from-lime-500 via-amber-500 to-rose-500 text-slate-950 font-black text-xs py-1.5 px-4 text-center shadow-md flex items-center justify-center gap-2">
          <Megaphone className="w-4 h-4 shrink-0 animate-bounce" />
          <span className="truncate">{config.announcementText}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full backdrop-blur-md shadow-lg border-b theme-card">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          {/* Left: Mobile Menu & Custom Brand Logo / Title */}
          <div className="flex items-center gap-3 shrink-0">
            {toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                aria-label="Toggle Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link href="/" className="flex items-center gap-2.5 group">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={config.siteName}
                  className="w-8 h-8 md:w-9 md:h-9 object-contain rounded-lg shrink-0"
                />
              ) : (
                renderBrandIcon()
              )}

              <div className="flex items-center tracking-tight font-black text-xl md:text-2xl font-sans theme-text-primary">
                <span>{config.siteName || 'GameVault'}</span>
                {config.siteTagline && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] md:text-xs font-black shadow-md">
                    {config.siteTagline}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Center: Search Bar & Integrated Sort Dropdown */}
          <div className="flex-1 max-w-2xl flex items-center gap-2 mx-1 md:mx-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder={`Search ${config.siteName || 'GameVault'} Games...`}
                className="w-full pl-4 pr-9 py-2 rounded-xl border text-xs md:text-sm font-medium focus:outline-none focus:border-lime-500 shadow-inner transition-all theme-card"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
            </div>

            {/* Integrated Sort Selector */}
            <div className="flex items-center gap-1 shrink-0 border rounded-xl px-2 py-1 theme-card">
              <ArrowUpDown className="w-3.5 h-3.5 text-lime-400 shrink-0 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as any)}
                className="bg-transparent font-bold text-xs focus:outline-none cursor-pointer py-1 theme-text-primary"
                aria-label="Sort Games"
              >
                <option value="popular" className="bg-slate-900 text-white">🔥 Most Popular</option>
                <option value="rating" className="bg-slate-900 text-white">⭐ Highest Rated</option>
                <option value="newest" className="bg-slate-900 text-white">✨ Newest Games</option>
                <option value="title" className="bg-slate-900 text-white">🔤 Title (A-Z)</option>
              </select>
            </div>

          </div>

          {/* Right: Custom Theme Switcher, AI Buddy, Multi-Screen & Admin Access */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Dynamic Theme Selector */}
            <div className="flex items-center gap-1 border rounded-xl px-2 py-1 theme-card">
              <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeMode)}
                className="bg-transparent font-extrabold text-xs focus:outline-none cursor-pointer py-1 uppercase theme-text-primary"
                title="Select Visual Theme Style"
              >
                {allowedThemeList.includes('dark') && <option value="dark" className="bg-slate-900 text-white">🌙 Dark</option>}
                {allowedThemeList.includes('light') && <option value="light" className="bg-slate-900 text-white">☀️ Light</option>}
                {allowedThemeList.includes('soft') && <option value="soft" className="bg-slate-900 text-white">🌸 Soft</option>}
                {allowedThemeList.includes('cyberpunk') && <option value="cyberpunk" className="bg-slate-900 text-white">🤖 Cyberpunk</option>}
                {allowedThemeList.includes('hacker') && <option value="hacker" className="bg-slate-900 text-white">💻 Hacker</option>}
                {allowedThemeList.includes('arena') && <option value="arena" className="bg-slate-900 text-white">🏟️ Arena</option>}
              </select>
            </div>

            {config.showAiBuddy && (
              <button
                onClick={() => setBuddyOpen(true)}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md whitespace-nowrap transform hover:scale-105 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Ask GameAI</span>
              </button>
            )}

            {config.showMultiScreen && (
              <Link
                href="/multiscreen"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs shadow-md transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>MULTI-SCREEN</span>
              </Link>
            )}

            {isAdminLoggedIn ? (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>ADMIN STUDIO</span>
              </Link>
            ) : (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all theme-card hover:border-lime-500"
                title="Admin Sign In"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>ADMIN LOGIN</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* GameAI Assistant Modal */}
      <PlayBuddyModal isOpen={buddyOpen} onClose={() => setBuddyOpen(false)} />
    </>
  );
}
