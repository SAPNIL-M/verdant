'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  TreePine,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { chime } from '@/lib/audio';

interface DisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  sanctuaryName: string;
  sanctuaryId?: number;
  initialMinutes: number;
  sensoryMissionTitle: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const MINDFUL_PROMPTS = [
  'Put your phone in your pocket or bag. Step out into the air.',
  'Look up at the canopy. Allow your eyes to rest on distant foliage.',
  'Notice the contrast between the air on your face and your breath.',
  'Listen closely until you can distinguish three natural sounds.',
  'Walk at a pace you would choose if you had nowhere to rush to.',
  'Touch the cool bark or stone. Feel the physical world ground you.',
];

export const DisconnectModal: React.FC<DisconnectModalProps> = ({
  isOpen,
  onClose,
  sanctuaryName,
  sanctuaryId = 1,
  initialMinutes,
  sensoryMissionTitle,
  soundEnabled,
  onToggleSound,
}) => {
  const totalSeconds = initialMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [isUltraDimmed, setIsUltraDimmed] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [reflectionNotes, setReflectionNotes] = useState<string>('');
  const [hasLoggedSession, setHasLoggedSession] = useState<boolean>(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(initialMinutes * 60);
      setIsRunning(true);
      setIsFinished(false);
      setIsUltraDimmed(false);
      setHasLoggedSession(false);
      // Play initial meditative gong
      chime.playZenChime('start');
    }
  }, [isOpen, initialMinutes]);

  // Main countdown interval
  useEffect(() => {
    if (!isOpen || !isRunning || isFinished) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          setIsFinished(true);
          chime.playZenChime('complete');
          return 0;
        }

        // Halfway gong reminder
        if (prev === Math.floor(totalSeconds / 2)) {
          chime.playZenChime('tick');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isRunning, isFinished, totalSeconds]);

  // Prompt rotator interval
  useEffect(() => {
    if (!isOpen) return;
    const promptTimer = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % MINDFUL_PROMPTS.length);
    }, 12000);

    return () => clearInterval(promptTimer);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  const handleFinishAndSave = async () => {
    if (!hasLoggedSession) {
      try {
        await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'complete_session',
            sanctuaryId,
            minutes: initialMinutes,
            notes: reflectionNotes || 'Touch grass walk completed',
          }),
        });
        setHasLoggedSession(true);
      } catch (err) {
        console.warn('Could not record session to database:', err);
      }
    }
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-700 flex flex-col items-center justify-between p-6 select-none ${
        isUltraDimmed
          ? 'bg-black text-stone-600'
          : 'bg-[#060c0a] text-emerald-100'
      }`}
    >
      {/* Ambient Breathing Glow */}
      {!isUltraDimmed && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-950/25 rounded-full blur-[140px] animate-breathe" />
        </div>
      )}

      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <TreePine className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400/80 uppercase tracking-widest font-medium">
            Disconnect Lockout &bull; {sanctuaryName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Dim screen toggle */}
          <button
            onClick={() => setIsUltraDimmed(!isUltraDimmed)}
            className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300/80 transition-colors"
            title={isUltraDimmed ? 'Restore Brightness' : 'Ultra Dim Screen'}
          >
            {isUltraDimmed ? (
              <Eye className="w-4 h-4 text-emerald-400" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300/80 transition-colors"
            title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-emerald-700" />
            )}
          </button>

          {/* Close/Exit */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300/80 hover:text-emerald-100 transition-colors"
            title="Exit Disconnect Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Countdown Display */}
      <div className="flex flex-col items-center justify-center my-auto text-center relative z-10 max-w-md w-full">
        {!isFinished ? (
          <>
            {/* Circular Timer Ring */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-emerald-950/80"
                  strokeWidth="3.5"
                  fill="none"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-emerald-400 transition-all duration-1000 ease-linear"
                  strokeWidth="3.5"
                  strokeDasharray={276.46}
                  strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* Digits in Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-5xl sm:text-6xl font-light text-emerald-50 tracking-tighter">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-mono text-emerald-400/60 uppercase tracking-widest mt-1">
                  Offline Sanctuary Time
                </span>
              </div>
            </div>

            {/* Mindful Prompt Carousel */}
            <div className="min-h-[64px] flex items-center justify-center px-4">
              <p className="text-sm sm:text-base font-serif italic text-emerald-200/90 leading-relaxed transition-all duration-500">
                &ldquo;{MINDFUL_PROMPTS[promptIndex]}&rdquo;
              </p>
            </div>

            {/* Sub-label */}
            <p className="text-xs text-emerald-400/50 font-mono mt-3">
              Mission: {sensoryMissionTitle}
            </p>

            {/* Play/Pause & Reset Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-3.5 rounded-full bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700/50 text-emerald-100 transition-all active:scale-95"
                title={isRunning ? 'Pause' : 'Resume'}
              >
                {isRunning ? (
                  <Pause className="w-5 h-5 text-emerald-300" />
                ) : (
                  <Play className="w-5 h-5 text-emerald-300 fill-emerald-300" />
                )}
              </button>
              <button
                onClick={() => {
                  setSecondsRemaining(totalSeconds);
                  setIsRunning(true);
                }}
                className="p-3.5 rounded-full bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-400 transition-all active:scale-95"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Finished State */
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 w-full animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-300">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif text-emerald-50">
              Welcome back to the digital realm.
            </h3>
            <p className="text-xs text-emerald-300/80 mt-1 font-sans">
              You completed your {initialMinutes}-minute disconnect at {sanctuaryName}.
            </p>

            {/* Quick reflection input */}
            <div className="mt-4 text-left">
              <label className="text-[11px] font-mono text-emerald-400/80 block mb-1">
                Optional: What sensory detail did you notice?
              </label>
              <input
                type="text"
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="e.g. Smell of damp pine, watched sparrows drink..."
                className="w-full bg-[#101b17] border border-emerald-800/50 rounded-lg p-2.5 text-xs text-emerald-100 placeholder:text-emerald-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleFinishAndSave}
              className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-950 cursor-pointer"
            >
              Complete &amp; Return to Workspace
            </button>
          </div>
        )}
      </div>

      {/* Bottom Lock Reminder */}
      <div className="w-full max-w-md text-center relative z-10">
        <p className="text-[11px] font-mono text-emerald-500/60">
          Tip: You can lock your device screen now. The time will continue offline.
        </p>
      </div>
    </div>
  );
};
