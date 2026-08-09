'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, Gamepad2, Compass } from 'lucide-react';
import Link from 'next/link';

interface PlayBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayBuddyModal({ isOpen, onClose }: PlayBuddyModalProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'buddy'; text: string; gameRecommendation?: any }>>([
    {
      sender: 'buddy',
      text: "Hi there! I'm PlayBuddy, your AI game assistant! 🎮 What kind of game are you in the mood for today? (e.g. 3D racing, geometry runner, Mahjong tiles, or action puzzles?)",
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    // Generate intelligent AI response based on query keywords
    setTimeout(() => {
      let replyText = "I found some great games for you!";
      let rec: any = null;

      const lower = userText.toLowerCase();
      if (lower.includes('3d') || lower.includes('runner') || lower.includes('arrow') || lower.includes('geometry') || lower.includes('wave')) {
        replyText = "Awesome! You'll love Wave Dash 3D : Geometry Arrow! It features fast-paced 3D spike tunnel dodging and neon geometry.";
        rec = { title: 'Wave Dash 3D : Geometry Arrow', slug: 'wave-dash-3d', category: '3D Games' };
      } else if (lower.includes('car') || lower.includes('drift') || lower.includes('race') || lower.includes('driving')) {
        replyText = "Check out Cyber Drift 3D Racing! Steer through sharp neon curves and drift to gain boosts.";
        rec = { title: 'Cyber Drift 3D Racing', slug: 'cyber-drift-3d', category: 'Drift' };
      } else if (lower.includes('stack') || lower.includes('cube') || lower.includes('block') || lower.includes('tower')) {
        replyText = "Cube Stacker 3D Master is perfect! Test your timing by stacking moving blocks into sky-high towers.";
        rec = { title: 'Cube Stacker 3D Master', slug: 'cube-stacker-3d', category: 'Puzzle' };
      } else if (lower.includes('mahjong') || lower.includes('tiles') || lower.includes('relax')) {
        replyText = "Mahjong Classic Online is our top recommended tile matching game for a relaxing experience!";
        rec = { title: 'Mahjong Classic Online', slug: 'mahjong-classic-online', category: 'Mahjong' };
      } else {
        replyText = "Here are our top trending 3D games! Try Wave Dash 3D or Cyber Drift 3D for high adrenaline action.";
        rec = { title: 'Wave Dash 3D : Geometry Arrow', slug: 'wave-dash-3d', category: '3D Games' };
      }

      setMessages((prev) => [...prev, { sender: 'buddy', text: replyText, gameRecommendation: rec }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] text-slate-100">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-950/20 rounded-full border border-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg tracking-wide flex items-center gap-1.5">
                PlayBuddy AI
                <Sparkles className="w-4 h-4 fill-amber-200 text-amber-200" />
              </h3>
              <p className="text-xs text-amber-100 font-medium">Your Personal Game Recommender</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm shadow-md ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-br-none font-medium'
                    : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
              </div>

              {m.gameRecommendation && (
                <div className="mt-2 ml-1 p-3 bg-slate-900 border border-amber-500/40 rounded-xl shadow-lg flex items-center justify-between gap-3 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-extrabold text-white">{m.gameRecommendation.title}</p>
                      <p className="text-[10px] text-sky-400 font-semibold">{m.gameRecommendation.category}</p>
                    </div>
                  </div>
                  <Link
                    href={`/play/${m.gameRecommendation.slug}`}
                    onClick={onClose}
                    className="px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs rounded-full shadow transition-all whitespace-nowrap"
                  >
                    PLAY NOW
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type e.g. 'Show me 3D racing' or 'Mahjong'..."
            className="flex-1 px-4 py-2.5 rounded-full bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 placeholder-slate-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
