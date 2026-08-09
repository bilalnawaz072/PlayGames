'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DeleteGameModal from '@/components/DeleteGameModal';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ExternalLink, Gamepad2, Upload, AlertCircle, CheckCircle, Search, Copy, Sparkles, Lock, LogIn, Check, Image as ImageIcon } from 'lucide-react';
import { INITIAL_CATEGORIES, GameItem } from '@/lib/games-data';
import { getAutoUnsplashImage } from '@/lib/unsplash-helper';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login Form State for Admin Login Page
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin Dashboard State
  const [games, setGames] = useState<GameItem[]>([]);
  const [categories, setCategories] = useState<any[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameItem | null>(null);

  // Delete Modal State
  const [gameToDelete, setGameToDelete] = useState<GameItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Demo Games');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [gameType, setGameType] = useState<'IFRAME' | 'THREEJS_3D'>('IFRAME');
  const [threeEngineId, setThreeEngineId] = useState<'WAVE_DASH' | 'CYBER_DRIFT' | 'CUBE_STACK' | 'TUNNEL_RUNNER'>('WAVE_DASH');

  // Image Load Status State for Live Preview
  const [imgLoadStatus, setImgLoadStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');

  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkAdminAuth();
    fetchCategories();
  }, []);

  const checkAdminAuth = async () => {
    setCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.role === 'SUPER_ADMIN') {
          setUser(data.user);
          fetchGames();
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Invalid Admin Credentials.');
        setLoginLoading(false);
        return;
      }

      if (data.user && data.user.role === 'SUPER_ADMIN') {
        setUser(data.user);
        fetchGames();
      } else {
        setLoginError('Access denied: Account is not a Super Admin.');
      }
    } catch (err) {
      setLoginError('Error logging in. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (e) {}
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/games?status=ALL');
      if (res.ok) {
        const data = await res.json();
        setGames(data.games || []);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingGame(null);
    setTitle('');
    setDescription('');
    setCategory('Demo Games');
    setThumbnailUrl('');
    setEmbedUrl('');
    setGameType('IFRAME');
    setThreeEngineId('WAVE_DASH');
    setImgLoadStatus('idle');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (game: GameItem) => {
    setEditingGame(game);
    setTitle(game.title);
    setDescription(game.description);
    setCategory(game.category);
    setThumbnailUrl(game.thumbnailUrl);
    setEmbedUrl(game.embedUrl);
    setGameType(game.gameType);
    setThreeEngineId((game.threeEngineId as any) || 'WAVE_DASH');
    setImgLoadStatus(game.thumbnailUrl ? 'success' : 'idle');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleDuplicateGame = async (game: GameItem) => {
    setLoading(true);
    try {
      const newTitle = `${game.title} (Copy)`;
      const finalImage = game.thumbnailUrl || getAutoUnsplashImage(game.category, newTitle);

      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: game.description,
          category: game.category,
          thumbnailUrl: finalImage,
          embedUrl: game.embedUrl,
          gameType: game.gameType,
          threeEngineId: game.threeEngineId,
          tags: Array.isArray(game.tags) ? game.tags : [game.category],
        }),
      });

      if (res.ok) {
        fetchGames();
      } else {
        alert('Failed to duplicate game.');
      }
    } catch (err) {
      alert('Error duplicating game.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillImage = () => {
    const autoImg = getAutoUnsplashImage(category, title);
    setThumbnailUrl(autoImg);
    setImgLoadStatus('loading');
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFeedback(null);

    let finalThumbnail = thumbnailUrl.trim();
    if (!finalThumbnail) {
      finalThumbnail = getAutoUnsplashImage(category, title);
      setThumbnailUrl(finalThumbnail);
    }

    try {
      if (editingGame) {
        const res = await fetch(`/api/games/${editingGame.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            category,
            thumbnailUrl: finalThumbnail,
            embedUrl,
            gameType,
            tags: [category, gameType],
          }),
        });

        if (res.ok) {
          setFeedback({ type: 'success', text: '✨ Game updated successfully!' });
          fetchGames();
          setTimeout(() => setIsModalOpen(false), 1000);
        } else {
          const data = await res.json();
          setFeedback({ type: 'error', text: data.error || 'Failed to update game.' });
        }
      } else {
        const res = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            category,
            thumbnailUrl: finalThumbnail,
            embedUrl,
            gameType,
            threeEngineId,
            tags: [category, gameType],
          }),
        });

        if (res.ok) {
          setFeedback({ type: 'success', text: '🎉 New game created & published!' });
          fetchGames();
          setTimeout(() => setIsModalOpen(false), 1000);
        } else {
          const data = await res.json();
          setFeedback({ type: 'error', text: data.error || 'Failed to create game.' });
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Connection error while saving game.' });
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDeleteGame = async (gameId: string) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setGames((prev) => prev.filter((g) => g.id !== gameId));
        setGameToDelete(null);
      } else {
        alert('Failed to delete game.');
      }
    } catch (err) {
      alert('Error deleting game.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredGames = games.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        {checkingAuth ? (
          <div className="py-24 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
          </div>
        ) : !user ? (
          /* DEDICATED ADMIN SIGN-IN LOGIN PAGE */
          <div className="theme-card rounded-3xl p-8 max-w-md mx-auto text-center space-y-6 border shadow-2xl mt-8 animate-fadeIn">
            <div className="w-16 h-16 bg-lime-500/20 text-lime-400 rounded-full flex items-center justify-center mx-auto border border-lime-500/30 shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-black theme-text-primary">Admin Studio Sign-In</h1>
              <p className="text-xs theme-text-secondary mt-1">
                Restricted access: Sign in with valid Admin Credentials to unlock game management portal.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold theme-text-primary mb-1">Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                />
              </div>

              <div>
                <label className="block text-xs font-bold theme-text-primary mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-sm shadow-lg shadow-lime-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>LOG IN TO ADMIN STUDIO</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN STUDIO DASHBOARD */
          <>
            {/* Header Control Panel */}
            <div className="theme-card rounded-2xl p-6 border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 theme-accent font-extrabold text-xs uppercase tracking-wider mb-1">
                  <Gamepad2 className="w-4 h-4" />
                  <span>GameVault 3D Admin Control Studio</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black theme-text-primary">Admin Game Management</h1>
                <p className="text-xs theme-text-secondary mt-1">
                  Logged in as Super Admin. Add, edit, duplicate, and manage real games.
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="px-6 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW GAME</span>
              </button>
            </div>

            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border shadow-md theme-card">
              <div className="flex items-center gap-2 text-xs font-extrabold theme-text-primary">
                <span>Total Active Games:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-lime-500 text-slate-950 text-xs font-black">
                  {games.length}
                </span>
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or category..."
                  className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:border-lime-500 theme-card"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Games Table List */}
            <div className="theme-card rounded-2xl border overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 theme-text-secondary uppercase font-black tracking-wider border-b theme-border">
                    <tr>
                      <th className="py-3 px-4">Game Image & Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y theme-border font-medium">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto"></div>
                        </td>
                      </tr>
                    ) : filteredGames.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center theme-text-secondary font-bold">
                          No games found. Click "ADD NEW GAME" to add your first real game!
                        </td>
                      </tr>
                    ) : (
                      filteredGames.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={g.thumbnailUrl || getAutoUnsplashImage(g.category, g.title)}
                                alt={g.title}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                              />
                              <div>
                                <p className="font-extrabold theme-text-primary text-sm line-clamp-1">{g.title}</p>
                                <p className="text-[10px] theme-text-secondary line-clamp-1 max-w-md">{g.description}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-sky-400 font-bold">{g.category}</td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                              {g.gameType}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDuplicateGame(g)}
                                className="p-2 rounded-lg bg-lime-500/20 text-lime-400 hover:bg-lime-500 hover:text-slate-950 transition-colors flex items-center gap-1 font-bold text-[10px]"
                                title="Duplicate Game Entry"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">DUPLICATE</span>
                              </button>

                              <Link
                                href={`/play/${g.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors"
                                title="Open Game Play Page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => openEditModal(g)}
                                className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                                title="Edit Game Details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Amazing Delete Button */}
                              <button
                                onClick={() => setGameToDelete(g)}
                                className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                                title="Delete Game"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </main>

      {/* AMAZING DELETE GAME CONFIRMATION MODAL CARD */}
      <DeleteGameModal
        isOpen={!!gameToDelete}
        game={gameToDelete}
        onClose={() => setGameToDelete(null)}
        onConfirm={confirmDeleteGame}
        loading={deleteLoading}
      />

      {/* CREATE / EDIT GAME MODAL WITH LIVE IMAGE PREVIEW (JPG, PNG, JPEG, WEBP, GIF, ETC.) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg theme-card border rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <h2 className="text-xl font-extrabold theme-text-primary flex items-center gap-2 border-b pb-3 theme-border">
              <Upload className="w-5 h-5 text-lime-400" />
              <span>{editingGame ? 'Update Game Details' : 'Add New Game'}</span>
            </h2>

            {feedback && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
                  feedback.type === 'success' ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveGame} className="space-y-3.5">
              
              {/* Game Name */}
              <div>
                <label className="block text-xs font-bold theme-text-primary mb-1">Game Name / Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Geometry Arrow 3D"
                  className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                />
              </div>

              {/* Game Image URL with Live Image Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold theme-text-primary">
                    Cover Image URL (Supports .jpg, .png, .jpeg, .webp, .gif)
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFillImage}
                    className="text-[10px] font-black text-lime-400 hover:text-lime-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto Unsplash Image</span>
                  </button>
                </div>
                
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => {
                    setThumbnailUrl(e.target.value);
                    setImgLoadStatus(e.target.value ? 'loading' : 'idle');
                  }}
                  placeholder="Paste URL (e.g. https://domain.com/image.png or .jpg, .gif, .webp)"
                  className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                />

                {/* INSTANT LIVE IMAGE PREVIEW BOX */}
                {thumbnailUrl && (
                  <div className="mt-2 p-2 rounded-xl border theme-border theme-bg-secondary flex items-center gap-3">
                    <div className="w-20 h-16 rounded-lg overflow-hidden border theme-border bg-black shrink-0 relative flex items-center justify-center">
                      <img
                        src={thumbnailUrl}
                        alt="Live Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => setImgLoadStatus('success')}
                        onError={() => setImgLoadStatus('error')}
                      />
                    </div>
                    <div className="text-xs">
                      {imgLoadStatus === 'success' && (
                        <p className="font-bold text-lime-400 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>Image Loaded Successfully!</span>
                        </p>
                      )}
                      {imgLoadStatus === 'error' && (
                        <p className="font-bold text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>Image URL Invalid or Failed to Load</span>
                        </p>
                      )}
                      {imgLoadStatus === 'loading' && (
                        <p className="font-bold text-sky-400 animate-pulse">
                          Testing Image URL...
                        </p>
                      )}
                      <p className="text-[10px] theme-text-secondary mt-0.5">
                        Supports PNG, JPG, JPEG, WEBP, GIF, SVG & web image URLs.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold theme-text-primary mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Game Type */}
              <div>
                <label className="block text-xs font-bold theme-text-primary mb-1">Game Engine / Embed Type *</label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                >
                  <option value="IFRAME">External HTML5 iFrame Embed URL</option>
                  <option value="THREEJS_3D">Interactive 3D WebGL Engine</option>
                </select>
              </div>

              {gameType === 'THREEJS_3D' ? (
                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">3D Game Preset</label>
                  <select
                    value={threeEngineId}
                    onChange={(e) => setThreeEngineId(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                  >
                    <option value="WAVE_DASH">Wave Dash 3D (Geometry Spike Tunnel)</option>
                    <option value="CYBER_DRIFT">Cyber Drift 3D (Futuristic Car Racing)</option>
                    <option value="CUBE_STACK">Cube Stacker 3D (Timing Block Tower)</option>
                    <option value="TUNNEL_RUNNER">Tunnel Runner 3D (FPS Sci-Fi Tube Dodge)</option>
                  </select>
                </div>
              ) : (
                /* Embed URL */
                <div>
                  <label className="block text-xs font-bold theme-text-primary mb-1">Embed iFrame URL *</label>
                  <input
                    type="url"
                    required={gameType === 'IFRAME'}
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="https://html5.gamedistribution.com/..."
                    className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                  />
                </div>
              )}

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold theme-text-primary mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter complete game overview and controls description..."
                  className="w-full px-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-lime-500 theme-card"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t theme-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs shadow-lg"
                >
                  {formLoading ? 'Saving...' : editingGame ? 'UPDATE GAME DETAILS' : 'SAVE GAME'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
