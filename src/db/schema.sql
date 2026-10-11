-- Tiger Data (PostgreSQL + pgvector) Schema for Verdant
-- Micro-Sanctuaries & Disconnect Sessions

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Micro-Sanctuaries Table
CREATE TABLE IF NOT EXISTS micro_sanctuaries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'pocket_park', 'quiet_bench', 'botanical_corner', 'urban_grove', 'rooftop_garden'
    neighborhood VARCHAR(100) NOT NULL,
    estimated_walk_mins INT NOT NULL,
    shade_rating INT CHECK (shade_rating BETWEEN 1 AND 5),
    quiet_rating INT CHECK (quiet_rating BETWEEN 1 AND 5),
    ambiance_description TEXT NOT NULL,
    sensory_features TEXT[] NOT NULL, -- e.g. ARRAY['flowing fountain', 'weeping willows', 'mossy stone']
    embedding vector(768),            -- Gemini text-embedding-004 (768 dimensions)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Disconnect Sessions Log Table (Tracks screen lockout & offline walking history)
CREATE TABLE IF NOT EXISTS disconnect_sessions (
    id SERIAL PRIMARY KEY,
    sanctuary_id INT REFERENCES micro_sanctuaries(id) ON DELETE SET NULL,
    target_duration_mins INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    reflection_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Cosine Similarity Vector Index for fast semantic nearest-neighbor search
CREATE INDEX IF NOT EXISTS sanctuary_embedding_idx 
ON micro_sanctuaries USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 10);
