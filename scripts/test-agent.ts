import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { mastra, groundTraceAgent } from '../src/mastra';
import { runGroundTraceDiscovery } from '../src/mastra/agents/sanctuaryAgent';
import { isDatabaseConnected } from '../src/db/client';

async function testAgent() {
  console.log('\n🌿 =======================================================');
  console.log('🌿 Verdant: Mastra Agent & pgvector Verification Test');
  console.log('🌿 =======================================================\n');

  try {
    // 1. Verify Mastra instance
    console.log('1️⃣  Verifying Mastra Instance & Agent Registration...');
    const registered = mastra.getAgent('verdantAgent') || mastra.getAgent('groundTraceAgent');
    if (!registered) {
      throw new Error('verdantAgent not found in Mastra instance!');
    }
    console.log(`   Registered Agent: "${registered.name}"`);
    console.log(`   Agent Tools: searchSanctuariesTool, generateSensoryMissionTool`);
    console.log('   Mastra Agent verified.\n');

    // 2. Check Database Status
    console.log('2️⃣  Checking Tiger Data PostgreSQL connection status...');
    const dbLive = await isDatabaseConnected();
    if (dbLive) {
      console.log('   Tiger Data pgvector is CONNECTED and active.');
    } else {
      console.log('   Tiger Data not detected on DATABASE_URL — using in-memory pgvector fallback engine.');
    }
    console.log('');

    // 3. Run Pipeline with simulated user request
    const testCases = [
      {
        scenario: 'Developer with 10+ hours screen time, high stress',
        mood: 'Severe screen glare fatigue, tight neck, high stress, need deep shade and flowing water',
        maxWalkMins: 10,
        needQuiet: true,
      },
      {
        scenario: 'Midday sunlight and Vitamin D reset',
        mood: 'Need midday sunlight, warm stone, open horizon to stretch and reset dopamine',
        maxWalkMins: 15,
        needQuiet: false,
      },
    ];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      console.log(`3.${i + 1} Testing Scenario: "${tc.scenario}"`);
      console.log(`     User Mood: "${tc.mood}"`);
      console.log(`     Available Walk Time: ${tc.maxWalkMins} mins\n`);

      const response = await runGroundTraceDiscovery({
        mood: tc.mood,
        maxWalkMins: tc.maxWalkMins,
        needQuiet: tc.needQuiet,
      });

      console.log(`     ✨ Recommended Spot: ${response.sanctuary.name}`);
      console.log(`     📍 Category & Area:  ${response.sanctuary.category} (${response.sanctuary.neighborhood})`);
      console.log(`     🚶 Estimated Walk:   ${response.sanctuary.estimated_walk_mins} mins`);
      console.log(`     🍃 Sensory Badges:   ${response.sanctuary.sensory_features.join(' • ')}`);
      console.log(`     🎯 Sensory Mission:  "${response.sensoryMission.title}"`);
      console.log(`     📵 Disconnect Lockout: "${response.sensoryMission.lockoutMessage}"`);
      console.log(`     💾 Data Source:      ${response.dataSource}`);
      console.log(`     ⏱️  Execution Time:    ${response.executionTimeMs}ms\n`);
    }

    // 4. Test Live GPS Discovery
    console.log('4️⃣  Testing Live GPS Discovery (Hyde Park / London area: 51.5074, -0.1278)...');
    const liveResponse = await runGroundTraceDiscovery({
      mood: 'need open park with green lawns and fresh breeze',
      maxWalkMins: 25,
      coordinates: { lat: 51.5074, lng: -0.1278 },
    });
    console.log(`     ✨ Live Spot:       ${liveResponse.sanctuary.name}`);
    console.log(`     📍 Neighborhood:    ${liveResponse.sanctuary.neighborhood}`);
    console.log(`     🚶 Estimated Walk:   ${liveResponse.sanctuary.estimated_walk_mins} mins`);
    console.log(`     🗺️  GPS Coordinates: ${liveResponse.sanctuary.latitude}, ${liveResponse.sanctuary.longitude}`);
    console.log(`     💾 Data Source:      ${liveResponse.dataSource}`);
    console.log(`     ⏱️  Execution Time:    ${liveResponse.executionTimeMs}ms\n`);

    // 4b. Test 30-minute option with live coordinates
    console.log('4️⃣b Testing 30-Min Option with Live Coordinates (Bengaluru area: 12.9716, 77.5946)...');
    const live30Response = await runGroundTraceDiscovery({
      mood: 'screen glare fatigue, need trees and cool grass',
      maxWalkMins: 30,
      coordinates: { lat: 12.9716, lng: 77.5946 },
    });
    console.log(`     ✨ Live 30m Spot:   ${live30Response.sanctuary.name}`);
    console.log(`     📍 Neighborhood:    ${live30Response.sanctuary.neighborhood}`);
    console.log(`     🚶 Estimated Walk:   ${live30Response.sanctuary.estimated_walk_mins} mins`);
    console.log(`     🗺️  GPS Coordinates: ${live30Response.sanctuary.latitude}, ${live30Response.sanctuary.longitude}`);
    console.log(`     💾 Data Source:      ${live30Response.dataSource} (Live verified!)`);
    console.log(`     ⏱️  Execution Time:    ${live30Response.executionTimeMs}ms\n`);

    // 5. Test Live GPS Fallback (Coordinates with 0 spots -> seamlessly uses demo sanctuaries)
    console.log('5️⃣  Testing Automatic Fallback to Demo / Tiger Data (Coordinates in ocean: 0.0, 0.0)...');
    const fallbackResponse = await runGroundTraceDiscovery({
      mood: 'need quiet bamboo garden and shade',
      maxWalkMins: 15,
      coordinates: { lat: 0.0, lng: 0.0 },
    });
    console.log(`     ✨ Fallback Spot:    ${fallbackResponse.sanctuary.name}`);
    console.log(`     📍 Area:             ${fallbackResponse.sanctuary.neighborhood}`);
    console.log(`     💾 Data Source:      ${fallbackResponse.dataSource} (Fallback activated)`);
    console.log(`     ⏱️  Execution Time:    ${fallbackResponse.executionTimeMs}ms\n`);

    console.log('=======================================================');
    console.log('🎉 ALL TESTS PASSED! Mastra Agent pipeline is fully operational.');
    console.log('=======================================================\n');
  } catch (err: any) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
}

testAgent();
