import { NextRequest, NextResponse } from 'next/server';
import { runGroundTraceDiscovery } from '@/mastra/agents/sanctuaryAgent';
import { isDatabaseConnected, logDisconnectSession } from '@/db/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, mood, minutes, needQuiet, sanctuaryId, notes, coordinates } = body;

    // Handle completed disconnect session logging
    if (action === 'complete_session') {
      const sessionId = await logDisconnectSession(
        sanctuaryId || 1,
        minutes || 20,
        notes || 'Touch grass walk completed'
      );
      return NextResponse.json({
        success: true,
        message: 'Disconnect session recorded',
        sessionId,
      });
    }

    // Default discovery pipeline
    const userMood = typeof mood === 'string' && mood.trim() !== ''
      ? mood
      : 'Severe screen fatigue, need quiet shade and fresh air';
    const walkMins = typeof minutes === 'number' && minutes > 0 ? minutes : 15;
    const quietRequired = typeof needQuiet === 'boolean' ? needQuiet : true;

    const result = await runGroundTraceDiscovery({
      mood: userMood,
      maxWalkMins: walkMins,
      needQuiet: quietRequired,
      coordinates:
        coordinates && typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number'
          ? coordinates
          : undefined,
    });

    const isDbLive = await isDatabaseConnected();

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        databaseConnected: isDbLive,
        storageEngine:
          result.dataSource === 'live_osm_gps'
            ? 'OpenStreetMap (Live GPS)'
            : isDbLive
            ? 'Tiger Data (PostgreSQL + pgvector)'
            : 'Local Fast Vector Cache',
        framework: 'Mastra (@mastra/core)',
        agent: 'verdantAgent',
        tools: ['searchSanctuariesTool', 'generateSensoryMissionTool'],
        checkpoints: 'Entire CLI (entire.yaml)',
      },
    });
  } catch (error: any) {
    console.error('API /api/agent error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process sanctuary request',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const isDbLive = await isDatabaseConnected();
  return NextResponse.json({
    status: 'healthy',
    agent: 'verdantAgent',
    framework: 'Mastra 1.75',
    vectorDatabase: isDbLive ? 'Tiger Data pgvector active' : 'Fallback Vector Engine active',
  });
}
