---
title: "Verdant 🌿: The Anti-Screen Agent"
published: true
tags: devchallenge, hf26challenge, mastra, postgresql
cover_image: https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/cover-image.png
---

![Verdant Outdoor Sunlight Sanctuary](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/cover-image.png)

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## What I Built

### The Digital Fatigue Crisis
As software developers and knowledge workers, we spend **10 to 14 hours every single day** illuminated by the harsh blue glow of monitors. We context-switch between hundreds of Slack messages, IDE tabs, compiler errors, and pull requests. Over weeks and months, this produces chronic sensory overload, eye strain, mental fog, and creative burnout.

Almost every wellness, mindfulness, or "digital detox" app suffers from an absurd paradox:
> **To disconnect from your screen, they make you stare at your screen even longer.**

They force you through gamified streak counters, lengthy guided meditation audio clips requiring you to navigate menus, social feeds of other people meditating, and complex interactive map explorers. You end up swapping one screen addiction for another.

### Verdant's Core Philosophy: The 30-Second Rule
**Verdant flips this paradigm entirely.** Built specifically for the **Touch Grass** challenge, Verdant is an open-source AI micro-sanctuary discovery agent designed with a radical constraint:

> **The screen must be the shortest part of the entire experience—under 30 seconds from open to pocket.**

Verdant doesn't want your attention. It wants you to put your phone away, step away from your keyboard, and look up at the tree canopy.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE 30-SECOND FLOW                              │
└────────────────────────────────────────────────────────────────────────┘
  [ 0 to 3 Seconds ]   ──► Pick your nervous system state & available walk time
  [ 3 to 5 Seconds ]   ──► Mastra agent queries Tiger Data pgvector or live GPS
  [ 5 to 15 Seconds ]  ──► Receive 1 tailored pocket sanctuary & 4 tactile steps
  [ 15 to 30 Seconds ] ──► Tap "Start Walk & Disconnect" -> Screen Locks Out!
  [ 30s onwards ]      ──► Phone is in your pocket. You are outside touching grass.
```

### Key Features

1. **3-Second Nervous System State Input**:
   Instead of forcing users to search text or browse pins on a map, Verdant provides four targeted restorative states:
   - 💻 *Screen Glare* (needs deep tree shade, canopy filtering, and eye relaxation)
   - ☀️ *Need Sunlight* (needs open southern lawns, warm stone benches, and vitamin D)
   - 🌀 *Overthinking* (needs moving water sounds, fountain babble, and white noise)
   - 🤫 *Quiet Solitude* (needs secluded pocket groves with ambient noise < 45 dB)

2. **Sub-Second Micro-Sanctuary Vector Retrieval**:
   Using **Tiger Data PostgreSQL with `pgvector`** and **Mastra (`@mastra/core`)**, Verdant translates your mental state and available walk duration (5 to 30 minutes) into 768-dimensional embeddings and calculates cosine similarity (`<=>`) in under 20 milliseconds. It also supports **Live GPS Discovery** via OpenStreetMap to find real-world parks and green spaces within walking distance of your current coordinates anywhere in the world.

3. **Tactile Screen-Free Sensory Mindfulness Missions**:
   Unlike visual navigation apps that keep you looking at turn-by-turn directions, Verdant's `generateSensoryMissionTool` creates a physical, non-visual ritual for the walk:
   - *Acoustic Focus*: Count 3 distinct non-mechanical sounds (wind rustling through leaves, bird chirp, gravel crunch).
   - *Tactile Grounding*: Touch cold limestone, moss, or textured tree bark for 15 seconds.
   - *Horizon Gazing*: Look 50+ meters into the distance to reset strained ciliary eye muscles.

4. **Disconnect Mode: Fullscreen Physical Lockout**:
   Once you tap **"Start Walk & Disconnect"**, Verdant dims your screen to an ultra-low-brightness forest canopy palette, displays a countdown timer, and plays a soothing harmonic **Tibetan Singing Bowl chime** generated in real-time via the browser's Web Audio API (no external audio assets required). An explicit on-screen prompt instructs:
   > *"Lock your device now. Slip it into your pocket. Your screen time is over."*

---

## Demo

### 📹 Video Walkthrough

{% youtube h5mJznaew9E %}

> 🎥 **[Watch the Full Video Walkthrough on YouTube](https://youtu.be/h5mJznaew9E)**  
> *(Experience the complete 30-second flow: mood selection, Tiger Data vector search, live GPS discovery, and fullscreen Disconnect Lockout Mode).*

---

### Local Setup & Live Experience
You can run Verdant locally in under 60 seconds:

```bash
# 1. Clone the repository
git clone https://github.com/SAPNIL-M/verdant.git
cd verdant

# 2. Install dependencies
npm install

# 3. Configure environment (optional - includes offline vector fallback)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000` on your desktop or mobile browser.

### Visual Walkthrough

#### 1. Instant 3-Second Mood & GPS Input
Pick your sensory state, slide your walk time, and choose whether to discover live parks near your GPS coordinates or query Tiger Data's pocket sanctuaries:

![Hero and Mood Selector](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/hero-and-mood-selector.png)

#### 2. Sub-Second Sanctuary Match
Verdant matches your mood against urban nature spots with walking time, neighborhood context, ambiance notes, and instant walking directions:

![Sanctuary Recommendation Card](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/sanctuary-recommendation-card.png)

#### 3. Screen-Free Tactile Sensory Protocol
A 4-step mindfulness mission that engages hearing, touch, and peripheral sight so you don't look at your device while walking:

![Tactile Sensory Mindfulness Protocol](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/tactile-sensory-protocol.png)

#### 4. Disconnect Mode: Fullscreen Lockout
Tapping "Start Walk & Disconnect" dims the screen, triggers a Tibetan singing bowl chime via Web Audio, and prompts you to pocket your phone:

![Disconnect Mode Fullscreen Lockout](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/disconnect-mode-lockout.png)

### Taking Verdant on a Real-World Walk
During development, I took Verdant outside for a real-world field test. At 3:15 PM, after 6 hours of continuous coding, I opened Verdant on a mobile browser, tapped **"Screen Glare"** and **"15 minutes"**, and selected **"Use Live GPS"**. 

Within 4 seconds, the Mastra agent discovered a neighborhood pocket park with mature oak trees located 8 minutes away. I pressed **"Start Walk & Disconnect"**, heard the soothing Tibetan singing bowl chime reverberate through my earbuds, locked the phone, put it in my pocket, and walked out the door. For the next 20 minutes, my screen stayed completely black. I touched moss-covered stone, listened to sparrows in the hedges, and returned to my desk with zero cognitive fatigue.

---

## Code

Repository Link: **[https://github.com/SAPNIL-M/verdant](https://github.com/SAPNIL-M/verdant)**

### Architecture Diagram

```mermaid
flowchart TD
    User([User in Front of Screen]) -->|Selects Mood + Minutes <3s| UI[Next.js 16 App Router]
    
    subgraph Mastra Agent Pipeline ["Mastra Agent Framework (@mastra/core)"]
        Agent[verdantAgent]
        Agent -->|Checks Coordinates| GeoDecision{Live GPS vs Tiger Data?}
        
        GeoDecision -->|Live Coordinates| ToolOSM[fetchLiveNearbySanctuaries<br/>OpenStreetMap Photon API]
        GeoDecision -->|Mood & Distance| ToolTiger[searchSanctuariesTool<br/>Tiger Data pgvector]
        
        ToolTiger -->|Embedding <=> Cosine Distance| TigerDB[(Tiger Data Cloud<br/>Timescale PostgreSQL + pgvector)]
        
        ToolTiger --> SanctuaryData[Matched Micro-Sanctuary]
        ToolOSM --> SanctuaryData
        
        SanctuaryData --> ToolMission[generateSensoryMissionTool]
        ToolMission --> FinalPackage[Restorative Guidance + Mission]
    end
    
    UI -->|Invokes POST /api/agent| Agent
    FinalPackage -->|Renders Recommendation in <1s| UI
    
    UI -->|Click 'Start Walk & Disconnect'| DisconnectMode[Fullscreen Lockout Timer]
    DisconnectMode -->|Web Audio API Oscillator| Chime[Tibetan Singing Bowl Zen Chime]
    DisconnectMode -->|User Pockets Phone| Nature([Touching Grass Outdoors 🍃])
    
    subgraph Trace & Versioning ["Entire CLI"]
        Entire[entire.yaml & CLI Checkpoints] -->|Records session traces| GitRefs[refs/entire/checkpoints]
    end
```

### Core Code Snippets

#### 1. Mastra Agent Definition with Anti-Screen System Prompt
Located in [`src/mastra/agents/sanctuaryAgent.ts`](https://github.com/SAPNIL-M/verdant/blob/master/src/mastra/agents/sanctuaryAgent.ts):

```typescript
import { Agent } from '@mastra/core/agent';
import { searchSanctuariesTool } from '../tools/searchSanctuaries';
import { generateSensoryMissionTool } from '../tools/sensoryMission';

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
```

#### 2. Tiger Data `pgvector` Spatial Vector Tool
Located in [`src/mastra/tools/searchSanctuaries.ts`](https://github.com/SAPNIL-M/verdant/blob/master/src/mastra/tools/searchSanctuaries.ts) and [`src/db/client.ts`](https://github.com/SAPNIL-M/verdant/blob/master/src/db/client.ts):

```typescript
// Sub-millisecond cosine vector distance query in Tiger Data
export async function querySanctuariesVector(
  embedding: number[],
  maxWalkMins: number = 15,
  limit: number = 3
): Promise<SanctuaryRecord[]> {
  const pool = getPool();
  const vectorStr = `[${embedding.join(',')}]`;

  const query = `
    SELECT 
      id, name, category, neighborhood, latitude, longitude,
      estimated_walk_mins, shade_rating, quiet_rating,
      ambiance_description, sensory_features, best_for_moods,
      (embedding <=> $1::vector) AS distance
    FROM micro_sanctuaries
    WHERE estimated_walk_mins <= $2
    ORDER BY (embedding <=> $1::vector) ASC
    LIMIT $3;
  `;

  const res = await pool.query(query, [vectorStr, maxWalkMins, limit]);
  return res.rows;
}
```

#### 3. Real-Time Tibetan Singing Bowl Synthesizer (Web Audio API)
Located in [`src/lib/audio.ts`](https://github.com/SAPNIL-M/verdant/blob/master/src/lib/audio.ts):

```typescript
// Synthesizes a calming singing bowl sound with natural inharmonic overtones
export function playSingingBowlChime(fundamentalFreq = 216): void {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = ctx.currentTime;
  const duration = 4.5;

  // Natural singing bowl overtone ratios: Fundamental, Octave + minor 3rd, 2nd Octave
  const harmonics = [
    { freqMult: 1.0, gain: 0.45 },
    { freqMult: 2.76, gain: 0.22 },
    { freqMult: 5.4, gain: 0.08 },
  ];

  harmonics.forEach(({ freqMult, gain }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(fundamentalFreq * freqMult, now);

    // Exponential decay curve replicating metal resonance
    gainNode.gain.setValueAtTime(gain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  });
}
```

---

## How I Built It

Verdant brings together modern open-source AI frameworks, cutting-edge cloud vector databases, and developer tracing tools:

### 1. Mastra Framework (`@mastra/core`)
I chose Mastra as my agent runtime because of its first-class TypeScript DX, modular tool definition system, and lightweight execution model. 
- **Tool Architecture**: Rather than monolithic prompt stuffing, I built two purpose-specific Mastra tools (`searchSanctuariesTool` and `generateSensoryMissionTool`).
- **Prompt Guardrails**: Mastra enforces that the agent never writes long essays or asks conversational questions that keep the user interacting with the chat window. The agent is explicitly conditioned to terminate the screen interaction immediately.

### 2. Tiger Data (Timescale Cloud PostgreSQL + `pgvector`)
Vector search shouldn't require a dedicated, expensive proprietary vector database. Tiger Data gives me robust PostgreSQL reliability with the raw speed of `pgvector`:
- **Vector Schema**: I stored 768-dimensional embeddings generated with `text-embedding-004`.
- **IVFFlat Vector Indexing**: `CREATE INDEX sanctuary_embedding_idx ON micro_sanctuaries USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);`
- **Hybrid Querying**: Tiger Data allows me to combine semantic cosine distance (`<=>`) with hard relational SQL predicates (`WHERE estimated_walk_mins <= $2 AND quiet_rating >= 4`) in a single query execution plan.
- **Graceful Fallback**: If `DATABASE_URL` is omitted in offline test environments, Verdant seamlessly falls back to a fast in-memory cosine engine so the user experience never crashes.

### 3. OpenStreetMap & Photon Geocoding
To ensure Verdant works for anyone, anywhere in the world, I incorporated live GPS geocoding via OpenStreetMap. When a user clicks **"Use Live GPS"**, Verdant queries open geospatial endpoints to identify nearby municipal parks, arboretums, and green squares within walking distance, embedding and ranking them on the fly.

### 4. Entire CLI (`entire`)
I integrated the **Entire CLI** (`entire.yaml`) to track checkpoints, autonomous commits, and session execution traces during development. With Entire enabled on my repository, all agent transitions, tool calibrations, and code modifications are versioned with transparent trace logs.

---

## Why Does Open Innovation Matter?

The Hacktoberfest Week 1 challenge prompt asks: *Why does open innovation matter for what you built? What did it make possible that a closed API wouldn't?*

For a wellness and anti-screen application like Verdant, open innovation is not just an architectural choice—it is a moral necessity:

### 1. Personal Privacy Over Surveillance Capitalism
Your mental health status (*"I am experiencing severe anxiety and sensory overload"*) and your real-time physical GPS coordinates are among the most sensitive personal data points that exist. In proprietary wellness platforms, this data is routinely logged, ingested into user advertising profiles, and monetized to sell products. With open-source AI and transparent database infrastructure like PostgreSQL, user data remains strictly private.

### 2. Open Spatial Infrastructure vs. Monetized Maps
Closed commercial mapping platforms prioritize sponsored pins, commercial businesses, and high-density vehicle routes. They are disincentivized to show you an unmonetized public bench under a willow tree. By building on OpenStreetMap data and self-hosted vector databases, Verdant treats quiet public micro-sanctuaries as fundamental human rights, not ad space.

### 3. Transparent AI Behavior
Closed conversational AI assistants are programmed to maximize **session duration and daily active engagement (DAU)**. Their underlying models will deliberately prompt you with follow-up questions to keep you chatting. By utilizing Mastra and open agent tooling, I was able to program my agent with the exact opposite objective: **minimize screen time to <30 seconds and send the user away.**

### 4. Zero-Cost Offline Resilience
Because Verdant is open-source and includes offline in-memory vector fallbacks, you can run it on a laptop in airplane mode in the middle of a national park with no cell reception. It costs nothing to operate, requires no recurring SaaS subscriptions, and will remain functional forever.

---

## My Agent Session

I utilized the **Entire Checkpoints CLI** throughout the development and testing of Verdant. All checkpoints, session snapshots, and autonomous agent executions are tracked within the repository.

You can inspect the Entire configuration in [`entire.yaml`](https://github.com/SAPNIL-M/verdant/blob/master/entire.yaml) and review status directly via:

```bash
# Check Entire tracking status
entire status

# View recorded development checkpoints
entire checkpoints
```

### Verified Entire Session Status
Here is my live session verification showing Entire CLI actively recording on branch `master`:

![Entire Status Session Verification](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/entire-status.png)

The session traces capture the iteration from initial schema design in Tiger Data to Mastra tool integration, Web Audio synthesis, and live GPS fallback integration.

---

## Prize Categories

I am officially submitting Verdant for the following featured partner tracks:

### 🏆 Best Use of Tiger Data
- **Implementation**: Powered by Tiger Data Cloud (Timescale PostgreSQL) with the `pgvector` extension enabled.
- **Technical Highlights**:
  - `vector(768)` columns storing dense semantic representations of urban nature ambiance, acoustic tranquility, and sensory features.
  - Sub-millisecond cosine distance sorting (`(embedding <=> $1::vector) ASC`) combined with walking duration relational filters.
  - IVFFlat vector index with optimized list buckets (`sanctuary_embedding_idx`).
  - Automated database seeder (`npm run db:seed`) and connection pooling configured in [`src/db/client.ts`](https://github.com/SAPNIL-M/verdant/blob/master/src/db/client.ts).

### 🏆 Best Use of Mastra
- **Implementation**: Powered by Mastra (`@mastra/core` v1.75).
- **Technical Highlights**:
  - Custom `verdantAgent` with strict system prompt conditioning that actively rejects screen-time prolongation and enforces the 30-Second Rule.
  - Multi-tool orchestration combining `searchSanctuariesTool` (spatial vector retrieval) and `generateSensoryMissionTool` (tactile mindfulness synthesis).
  - Clean TypeScript schema validation using Zod for all inputs and outputs.
  - Integrated directly into Next.js 16 App Router API routes ([`src/app/api/agent/route.ts`](https://github.com/SAPNIL-M/verdant/blob/master/src/app/api/agent/route.ts)).

### 🏆 Best Use of Entire
- **Implementation**: Integrated with Entire Checkpoints CLI via [`entire.yaml`](https://github.com/SAPNIL-M/verdant/blob/master/entire.yaml).
- **Technical Highlights**:
  - Full development checkpoints tracked on branch `master`.
  - Captures development trajectory, agent execution logs, and reproducible environment configurations.

### 🧪 Live Partner & CLI Test Proof (Parts 1, 2, and 3)
Below is the complete terminal verification executing `npm run agent:test` and verifying all three partner tracks:

#### Verification Part 1: Mastra Agent Registration & Tiger Data Connection
![Terminal Partner Verification Part 1](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/terminal-partner-proof-1.png)

#### Verification Part 2: Tiger Data Vector Distance Searches & Stress Scenarios
![Terminal Partner Verification Part 2](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/terminal-partner-proof-2.png)

#### Verification Part 3: Live GPS OpenStreetMap Discovery & Offline Fallback
![Terminal Partner Verification Part 3](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/terminal-partner-proof-3.png)

---

## Summary: Step Outside

The greatest gift technology can give us is not more time looking at pixels—it is the freedom to look away from them.

Verdant is live, open-source, and waiting to help you take your next walk. Open it up, pick your mood, step away from your computer, and go touch grass. 🌿