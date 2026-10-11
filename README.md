# Verdant 🌿

> **AI-Powered Micro-Sanctuary Discovery Agent & Outdoor Disconnect Companion**  
> *Rediscover nature within 5–15 minutes. Minimize screen time under 30 seconds.*

[![Mastra](https://img.shields.io/badge/Framework-Mastra_1.75-teal)](https://mastra.ai)
[![Tiger Data](https://img.shields.io/badge/Database-Tiger_Data_(pgvector)-2ea44f)](https://tigerdata.io)
[![Entire](https://img.shields.io/badge/Trace_CLI-Entire_Checkpoints-blue)](https://entire.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black)](https://nextjs.org)

---

## 🍃 The Problem & Philosophy

Software engineers and knowledge workers spend **10+ hours a day** glued to screens. Screen glare, unrelenting Slack pings, and cognitive burnout lead to chronic digital fatigue.

Most digital detox and wellness apps fail because **they keep you staring at your phone**—reading endless articles, tracking gamified streaks, or browsing maps.

**Verdant flips this paradigm with a radical 30-Second Rule:**
1. **3-Second Input**: Pick your nervous system state (*Screen Glare*, *Need Sunlight*, *Overthinking*, *Quiet Solitude*) and available minutes (5m to 30m).
2. **Instant Micro-Sanctuary Recommendation**: In under 1 second, the Mastra agent queries Tiger Data's `pgvector` index to locate a secluded pocket park, quiet bench, or urban grove within walking distance and provides a 4-step sensory mindfulness mission.
3. **Physical Disconnect Lockout**: Click **"Start Walk & Disconnect"** to activate a dimmed fullscreen offline countdown with synthesized Tibetan singing bowl chimes. The app directs you to lock your screen, pocket your phone, and look up at the tree canopy.

---

## 🏗️ Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VERDANT ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
   [Next.js 16 UI] ──(3s Input: Mood + Minutes)
          │
          ▼
  [@mastra/core Agent: verdantAgent]
     ├── Tool 1: searchSanctuariesTool
     │        │
     │        ▼
     │   [Tiger Data Cloud (PostgreSQL + pgvector)]
     │   Vector Cosine Distance: (embedding <=> $1::vector)
     │   Indexes: IVFFlat (embedding vector_cosine_ops)
     │
     └── Tool 2: generateSensoryMissionTool
              │
              ▼
         [Tactile Screen-Free Sensory Protocol Generator]
          │
          ▼
   [Disconnect Mode Fullscreen Lockout + Web Audio Zen Chime]
          │
          ▼
   [Entire Checkpoints CLI (`entire`)]: Session transcripts & checkpoints
```

### 1. Mastra Framework (`@mastra/core`)
- **Agent Orchestration**: Defined in [`src/mastra/agents/sanctuaryAgent.ts`](file:///d:/dev/ai%20engineer/verdant/src/mastra/agents/sanctuaryAgent.ts) using `@mastra/core/agent`. Configured with `google/gemini-2.5-flash` model specifications and strict screen-time minimization system prompt.
- **Custom Tools**:
  - [`searchSanctuariesTool`](file:///d:/dev/ai%20engineer/verdant/src/mastra/tools/searchSanctuaries.ts): Accepts user mood, walk constraint, and quiet preferences. Generates 768-dim query embeddings and retrieves nearest sanctuaries.
  - [`generateSensoryMissionTool`](file:///d:/dev/ai%20engineer/verdant/src/mastra/tools/sensoryMission.ts): Synthesizes tactile, non-visual mindfulness activities (e.g. counting 3 non-mechanical bird calls, touching cold limestone or bark).
- **Mastra Instance**: Initialized in [`src/mastra/index.ts`](file:///d:/dev/ai%20engineer/verdant/src/mastra/index.ts).

### 2. Tiger Data (PostgreSQL + `pgvector`)
- **Spatial Semantic Database**: Connected via [`src/db/client.ts`](file:///d:/dev/ai%20engineer/verdant/src/db/client.ts) to Tiger Data / Timescale PostgreSQL.
- **768-Dimensional Embeddings**: Schema in [`src/db/schema.sql`](file:///d:/dev/ai%20engineer/verdant/src/db/schema.sql) enables `CREATE EXTENSION IF NOT EXISTS vector;` and defines `embedding vector(768)`.
- **Sub-Millisecond Cosine Distance**:
  ```sql
  SELECT id, name, category, estimated_walk_mins, shade_rating, quiet_rating,
         (embedding <=> $1::vector) AS distance
  FROM micro_sanctuaries
  WHERE estimated_walk_mins <= $2
  ORDER BY distance ASC
  LIMIT 3;
  ```
- **IVFFlat Vector Indexing**: `CREATE INDEX sanctuary_embedding_idx ON micro_sanctuaries USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);`
- **Automated Seeder**: [`src/db/seed.ts`](file:///d:/dev/ai%20engineer/verdant/src/db/seed.ts) populates 16 rich urban micro-sanctuaries with embeddings.
- **Offline / Local Fallback**: When `DATABASE_URL` is omitted during local test runs, Verdant seamlessly falls back to an in-memory vector cosine distance engine without breaking the UI.

### 3. Entire Checkpoints CLI (`entire`)
- **Session & Transcript Recording**: Configured in [`entire.yaml`](file:///d:/dev/ai%20engineer/verdant/entire.yaml) to capture development checkpoints, autonomous agent modifications, and runtime execution traces.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20+ (v22 recommended)
- (Optional) Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)
- (Optional) Tiger Data PostgreSQL connection string from [Tiger Data Console](https://console.tigerdata.io/)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/verdant.git
cd verdant
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your credentials (or leave blank to use the built-in fast offline vector cache):
```env
# Google Gemini API Key (for reasoning and embeddings)
GEMINI_API_KEY=your_gemini_api_key_here

# Tiger Data PostgreSQL connection string
DATABASE_URL=postgresql://tsdbuser:password@host.tigerdata.io:5432/tsdb?sslmode=require
```

### 3. Seed Tiger Data pgvector (Optional)
```bash
npm run db:seed
```

### 4. Verify Mastra Agent Pipeline (CLI Test)
```bash
npm run agent:test
```

### 5. Start the Web App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Automated Testing

Verdant comes with automated verification scripts:

| Command | Purpose |
| :--- | :--- |
| `npm run agent:test` | Executes Mastra Agent verification with multiple stress & walk scenarios |
| `npm run db:seed` | Applies pgvector schema, IVFFlat index, and seeds 16 sanctuaries into Tiger Data |
| `npm run build` | Validates TypeScript types and generates optimized Next.js production build |
| `entire checkpoints` | Records git checkpoint and agent trace via Entire CLI |

---

## 📁 Repository Structure

```
verdant/
├── entire.yaml                      # Entire Checkpoints CLI configuration
├── .env.example                     # Environment variables template
├── package.json                     # Scripts & dependencies
├── README.md                        # Documentation & project architecture
├── scripts/
│   └── test-agent.ts                # Mastra Agent & vector test CLI runner
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout & restorative typography
│   │   ├── page.tsx                 # Main 3-step Touch Grass experience
│   │   ├── globals.css              # Botanical palette & ambient lighting
│   │   └── api/
│   │       └── agent/
│   │           └── route.ts         # Next.js API invoking Mastra agent & sessions
│   ├── components/
│   │   ├── Header.tsx               # Botanical header with technology badges
│   │   ├── MoodSelector.tsx         # 3-Second mood chips & duration slider
│   │   ├── SanctuaryCard.tsx        # Recommendation card & sensory mission
│   │   └── DisconnectModal.tsx      # Fullscreen lockout timer & prompt carousel
│   ├── db/
│   │   ├── client.ts                # Tiger Data pgvector pool & fallback engine
│   │   ├── schema.sql               # PostgreSQL schema & IVFFlat vector index
│   │   ├── sanctuaries-data.ts      # 16 curated urban micro-sanctuary records
│   │   └── seed.ts                  # Automated database seeder
│   ├── lib/
│   │   ├── audio.ts                 # Web Audio API Tibetan singing bowl chime
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

## 🌿 License

MIT License &copy; 2026 Verdant Team.
