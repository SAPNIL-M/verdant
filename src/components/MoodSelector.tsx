'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  EyeOff,
  Waves,
  TreePine,
  Wind,
  Clock,
  ArrowRight,
  Sliders,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export interface MoodPreset {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
  recommendedMinutes: number;
  highlightColor: string;
}

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'fatigue',
    label: 'Screen Glare & Fatigue',
    icon: <EyeOff className="w-4 h-4" />,
    prompt: 'Severe screen glare fatigue, tight eyes and neck, need deep soothing shade and lush greenery',
    recommendedMinutes: 10,
    highlightColor: 'from-emerald-900/40 to-teal-950/40 border-emerald-500/40 text-emerald-200',
  },
  {
    id: 'sunlight',
    label: 'Need Sunlight & Warmth',
    icon: <Sun className="w-4 h-4" />,
    prompt: 'Stuck indoors in artificial light, need bright direct sun, warm stone surfaces, and open horizon',
    recommendedMinutes: 15,
    highlightColor: 'from-amber-950/40 to-orange-950/40 border-amber-500/40 text-amber-200',
  },
  {
    id: 'overload',
    label: 'Overthinking & Noise',
    icon: <Waves className="w-4 h-4" />,
    prompt: 'Mental racing from debugging code, need flowing fountain or creek water sound to drown thoughts',
    recommendedMinutes: 15,
    highlightColor: 'from-cyan-950/40 to-blue-950/40 border-cyan-500/40 text-cyan-200',
  },
  {
    id: 'solitude',
    label: 'Quiet Solitude',
    icon: <TreePine className="w-4 h-4" />,
    prompt: 'Social and digital burnout, need hidden secluded bench under ancient trees with zero foot traffic',
    recommendedMinutes: 10,
    highlightColor: 'from-emerald-950/40 to-stone-900/40 border-emerald-600/40 text-emerald-100',
  },
  {
    id: 'breeze',
    label: 'Breeze & Aromatic Air',
    icon: <Wind className="w-4 h-4" />,
    prompt: 'Need fresh air circulation, mountain breeze, aromatic pine needle or chamomile scent',
    recommendedMinutes: 20,
    highlightColor: 'from-teal-950/40 to-emerald-900/40 border-teal-500/40 text-teal-200',
  },
];

interface MoodSelectorProps {
  onSearch: (params: {
    mood: string;
    minutes: number;
    needQuiet: boolean;
    coordinates?: { lat: number; lng: number };
  }) => void;
  isLoading: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onSearch, isLoading }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('fatigue');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [minutes, setMinutes] = useState<number>(10);
  const [needQuiet, setNeedQuiet] = useState<boolean>(true);
  const [showCustom, setShowCustom] = useState<boolean>(false);

  // Live GPS Location State
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [showCityInput, setShowCityInput] = useState<boolean>(false);
  const [cityQuery, setCityQuery] = useState<string>('');

  const fetchIpLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          const coords = { lat: data.latitude, lng: data.longitude };
          setCoordinates(coords);
          const loc = data.city || data.region || 'Local area';
          setLocationName(loc);
          setLocationNotice(`Connected to ${loc} via IP. Real nearby parks will be discovered.`);
          return coords;
        }
      }
    } catch (e) {
      // IP lookup failed
    }
    return null;
  };

  const handleToggleLocation = () => {
    if (coordinates) {
      setCoordinates(null);
      setLocationName(null);
      setLocationNotice(null);
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCoordinates(coords);
          setLocationName('GPS Position');
          setLocationNotice('Live GPS connected. Real physical parks will be discovered nearby.');
        },
        async (err) => {
          // If browser GPS was denied or timed out, seamlessly fall back to IP-based location
          const ipCoords = await fetchIpLocation();
          setIsLocating(false);
          if (!ipCoords) {
            setLocationNotice('Location unavailable. Type your city or use curated nature sanctuaries.');
          }
        },
        { timeout: 10000, enableHighAccuracy: false, maximumAge: 300000 }
      );
    } else {
      fetchIpLocation().then((coords) => {
        setIsLocating(false);
        if (!coords) {
          setLocationNotice('Location not supported. Type your city or use curated fallback.');
        }
      });
    }
  };

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityQuery.trim()) return;

    setIsLocating(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(cityQuery.trim())}&limit=1`);
      if (res.ok) {
        const json = await res.json();
        const first = json.features?.[0];
        if (first?.geometry?.coordinates) {
          const [lon, lat] = first.geometry.coordinates;
          const foundName = first.properties?.name || first.properties?.city || cityQuery.trim();
          setCoordinates({ lat, lng: lon });
          setLocationName(foundName);
          setLocationNotice(`Connected to "${foundName}". Real nearby parks will be discovered!`);
          setShowCityInput(false);
          setIsLocating(false);
          return;
        }
      }
      setLocationNotice(`Could not locate "${cityQuery}". Try another city name or GPS.`);
    } catch (err) {
      setLocationNotice('City search failed. Please try again or toggle GPS.');
    } finally {
      setIsLocating(false);
    }
  };

  const handlePresetClick = (preset: MoodPreset) => {
    setSelectedPreset(preset.id);
    setMinutes(preset.recommendedMinutes);
    if (!showCustom) {
      setCustomPrompt('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const preset = MOOD_PRESETS.find((p) => p.id === selectedPreset);
    const activePrompt = customPrompt.trim() !== '' ? customPrompt : (preset?.prompt || 'need quiet nature spot');

    let activeCoords = coordinates;

    // If 30-min option is picked and coordinates not yet established, auto-resolve location via IP so a real park is shown!
    if (!activeCoords && minutes >= 30) {
      setIsLocating(true);
      const ipCoords = await fetchIpLocation();
      if (ipCoords) {
        activeCoords = ipCoords;
      }
      setIsLocating(false);
    }

    onSearch({
      mood: activePrompt,
      minutes,
      needQuiet,
      coordinates: activeCoords || undefined,
    });
  };

  const durationOptions = [5, 10, 15, 20, 30];

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 transition-all duration-300">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block font-medium">
            Step 1 • 3-Second Input
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-emerald-100 tracking-tight">
            How is your nervous system right now?
          </h2>
        </div>

        {/* Action Toggles: Live GPS, City Search & Custom Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live GPS Button */}
          <button
            type="button"
            onClick={handleToggleLocation}
            disabled={isLocating}
            className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-mono transition-all duration-200 cursor-pointer ${
              coordinates
                ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/60 shadow-sm'
                : 'bg-emerald-950/40 text-emerald-400/80 border-emerald-800/40 hover:bg-emerald-900/40 hover:text-emerald-300'
            }`}
            title="Click to search real parks and green spaces near your actual GPS location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : coordinates ? 'text-emerald-400' : ''}`} />
            {isLocating ? (
              <span>Locating...</span>
            ) : coordinates ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {locationName || 'Live Location'}
              </span>
            ) : (
              <span>Use Live GPS</span>
            )}
          </button>

          {/* City Search Toggle Button */}
          <button
            type="button"
            onClick={() => setShowCityInput(!showCityInput)}
            className="text-xs px-2 py-1.5 rounded-lg bg-emerald-950/30 text-emerald-400/80 hover:text-emerald-300 flex items-center gap-1 font-mono transition-colors border border-emerald-900/40 cursor-pointer"
            title="Search for a specific city or neighborhood"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>City/Area</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="text-xs px-2 py-1.5 rounded-lg bg-emerald-950/30 text-emerald-400/80 hover:text-emerald-300 flex items-center gap-1 font-mono transition-colors border border-emerald-900/40"
          >
            <Sliders className="w-3.5 h-3.5" />
            {showCustom ? 'Presets' : 'Custom'}
          </button>
        </div>
      </div>

      {/* Collapsible City / Neighborhood Geocoding Bar */}
      {showCityInput && (
        <form onSubmit={handleCitySearch} className="mb-4 flex items-center gap-2">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="Type city or area (e.g. Bangalore, London, Connaught Place, Soho)..."
            className="flex-1 bg-[#13201c] border border-emerald-700/60 rounded-xl px-3 py-1.5 text-xs font-mono text-emerald-100 placeholder:text-emerald-600/70 focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={isLocating || !cityQuery.trim()}
            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-xs font-mono text-emerald-100 border border-emerald-600 cursor-pointer disabled:opacity-50"
          >
            {isLocating ? 'Searching...' : 'Locate'}
          </button>
        </form>
      )}

      {/* Optional Location Notice Banner */}
      {locationNotice && (
        <div className={`mb-4 px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border ${
          coordinates
            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
            : 'bg-stone-900/80 text-stone-300 border-stone-800'
        }`}>
          {coordinates ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span>{locationNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Presets Grid */}
        {!showCustom ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {MOOD_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-br ${preset.highlightColor} ring-1 ring-emerald-400/40 shadow-lg`
                      : 'bg-[#15221e]/60 border-emerald-950/80 text-emerald-200/70 hover:bg-[#1b2b26]/70 hover:border-emerald-800/40'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-emerald-900/60 text-emerald-200' : 'bg-emerald-950/40 text-emerald-400/60'
                    }`}
                  >
                    {preset.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium leading-snug">{preset.label}</div>
                    <div className="text-[11px] text-emerald-400/50 mt-0.5 line-clamp-1">
                      {preset.prompt}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. My eyes burn from 6 hours of PR reviews, need shade, bamboo, and silent seating..."
              rows={2}
              className="w-full bg-[#13201c] border border-emerald-800/40 rounded-xl p-3 text-sm text-emerald-100 placeholder:text-emerald-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
            />
          </div>
        )}

        {/* Walk Minutes & Quiet Controls */}
        <div className="pt-2 border-t border-emerald-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Minutes Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-300/80 font-mono flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Available Walk:
            </span>
            <div className="flex items-center gap-1.5">
              {durationOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setMinutes(mins)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                    minutes === mins
                      ? 'bg-emerald-800/60 text-emerald-100 border-emerald-500/60 font-semibold'
                      : 'bg-emerald-950/40 text-emerald-400/60 border-emerald-900/40 hover:text-emerald-300'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
            {minutes === 30 && (
              <span className="text-[11px] font-mono text-teal-300 hidden sm:inline-block">
                • Closest real park nearby guaranteed
              </span>
            )}
          </div>

          {/* Quiet Preference Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={needQuiet}
              onChange={(e) => setNeedQuiet(e.target.checked)}
              className="w-4 h-4 rounded border-emerald-800 bg-emerald-950 text-emerald-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500"
            />
            <span className="text-xs text-emerald-300/80 font-mono">
              Prioritize &gt;4★ Quiet Score
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-stone-900" />
              <span>
                {coordinates ? 'Searching Live GPS & Mastra Agent...' : 'Querying Tiger Data pgvector & Mastra Agent...'}
              </span>
            </>
          ) : (
            <>
              <span>
                {coordinates ? 'Find Real Nearby Nature Spots' : 'Find Micro-Sanctuary'}
              </span>
              <ArrowRight className="w-4 h-4 text-stone-900" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
