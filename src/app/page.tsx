'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MoodSelector } from '@/components/MoodSelector';
import { SanctuaryCard } from '@/components/SanctuaryCard';
import { DisconnectModal } from '@/components/DisconnectModal';
import { SanctuaryRecord, INITIAL_SANCTUARIES } from '@/db/sanctuaries-data';
import { chime } from '@/lib/audio';
import {
  Compass,
  Sparkles,
  TreePine,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Cpu,
  Database,
  GitCommit,
} from 'lucide-react';

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(10);
  const [isDisconnectOpen, setIsDisconnectOpen] = useState<boolean>(false);

  // Current Sanctuary & Mission state
  const [currentSanctuary, setCurrentSanctuary] = useState<SanctuaryRecord>(INITIAL_SANCTUARIES[0]);
  const [alternatives, setAlternatives] = useState<SanctuaryRecord[]>(INITIAL_SANCTUARIES.slice(1, 3));
  const [sensoryMission, setSensoryMission] = useState({
    title: 'The Dense Tree Canopy Grounding Protocol',
    location: INITIAL_SANCTUARIES[0].name,
    targetDurationMins: 10,
    instructions: [
      `Walk unhurriedly to ${INITIAL_SANCTUARIES[0].name} without checking your email or notifications.`,
      'Sit on the stone perimeter with eyes closed for 3 minutes, listening to leaves rustle.',
      'Touch the cool moss on the stone well to register physical tactile grounding.',
      'Count 10 deep belly breaths before standing up.',
    ],
    lockoutMessage: 'Put your phone into your pocket or backpack now. Look up at the canopy. Step outside.',
  });
  const [dataSource, setDataSource] = useState<string>('Local Fast Vector Engine');

  // Check initial backend health & database connection
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/agent');
        if (res.ok) {
          const json = await res.json();
          if (json.vectorDatabase?.includes('Tiger Data')) {
            setDbConnected(true);
          }
        }
      } catch (err) {
        // In local mode without server, defaults are active
      }
    }
    checkHealth();
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    chime.enabled = next;
    if (next) {
      chime.playZenChime('tick');
    }
  };

  const handleSearch = async (params: {
    mood: string;
    minutes: number;
    needQuiet: boolean;
    coordinates?: { lat: number; lng: number };
  }) => {
    setIsLoading(true);
    setSelectedMinutes(params.minutes);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: params.mood,
          minutes: params.minutes,
          needQuiet: params.needQuiet,
          coordinates: params.coordinates,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCurrentSanctuary(json.data.sanctuary);
          setAlternatives(json.data.alternatives || []);
          setSensoryMission(json.data.sensoryMission);
          setDataSource(
            json.data.dataSource === 'live_osm_gps'
              ? 'Live Nearby GPS (OpenStreetMap)'
              : json.meta?.databaseConnected
              ? 'Tiger Data (PostgreSQL + pgvector)'
              : 'Local Vector Engine'
          );
          if (json.meta?.databaseConnected) {
            setDbConnected(true);
          }
        }
      }
    } catch (err) {
      console.warn('Discovery API call failed, falling back to local dataset:', err);
    } finally {
      setIsLoading(false);
      chime.playZenChime('tick');
    }
  };

  const handleSelectAlternative = (alt: SanctuaryRecord) => {
    setCurrentSanctuary(alt);
    setSensoryMission({
      title: `The ${alt.sensory_features[0]?.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Nature'} Grounding Protocol`,
      location: alt.name,
      targetDurationMins: selectedMinutes,
      instructions: [
        `Walk unhurriedly to ${alt.name} without looking at navigation maps unless necessary.`,
        `Find a resting spot near the ${alt.sensory_features[0] || 'greenery'} and pause for 5 minutes.`,
        `Notice how the ambient light filters through the environment.`,
        `Resist taking photos—absorb the spot purely through memory.`,
      ],
      lockoutMessage: 'Put your phone into your pocket or backpack now. Look up at the canopy. Step outside.',
    });
    chime.playZenChime('tick');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1312] text-emerald-100">
      {/* Top Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        dbConnected={dbConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-10 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-800/40 text-emerald-300 text-xs font-mono shadow-sm">
            <TreePine className="w-3.5 h-3.5 text-emerald-400" />
            Outdoor Micro-Sanctuary Discovery &bull; Touch Grass
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-emerald-50 tracking-tight font-normal">
            Escape screen fatigue in 30 seconds.
          </h1>
          <p className="text-sm sm:text-base text-emerald-300/70 max-w-2xl mx-auto leading-relaxed">
            Verdant discovers secluded micro-sanctuaries within a 5-to-15 minute walk,
            gives you a restorative tactile sensory mission, and locks your screen so you can
            physically step outside.
          </p>
        </div>

        {/* Step 1: Input Form */}
        <section aria-label="Mood Selector">
          <MoodSelector onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Step 2: Instant Recommendation */}
        <section aria-label="Micro-Sanctuary Recommendation">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-medium">
              Step 2 • Instant Recommendation
            </span>
            <span className="text-[11px] font-mono text-emerald-500/70">
              Source: {dataSource}
            </span>
          </div>

          <SanctuaryCard
            sanctuary={currentSanctuary}
            alternatives={alternatives}
            sensoryMission={sensoryMission}
            onSelectAlternative={handleSelectAlternative}
            onStartDisconnect={() => setIsDisconnectOpen(true)}
            dataSource={dataSource}
          />
        </section>

        {/* Technology Architecture Showcase */}
        <section
          aria-label="Technology Architecture"
          className="glass-panel rounded-2xl p-6 border border-emerald-950/80 mt-12 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            <Terminal className="w-4 h-4 text-emerald-300" />
            Core Technology Architecture
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Mastra Card */}
            <div className="p-4 rounded-xl bg-[#13211d]/70 border border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-200 font-medium text-sm">
                <Cpu className="w-4 h-4 text-emerald-400" />
                1. Mastra Framework
              </div>
              <p className="text-xs text-emerald-300/70 leading-relaxed font-sans">
                TypeScript agent orchestration using <code className="text-emerald-300">@mastra/core</code>,
                tools for semantic spatial retrieval, and dynamic screen-free sensory mindfulness prompt synthesis.
              </p>
            </div>

            {/* Tiger Data Card */}
            <div className="p-4 rounded-xl bg-[#13211d]/70 border border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-200 font-medium text-sm">
                <Database className="w-4 h-4 text-emerald-400" />
                2. Tiger Data (pgvector)
              </div>
              <p className="text-xs text-emerald-300/70 leading-relaxed font-sans">
                PostgreSQL cloud instance indexing micro-sanctuaries with 768-dimensional vector embeddings and
                sub-millisecond <code className="text-emerald-300">&lt;=&gt;</code> cosine distance queries.
              </p>
            </div>

            {/* Entire CLI Card */}
            <div className="p-4 rounded-xl bg-[#13211d]/70 border border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-200 font-medium text-sm">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                3. Entire CLI Checkpoints
              </div>
              <p className="text-xs text-emerald-300/70 leading-relaxed font-sans">
                Configured via <code className="text-emerald-300">entire.yaml</code> to capture development
                checkpoints and agent runtime execution traces.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Disconnect Lockout Modal */}
      <DisconnectModal
        isOpen={isDisconnectOpen}
        onClose={() => setIsDisconnectOpen(false)}
        sanctuaryName={currentSanctuary.name}
        sanctuaryId={currentSanctuary.id}
        initialMinutes={selectedMinutes}
        sensoryMissionTitle={sensoryMission.title}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Footer */}
      <footer className="w-full border-t border-emerald-950/60 py-6 text-center text-xs text-emerald-600/70 font-mono">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Verdant &bull; AI Micro-Sanctuary Discovery &amp; Disconnect Companion
          </div>
          <div className="flex items-center gap-4 text-emerald-500/80">
            <span>Mastra</span>
            <span>&bull;</span>
            <span>Tiger Data</span>
            <span>&bull;</span>
            <span>Entire</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
