import { Agent } from '@mastra/core/agent';
import { searchSanctuariesTool } from '../tools/searchSanctuaries';
import { generateSensoryMissionTool } from '../tools/sensoryMission';
import { SanctuaryRecord } from '../../db/sanctuaries-data';
import { fetchLiveNearbySanctuaries } from '../../lib/osm';
import { getEmbedding, cosineSimilarity } from '../../lib/embeddings';

export const VERDANT_AGENT_INSTRUCTIONS = `You are Verdant, an outdoor disconnect companion and micro-sanctuary guide.
Your mission is to cure screen fatigue and cognitive overload for software engineers and knowledge workers by recommending nearby peaceful nature spots within a 5-15 minute walk.

CRITICAL RULES:
1. Prioritize screen-time minimization above all else. The user must be looking at the screen for under 30 seconds.
2. Discover the top micro-sanctuary from live GPS locations or Tiger Data pgvector based on the user's mood, walking limit, and quiet needs.
3. Use generateSensoryMissionTool to generate a tactile, screen-free sensory mindfulness mission for the destination.
4. Keep all explanations grounded, restorative, concise, and devoid of screen distractions.
5. Emphasize activating Disconnect Mode, pocketing the phone, and stepping outside immediately.`;

export const verdantAgent = new Agent({
  id: 'verdantAgent',
  name: 'verdantAgent',
  instructions: VERDANT_AGENT_INSTRUCTIONS,
  model: 'google/gemini-2.5-flash',
  tools: {
    searchSanctuariesTool,
    generateSensoryMissionTool,
  },
});

export const groundTraceAgent = verdantAgent;
export const GROUNDTRACE_AGENT_INSTRUCTIONS = VERDANT_AGENT_INSTRUCTIONS;

export interface VerdantResponse {
  sanctuary: SanctuaryRecord;
  alternatives: SanctuaryRecord[];
  sensoryMission: {
    title: string;
    location: string;
    targetDurationMins: number;
    instructions: string[];
    lockoutMessage: string;
  };
  agentSummary: string;
  dataSource: 'live_osm_gps' | 'tiger_data_pgvector' | 'in_memory_vector_engine';
  executionTimeMs: number;
  mastra: {
    agentName: string;
    framework: string;
    model: string;
    toolsUsed: string[];
  };
}

export type GroundTraceResponse = VerdantResponse;

/**
 * High-performance orchestrator for Verdant agent pipeline.
 * Discovers live GPS spots or queries Tiger Data pgvector, then runs sensory mission synthesis.
 */
export async function runGroundTraceDiscovery(params: {
  mood: string;
  maxWalkMins: number;
  needQuiet?: boolean;
  coordinates?: { lat: number; lng: number };
}): Promise<VerdantResponse> {
  const startTime = Date.now();
  const { mood, maxWalkMins, needQuiet = true, coordinates } = params;

  let primary: SanctuaryRecord | null = null;
  let alternatives: SanctuaryRecord[] = [];
  let dataSource: VerdantResponse['dataSource'] = 'tiger_data_pgvector';

  // 1. If live GPS coordinates provided, attempt live OpenStreetMap discovery first
  if (coordinates && typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number') {
    try {
      const liveSpots = await fetchLiveNearbySanctuaries(coordinates.lat, coordinates.lng, 8);
      if (liveSpots.length > 0) {
        // Rank live spots by cosine similarity against user's mood
        const moodVec = await getEmbedding(mood);
        const scoredLiveSpots = liveSpots.map((spot) => {
          const sim = spot.embedding ? cosineSimilarity(moodVec, spot.embedding) : 0.5;
          return {
            ...spot,
            distance: Number((1 - sim).toFixed(4)),
          };
        });

        // Prioritize proximity and mood similarity
        // Ensures the closest physical green spaces are always favored without dropping them
        scoredLiveSpots.sort((a, b) => {
          const scoreA = (a.estimated_walk_mins / 60) * 0.6 + (a.distance ?? 0.5) * 0.4;
          const scoreB = (b.estimated_walk_mins / 60) * 0.6 + (b.distance ?? 0.5) * 0.4;
          return scoreA - scoreB;
        });

        // Always show real nearby park regardless of whether it's within or beyond 30 mins
        primary = scoredLiveSpots[0];
        alternatives = scoredLiveSpots.slice(1, 4);
        dataSource = 'live_osm_gps';
      }
    } catch (liveError) {
      console.warn('Live location discovery failed, falling back to database sanctuaries:', liveError);
    }
  }

  // 2. Fallback to Tiger Data pgvector (or seeded demo sanctuaries) if no live spot picked
  if (!primary) {
    const searchResult = await (searchSanctuariesTool as any).execute({
      userRequest: mood,
      maxWalkMins,
      needQuiet,
    });

    primary = searchResult?.primarySanctuary;
    alternatives = searchResult?.alternatives || [];
    dataSource = primary?.distance !== undefined ? 'tiger_data_pgvector' : 'in_memory_vector_engine';
  }

  if (!primary) {
    throw new Error('No micro-sanctuaries found within walking range.');
  }

  // 3. Execute sensory mission generator tool
  const missionResult = await (generateSensoryMissionTool as any).execute({
    sanctuaryName: primary.name,
    category: primary.category,
    sensoryFeatures: primary.sensory_features,
    mood,
    availableMins: primary.estimated_walk_mins || maxWalkMins,
  });

  // 4. Synthesize restorative summary
  const walkNote = `${primary.estimated_walk_mins} min walk away in ${primary.neighborhood}`;
  const summary = `Found your micro-sanctuary: ${primary.name} (${walkNote}). ${primary.ambiance_description} Your screen interaction is complete. Slip your device away and step into the green.`;

  return {
    sanctuary: primary,
    alternatives,
    sensoryMission: missionResult,
    agentSummary: summary,
    dataSource,
    executionTimeMs: Date.now() - startTime,
    mastra: {
      agentName: 'verdantAgent',
      framework: '@mastra/core',
      model: 'google/gemini-2.5-flash',
      toolsUsed: ['searchSanctuariesTool', 'generateSensoryMissionTool'],
    },
  };
}

export const runVerdantDiscovery = runGroundTraceDiscovery;
