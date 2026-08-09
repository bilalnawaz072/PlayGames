'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import DeleteGameModal from '@/components/DeleteGameModal';
import Link from 'next/link';
import { Code, Plus, Gamepad2, CheckCircle, Clock, AlertCircle, Eye, ThumbsUp, Upload, Sparkles, ShieldAlert, LogIn, Lock, Copy, Check, Trash2 } from 'lucide-react';
import { INITIAL_CATEGORIES, GameItem } from '@/lib/games-data';
import { getAutoUnsplashImage } from '@/lib/unsplash-helper';
import { useDataUpdate } from '@/components/DataUpdateContext';
import { InlineUpdateProgressBar } from '@/components/UpdateProgressBar';

export default function DeveloperPortalPage() {
  const [user, setUser] = useState<any>(null);
  const [userGames, setUserGames] = useState<GameItem[]>([]);
  const [categories, setCategories] = useState<any[]>(INITIAL_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Demo Games');
  const [tags, setTags] = useState('Demo, 3D, Action');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [gameType, setGameType] = useState<'IFRAME' | 'THREEJS_3D'>('IFRAME');
  const [threeEngineId, setThreeEngineId] = useState<'WAVE_DASH' | 'CYBER_DRIFT' | 'CUBE_STACK' | 'TUNNEL_RUNNER'>('WAVE_DASH');

  // Image Load Status for Live Preview
  const [imgLoadStatus, setImgLoadStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');

  // Delete Modal State
  const [gameToDelete, setGameToDelete] = useState<GameItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { startUpdating, finishUpdating, failUpdating, triggerUpdate } = useDataUpdate();

  useEffect(() => {
    checkAuth();
    fetchCategories();
  }, []);

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

  const checkAuth = async () => {
    setCheckingAuth(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        const data = await authRes.json();
        setUser(data.user);
        if (data.user && (data.user.role === 'DEVELOPER' || data.user.role === 'SUPER_ADMIN')) {
          fetchDeveloperGames();
        }
      }
    } catch (e) {
    } finally {
      setCheckingAuth(false);
    }
  };

  const fetchDeveloperGames = async () => {
    try {
      const gamesRes = await fetch('/api/games?status=ALL');
      if (gamesRes.ok) {
        const data = await gamesRes.json();
        setUserGames(data.games || []);
      }
    } catch (e) {}
  };

  const handleAutoFillImage = () => {
    const autoImg = getAutoUnsplashImage(category, title);
    setThumbnailUrl(autoImg);
    setImgLoadStatus('loading');
  };

  const handleDuplicateGame = async (game: GameItem) => {
    setLoading(true);
    await triggerUpdate(
      async () => {
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
          fetchDeveloperGames();
        } else {
          throw new Error('Failed to duplicate game.');
        }
      },
      `Duplicating game "${game.title}"...`,
      `✨ Game "${game.title}" duplicated!`
    ).catch((err) => {
      alert(err.message || 'Error duplicating game.');
    }).finally(() => {
      setLoading(false);
    });
  };

  const confirmDeleteGame = async (gameId: string) => {
    setDeleteLoading(true);
    await triggerUpdate(
      async () => {
        const res = await fetch(`/api/games/${gameId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setUserGames((prev) => prev.filter((g) => g.id !== gameId));
          setGameToDelete(null);
        } else {
          throw new Error('Failed to delete game.');
        }
      },
      'Deleting game from developer portal...',
      '🗑️ Game deleted successfully!'
    ).catch((err) => {
      alert(err.message || 'Error deleting game.');
    }).finally(() => {
      setDeleteLoading(false);
    });
  };

  const handlePublishGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    startUpdating(`Submitting game "${title}" to database...`);

    let finalThumbnail = thumbnailUrl.trim();
    if (!finalThumbnail) {
      finalThumbnail = getAutoUnsplashImage(category, title);
      setThumbnailUrl(finalThumbnail);
    }

    const startTime = Date.now();

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          tags: tags.split(',').map((t) => t.trim()),
          thumbnailUrl: finalThumbnail,
          embedUrl: embedUrl || 'https://html5.gamedistribution.com/rvvASyc0/c70c1e82845d4c82b49b380ed5b4b1a4/index.html',
          gameType,
          threeEngineId,
        }),
      });

      const data = await res.json();
      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) await new Promise((r) => setTimeout(r, 1200 - elapsed));

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to submit game.' });
        failUpdating(data.error || 'Failed to submit game.');
        setLoading(false);
        return;
      }

      setMessage({
        type: 'success',
        text: '🎉 Game submitted to GameVault DB! Sent to Super Admin for approval.',
      });
      finishUpdating('🎉 Game submitted! Pending Super Admin review.');
      setLoading(false);
      setShowForm(false);
      fetchDeveloperGames();

      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      setEmbedUrl('');
      setImgLoadStatus('idle');
    } catch (err) {
      setMessage({ type: 'error', text: 'Error connecting to server.' });
      failUpdating('Connection error submitting game.');
      setLoading(false);
    }
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        {checkingAuth ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        ) : !user || (user.role !== 'DEVELOPER' && user.role !== 'SUPER_ADMIN') ? (
          /* AUTHENTICATION REQUIRED GUARD SCREEN FOR DEVELOPERS */
          <div className="theme-card border rounded-3xl p-8 max-w-xl mx-auto text-center space-y-5 shadow-2xl mt-8">
            <div className="w-16 h-16 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center mx-auto border border-sky-500/30">
              <Lock className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-black theme-text-primary">Developer Sign-In Required</h2>
            <p className="text-sm theme-text-secondary leading-relaxed">
              You must be logged in as a **Registered Game Developer** or **Super Admin** to access the Developer Publishing Studio.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openAuth('login')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>DEVELOPER LOGIN</span>
              </button>
              <button
                onClick={() => openAuth('register')}
                className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm border border-slate-700"
              >
                REGISTER AS DEVELOPER
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DEVELOPER DASHBOARD */
          <>
            <div className="theme-card border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 theme-accent font-extrabold text-xs uppercase tracking-wider mb-1">
                  <Code className="w-4 h-4" />
                  <span>GameVault 3D Developer Portal</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black theme-text-primary">Publish New Games</h1>
                <p className="text-xs theme-text-secondary mt-1 max-w-xl">
                  Logged in as <strong className="text-lime-400">{user.name}</strong> ({user.role}). Submit games directly to PostgreSQL DB.
                </p>
              </div>

              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 rounded-full bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-sm shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>{showForm ? 'CANCEL FORM' : 'SUBMIT NEW GAME'}</span>
              </button>
            </div>

            {/* Feedback Message */}
            {message && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold shadow-md ${
                  message.type === 'success'
                    ? 'bg-lime-500/10 border border-lime-500/30 text-lime-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            {/* GAME SUBMISSION FORM */}
            {showForm && (
              <div className="theme-card border rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
                <h2 className="text-lg font-extrabold theme-text-primary flex items-center gap-2 border-b pb-3 theme-border">
                  <Upload className="w-5 h-5 text-sky-400" />
                  <span>Developer Game Submission</span>
                </h2>

                {loading && (
                  <InlineUpdateProgressBar
                    progress={70}
                    message="Submitting game details & images to database..."
                  />
                )}

                <form onSubmit={handlePublishGame} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                      <label className="block text-xs font-bold theme-text-primary mb-1">Game Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Cyber Racing 3D"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-sky-500 theme-card"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold theme-text-primary mb-1">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-sky-500 theme-card"
                      >
                        {categories.map((c) => (
                          <option key={c.id || c.slug} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold theme-text-primary mb-1">Engine / Embed Type *</label>
                      <select
                        value={gameType}
                        onChange={(e) => setGameType(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-sky-500 theme-card"
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
                          className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-sky-500 theme-card"
                        >
                          <option value="WAVE_DASH">Wave Dash 3D (Geometry Spike Tunnel)</option>
                          <option value="CYBER_DRIFT">Cyber Drift 3D (Futuristic Car Racing)</option>
                          <option value="CUBE_STACK">Cube Stacker 3D (Timing Block Tower)</option>
                          <option value="TUNNEL_RUNNER">Tunnel Runner 3D (FPS Sci-Fi Tube Dodge)</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold theme-text-primary mb-1">Game Embed / iFrame URL *</label>
                        <input
                          type="url"
                          required={gameType === 'IFRAME'}
                          value={embedUrl}
                          onChange={(e) => setEmbedUrl(e.target.value)}
                          placeholder="https://html5.gamedistribution.com/..."
                          className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-sky-500 theme-card"
                        />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold theme-text-primary">
                          Cover Image URL (Supports PNG, JPG, JPEG, WEBP, GIF)
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
                        placeholder="Paste image URL (e.g. .jpg, .png, .gif, .webp)"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-sky-500 theme-card"
                      />

                      {/* LIVE IMAGE PREVIEW */}
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
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold theme-text-primary mb-1">Tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Demo, 3D, Action, Arcade"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-sky-500 theme-card"
                      />
                    </div>

                  </div>

                  <div>
                    <label className="block text-xs font-bold theme-text-primary mb-1">Game Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain gameplay features and control keys..."
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-sky-500 theme-card"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t theme-border">
                    <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Submissions require Super Admin approval before appearing on home page.</span>
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs shadow-lg"
                      >
                        {loading ? 'Submitting...' : 'SUBMIT TO ADMIN FOR APPROVAL'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* SUBMITTED GAMES OVERVIEW */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold theme-text-primary flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-lime-400" />
                <span>Developer Submitted Games Overview ({userGames.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userGames.map((g) => (
                  <div
                    key={g.id}
                    className="theme-card border rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img src={g.thumbnailUrl || getAutoUnsplashImage(g.category, g.title)} alt={g.title} className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-extrabold text-sm theme-text-primary line-clamp-1">{g.title}</h3>
                        <p className="text-xs text-sky-400 font-semibold">{g.category}</p>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                              g.status === 'APPROVED'
                                ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                                : g.status === 'PENDING'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {g.status === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{g.status}</span>
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDuplicateGame(g)}
                              className="p-1.5 rounded bg-slate-800 text-lime-400 hover:bg-slate-700"
                              title="Duplicate Game"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setGameToDelete(g)}
                              className="p-1.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                              title="Delete Game"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t theme-border text-center">
                      <div className="p-2 theme-bg-secondary rounded-xl">
                        <p className="text-[10px] theme-text-secondary font-semibold flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3 text-sky-400" /> Real Plays
                        </p>
                        <p className="text-sm font-black theme-text-primary">{g.playsCount.toLocaleString()}</p>
                      </div>
                      <div className="p-2 theme-bg-secondary rounded-xl">
                        <p className="text-[10px] theme-text-secondary font-semibold flex items-center justify-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-lime-400" /> Likes
                        </p>
                        <p className="text-sm font-black theme-text-primary">{g.likesCount.toLocaleString()}</p>
                      </div>
                    </div>

                  </div>
                ))}
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

      {/* Auth Modal for Developer Login / Register */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          checkAuth();
        }}
        initialMode={authMode}
      />
    </div>
  );
}
