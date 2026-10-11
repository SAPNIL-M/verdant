# Verdant 🌿: The Anti-Screen Agent

> **Rediscover nature within 5–15 minutes. Minimize screen time under 30 seconds.**

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest_2026-Week_1_Touch_Grass-ff7849?style=for-the-badge&logo=hacktoberfest&logoColor=white)](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)
[![Mastra](https://img.shields.io/badge/Framework-Mastra_1.75-2dd4bf?style=for-the-badge)](https://mastra.ai)
[![Tiger Data](https://img.shields.io/badge/Database-Tiger_Data_(pgvector)-2ea44f?style=for-the-badge)](https://tigerdata.io)
[![Entire](https://img.shields.io/badge/Trace_CLI-Entire_Checkpoints-3b82f6?style=for-the-badge)](https://entire.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

![Verdant Outdoor Micro-Sanctuary Cover](./public/screenshots/cover-image.png)

---

## 🍃 Why Verdant?

Software engineers and digital creators spend **10+ hours a day** glued to monitors. Blue light fatigue, unrelenting Slack notifications, and mental fragmentation lead to chronic burnout.

Most mindfulness and meditation apps fail because **they keep you staring at your phone**—navigating menus, reading articles, or tracking gamified streaks.

**Verdant flips this paradigm with a radical 30-Second Rule:**
1. **3-Second Input**: Pick your nervous system state (*Screen Glare*, *Need Sunlight*, *Overthinking*, *Quiet Solitude*) and available walk minutes (5m to 30m).
2. **Instant Micro-Sanctuary Recommendation**: In under 1 second, the Mastra agent queries Tiger Data's `pgvector` index or live OpenStreetMap GPS coordinates to locate a secluded pocket park or shaded bench near you.
3. **Tactile Screen-Free Sensory Protocol**: A 4-step mindfulness mission that engages hearing, touch, and peripheral sight so you don't look at your device while walking.
4. **Physical Disconnect Lockout**: Click **"Start Walk & Disconnect"** to activate a dimmed fullscreen countdown with synthesized Tibetan singing bowl chimes. You are instructed to lock your screen, pocket your phone, and look up at the tree canopy.

---

## 📹 Video Walkthrough

[![Watch the Verdant Walkthrough & Field Test](https://raw.githubusercontent.com/SAPNIL-M/verdant/master/public/screenshots/cover-image.png)](https://youtu.be/h5mJznaew9E)

> 🎥 **[Click here to watch the full walkthrough on YouTube](https://youtu.be/h5mJznaew9E)**  
> *(Experience the complete 30-second flow: mood selection, Tiger Data vector search, live GPS discovery, and fullscreen Disconnect Lockout Mode).*

---

## 📸 Visual Walkthrough

### 1. Instant 3-Second Mood & Duration Selection
Select your restorative need, slide your walking budget, and choose whether to discover live parks near your GPS coordinates or query Tiger Data's pocket sanctuaries:

![Hero and Mood Selector](./public/screenshots/hero-and-mood-selector.png)

---

### 2. Sub-Second Sanctuary Match & Google Directions
Verdant matches your mood against urban nature spots with walking time, neighborhood context, ambiance notes, and instant walking directions:

![Sanctuary Recommendation Card](./public/screenshots/sanctuary-recommendation-card.png)

---

### 3. Screen-Free Tactile Sensory Protocol
A 4-step mindfulness mission that engages hearing, touch, and peripheral sight so you don't look at your device while walking:

![Tactile Sensory Mindfulness Protocol](./public/screenshots/tactile-sensory-protocol.png)

---

### 4. Disconnect Mode: Fullscreen Physical Lockout
Tapping "Start Walk & Disconnect" dims the screen, triggers a soothing Tibetan singing bowl chime via Web Audio, and prompts you to pocket your phone:

![Disconnect Mode Fullscreen Lockout](./public/screenshots/disconnect-mode-lockout.png)

---

## 🧪 Terminal & Partner Technology Verification

Verdant provides an end-to-end automated verification suite (`npm run agent:test`) testing Mastra, Tiger Data `pgvector`, Live GPS geocoding, and Entire CLI checkpoint tracking:

### Part 1: Mastra Agent Registration & Tiger Data Connection
![Terminal Partner Verification Part 1](./public/screenshots/terminal-partner-proof-1.png)

### Part 2: Tiger Data Vector Distance Searches & Stress Scenarios
![Terminal Partner Verification Part 2](./public/screenshots/terminal-partner-proof-2.png)

### Part 3: Live GPS OpenStreetMap Discovery & Offline Fallback
![Terminal Partner Verification Part 3](./public/screenshots/terminal-partner-proof-3.png)

### Part 4: Entire CLI Checkpoint Session Traces
![Entire Status Session Verification](./public/screenshots/entire-status.png)

---

## 🏗️ Architecture

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

---

## 🚀 Quick Start (Under 60 Seconds)

### Prerequisites
- Node.js 20+ (Node 22 recommended)
- (Optional) Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)
- (Optional) Tiger Data PostgreSQL connection string from [Tiger Data Console](https://console.tigerdata.io/)

### 1. Clone & Install
```bash
git clone https://github.com/SAPNIL-M/verdant.git
cd verdant
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env.local
```
Fill in your credentials (or leave empty to use the built-in fast in-memory vector cache):
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://tsdbuser:password@host.tigerdata.io:5432/tsdb?sslmode=require
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 CLI Verification Commands

| Command | Purpose |
| :--- | :--- |
| `npm run agent:test` | Runs the full verification suite across Mastra, Tiger Data, and live GPS |
| `npm run db:seed` | Applies pgvector schema, IVFFlat index, and seeds 16 sanctuaries into Tiger Data |
| `npm run build` | Validates TypeScript types and generates optimized Next.js production build |
| `entire status` | Displays Entire CLI active tracking session and branch status |
| `entire checkpoints` | Records development checkpoints and agent traces |

---

## 📁 Repository Structure

```
verdant/
├── DOCS/                            # Hacktoberfest submission drafts & screenshots
│   ├── DOC.md                       # Full DEV Community submission post
│   └── *.png                        # Screenshot captures
├── public/screenshots/              # Clean web-safe images referenced by README & DEV
├── entire.yaml                      # Entire Checkpoints CLI configuration
├── scripts/
│   └── test-agent.ts                # Mastra Agent & vector test CLI runner
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout & restorative styling
│   │   ├── page.tsx                 # Main 3-step Touch Grass experience
│   │   └── api/agent/route.ts       # Mastra agent invocation & session logging
│   ├── components/
│   │   ├── Header.tsx               # Botanical header with partner badges
│   │   ├── MoodSelector.tsx         # 3-Second mood chips & duration slider
│   │   ├── SanctuaryCard.tsx        # Recommendation card & sensory protocol
│   │   └── DisconnectModal.tsx      # Fullscreen lockout timer & prompt carousel
│   ├── db/
│   │   ├── client.ts                # Tiger Data pgvector pool & fallback engine
│   │   ├── schema.sql               # PostgreSQL schema & IVFFlat vector index
│   │   ├── sanctuaries-data.ts      # 16 curated urban micro-sanctuary records
│   │   └── seed.ts                  # Automated database seeder
│   ├── lib/
│   │   ├── audio.ts                 # Web Audio API Tibetan singing bowl synthesizer
│   │   ├── osm.ts                   # OpenStreetMap live GPS discovery engine
│   │   └── embeddings.ts            # Gemini text-embedding-004 generator
│   └── mastra/
│       ├── index.ts                 # Mastra instance definition
│       ├── agents/
│       │   └── sanctuaryAgent.ts    # verdantAgent with screen-reduction prompt
│       └── tools/
│           ├── searchSanctuaries.ts # Tiger Data vector similarity search tool
│           └── sensoryMission.ts    # Screen-free sensory mission generator
```

---

## 🏆 Hacktoberfest 2026 Partner Tracks

Verdant is submitted for the **Hacktoberfest Open-Source AI Challenge: Week 1 (Touch Grass)**:

- 🌟 **Best Use of Tiger Data**: Timescale PostgreSQL cloud database with `pgvector`, 768-dim embeddings, IVFFlat indexing, and sub-millisecond cosine distance.
- 🌟 **Best Use of Mastra**: Custom `verdantAgent` with strict anti-screen system prompts and multi-tool orchestration (`searchSanctuariesTool` + `generateSensoryMissionTool`).
- 🌟 **Best Use of Entire**: Checkpointing development trajectories and recording session traces with the `entire` CLI.

---

## 🌿 License

MIT License &copy; 2026 [SAPNIL-M](https://github.com/SAPNIL-M).
