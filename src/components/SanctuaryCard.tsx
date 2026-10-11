'use client';

import React, { useState } from 'react';
import { SanctuaryRecord } from '@/db/sanctuaries-data';
import {
  MapPin,
  Footprints,
  SunDim,
  Volume2,
  TreePine,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  SmartphoneNfc,
  Lock,
  Navigation,
  ExternalLink,
} from 'lucide-react';

interface SanctuaryCardProps {
  sanctuary: SanctuaryRecord;
  alternatives: SanctuaryRecord[];
  sensoryMission: {
    title: string;
    location: string;
    targetDurationMins: number;
    instructions: string[];
    lockoutMessage: string;
  };
  onSelectAlternative: (sanctuary: SanctuaryRecord) => void;
  onStartDisconnect: () => void;
  dataSource: string;
}

export const SanctuaryCard: React.FC<SanctuaryCardProps> = ({
  sanctuary,
  alternatives,
  sensoryMission,
  onSelectAlternative,
  onStartDisconnect,
  dataSource,
}) => {
  const [showAlternatives, setShowAlternatives] = useState<boolean>(false);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'pocket_park':
        return 'Pocket Park';
      case 'quiet_bench':
        return 'Solitary Bench';
      case 'botanical_corner':
        return 'Botanical Nook';
      case 'urban_grove':
        return 'Urban Grove';
      case 'rooftop_garden':
        return 'Open Rooftop';
      default:
        return 'Micro-Sanctuary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Matched Sanctuary Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-emerald-500/25 relative overflow-hidden shadow-2xl">
        {/* Soft Ambient Background Blob */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Card Header & Badges */}
        <div className="flex flex-wrap items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider uppercase bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                {getCategoryLabel(sanctuary.category)}
              </span>
              <span className="text-[11px] font-mono text-emerald-300/70 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {sanctuary.neighborhood}
              </span>
              {sanctuary.latitude && sanctuary.longitude && (
                <span className="text-[10px] font-mono text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-700/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                  Live GPS
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-emerald-50 tracking-tight">
              {sanctuary.name}
            </h2>
          </div>

          {/* Walk time & distance badge */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-950/80 border border-emerald-700/40 rounded-xl px-3 py-2 text-right">
              <div className="flex items-center gap-1 text-emerald-300 text-sm font-semibold">
                <Footprints className="w-4 h-4 text-emerald-400" />
                {sanctuary.estimated_walk_mins <= 30
                  ? `${sanctuary.estimated_walk_mins} min walk`
                  : `${sanctuary.estimated_walk_mins}m walk (~${Math.max(5, Math.round(sanctuary.estimated_walk_mins * 0.3))}m bike)`}
              </div>
              <div className="text-[10px] text-emerald-400/60 font-mono mt-0.5">
                {sanctuary.distance !== undefined
                  ? `Match: ${Math.round((1 - sanctuary.distance) * 100)}%`
                  : 'Vector match'}
              </div>
            </div>
          </div>
        </div>

        {/* Ambiance Description */}
        <p className="mt-4 text-sm sm:text-base text-emerald-200/80 leading-relaxed font-sans relative z-10">
          {sanctuary.ambiance_description}
        </p>

        {/* Environmental Ratings & Sensory Pills */}
        <div className="mt-5 pt-4 border-t border-emerald-950/80 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {/* Ratings */}
          <div className="flex items-center gap-5 text-xs font-mono text-emerald-300/70">
            <div>
              <span className="text-emerald-400/60 block mb-0.5">Shade Rating:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SunDim
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < sanctuary.shade_rating
                        ? 'text-emerald-400 fill-emerald-400/40'
                        : 'text-emerald-950'
                    }`}
                  />
                ))}
                <span className="ml-1 text-emerald-200 font-semibold">{sanctuary.shade_rating}/5</span>
              </div>
            </div>
            <div>
              <span className="text-emerald-400/60 block mb-0.5">Quiet Rating:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Volume2
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < sanctuary.quiet_rating
                        ? 'text-teal-400 fill-teal-400/40'
                        : 'text-emerald-950'
                    }`}
                  />
                ))}
                <span className="ml-1 text-teal-200 font-semibold">{sanctuary.quiet_rating}/5</span>
              </div>
            </div>
          </div>

          {/* Sensory Tags */}
          <div className="flex flex-wrap gap-1.5 items-center sm:justify-end">
            {sanctuary.sensory_features.map((feature, idx) => (
              <span
                key={idx}
                className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-emerald-900/30 text-emerald-200 border border-emerald-800/40"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Sensory Mission Box */}
        <div className="mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#12221c]/90 to-[#0e1b16]/90 border border-emerald-600/30 relative z-10">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Outdoor Sensory Mission • Screen-Free Protocol
          </div>
          <h3 className="text-base sm:text-lg font-medium text-emerald-100">
            {sensoryMission.title}
          </h3>

          <ul className="mt-3 space-y-2 text-xs sm:text-sm text-emerald-200/80">
            {sensoryMission.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-800/40 flex items-center gap-2.5 text-xs font-mono text-emerald-300">
            <SmartphoneNfc className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{sensoryMission.lockoutMessage}</span>
          </div>

          {sanctuary.latitude && sanctuary.longitude && (
            <div className="mt-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${sanctuary.latitude},${sanctuary.longitude}&travelmode=${sanctuary.estimated_walk_mins > 45 ? 'bicycling' : 'walking'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/50 text-xs font-mono text-emerald-300 hover:text-emerald-100 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {sanctuary.estimated_walk_mins > 35
                    ? 'Open Route & Directions in Google Maps'
                    : 'Open Real Walking Route in Google Maps'}
                </span>
                <ExternalLink className="w-3 h-3 text-emerald-500" />
              </a>
            </div>
          )}
        </div>

        {/* The Touch Grass Disconnect Button */}
        <div className="mt-6 relative z-10">
          <button
            onClick={onStartDisconnect}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/80 transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            <Lock className="w-5 h-5 text-stone-950" />
            <span>Start Walk &amp; Disconnect Mode</span>
          </button>
          <p className="text-center text-[11px] text-emerald-400/60 mt-2 font-mono">
            Activates fullscreen darkened timer &bull; Screen shuts down so you can touch grass
          </p>
        </div>
      </div>

      {/* Alternatives Toggle */}
      {alternatives && alternatives.length > 0 && (
        <div className="glass-panel-subtle rounded-xl p-3 border border-emerald-950">
          <button
            type="button"
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="w-full flex items-center justify-between text-xs font-mono text-emerald-400/80 hover:text-emerald-300 transition-colors py-1 px-2"
          >
            <span>
              {showAlternatives ? 'Hide' : 'View'} {alternatives.length} Alternative Micro-Sanctuaries
            </span>
            {showAlternatives ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAlternatives && (
            <div className="mt-3 space-y-2 pt-2 border-t border-emerald-950/60">
              {alternatives.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => onSelectAlternative(alt)}
                  className="p-3 rounded-lg bg-[#14231f]/70 hover:bg-[#1a2f29] border border-emerald-900/30 cursor-pointer transition-all flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-medium text-emerald-100">{alt.name}</h4>
                    <p className="text-[11px] text-emerald-400/60 mt-0.5">
                      {alt.neighborhood} &bull; {alt.sensory_features.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-emerald-300 flex items-center gap-1 shrink-0">
                    <Footprints className="w-3.5 h-3.5" />
                    {alt.estimated_walk_mins}m
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
