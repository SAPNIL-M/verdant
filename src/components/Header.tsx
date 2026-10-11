'use client';

import React from 'react';
import { Compass, Volume2, VolumeX, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { chime } from '@/lib/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  dbConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  dbConnected,
}) => {
  return (
    <header className="w-full border-b border-emerald-950/60 bg-[#0d1312]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-800/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Compass className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg text-emerald-100 tracking-tight">
                Verdant
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                Offline Companion
              </span>
            </div>
            <p className="text-xs text-emerald-400/60 hidden sm:block">
              AI Micro-Sanctuary Discovery &amp; Disconnect Companion
            </p>
          </div>
        </div>

        {/* Technology Badges & Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300/80 border border-emerald-800/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Mastra Agent
            </span>
            <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              dbConnected 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' 
                : 'bg-stone-900/80 text-stone-400 border-stone-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
              Tiger Data (pgvector)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300/80 border border-emerald-800/40">
              Entire CLI
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Zen Chime' : 'Enable Zen Chime'}
            className="p-2 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/30 text-emerald-300/80 hover:text-emerald-200 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {/* Screen Time Badge */}
          <div className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40 hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse" />
            Target: &lt;30s on screen
          </div>
        </div>
      </div>
    </header>
  );
};
