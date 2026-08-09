'use client';

import React, { useState } from 'react';
import { X, LogIn, UserPlus, Code, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'PLAYER' | 'DEVELOPER'>('PLAYER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
        setLoading(false);
        return;
      }

      setLoading(false);
      onClose();
      window.location.reload();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-wide">
            {mode === 'login' ? 'Welcome Back!' : 'Join GameVault 3D Platform'}
          </h2>
          <p className="text-xs text-sky-400 mt-1 font-medium">
            {mode === 'login' ? 'Sign in to your player or developer account' : 'Register as a Player or Game Developer'}
          </p>
        </div>

        {/* Role Toggle for Register Mode */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('PLAYER')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all ${
                role === 'PLAYER'
                  ? 'bg-gradient-to-r from-lime-500 to-lime-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Gamer / Player</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('DEVELOPER')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all ${
                role === 'DEVELOPER'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Game Developer</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>SIGN IN</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>CREATE {role} ACCOUNT</span>
              </>
            )}
          </button>
        </form>

        {/* Secure Authentication Notice */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-lime-400">🔒 Secure Authentication:</p>
          <p>Admin and Developer access requires valid environment-configured credentials.</p>
        </div>

        {/* Mode Switcher */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-sky-400 font-bold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-sky-400 font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
