import { Pool, QueryResult } from 'pg';
import { INITIAL_SANCTUARIES, SanctuaryRecord } from './sanctuaries-data';
import { cosineSimilarity, formatPgVector } from '../lib/embeddings';

let pool: Pool | null = null;
let dbAvailable = false;

function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === '' || connectionString.includes('your_tiger_data')) {
    return null;
  }

  if (!pool) {
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    const cleanConnectionString = isLocalhost ? connectionString : connectionString.replace(/([?&])sslmode=[^&]+(&|$)/, '$1').replace(/[?&]$/, '');
    pool = new Pool({
      connectionString: cleanConnectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });

    pool.on('error', (err) => {
      console.warn('Tiger Data PostgreSQL pool error (falling back to memory):', err.message);
      dbAvailable = false;
    });
  }

  return pool;
}

/**
 * Checks if Tiger Data PostgreSQL connection is active and responsive.
 */
export async function isDatabaseConnected(): Promise<boolean> {
  const p = getPool();
  if (!p) return false;

  try {
    const res = await p.query('SELECT 1');
    dbAvailable = res.rowCount !== null && res.rowCount > 0;
    return dbAvailable;
  } catch (err) {
    dbAvailable = false;
    return false;
  }
}

/**
 * Searches micro-sanctuaries using Tiger Data pgvector cosine distance `<=>`.
 * If database is not configured, performs in-memory cosine vector ranking.
 */
export async function querySanctuariesVector(
  embedding: number[],
  maxWalkMins: number = 20,
  limit: number = 3
): Promise<SanctuaryRecord[]> {
  const p = getPool();

  if (p) {
    try {
      const vectorLiteral = formatPgVector(embedding);
      const query = `
        SELECT 
          id, 
          name, 
          category, 
          neighborhood, 
          estimated_walk_mins, 
          shade_rating, 
          quiet_rating, 
          ambiance_description, 
          sensory_features, 
          (embedding <=> $1::vector) AS distance
        FROM micro_sanctuaries
        WHERE estimated_walk_mins <= $2
        ORDER BY distance ASC
        LIMIT $3;
      `;

      const result: QueryResult = await p.query(query, [vectorLiteral, maxWalkMins, limit]);
      if (result.rows.length > 0) {
        return result.rows.map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          neighborhood: row.neighborhood,
          estimated_walk_mins: row.estimated_walk_mins,
          shade_rating: row.shade_rating,
          quiet_rating: row.quiet_rating,
          ambiance_description: row.ambiance_description,
          sensory_features: row.sensory_features,
          distance: parseFloat(row.distance),
        }));
      }
    } catch (dbError) {
      console.warn('Tiger Data pgvector query failed, using in-memory vector fallback:', dbError);
    }
  }

  // Graceful In-Memory Semantic Cosine Ranking Fallback
  const candidateList = INITIAL_SANCTUARIES.filter(
    (s) => s.estimated_walk_mins <= maxWalkMins
  );

  const scored = candidateList.map((sanctuary) => {
    const sim = sanctuary.embedding ? cosineSimilarity(embedding, sanctuary.embedding) : 0.5;
    const distance = 1 - sim; // Cosine distance = 1 - cosine similarity
    return {
      ...sanctuary,
      distance: Number(distance.toFixed(4)),
    };
  });

  scored.sort((a, b) => (a.distance ?? 1) - (b.distance ?? 1));
  return scored.slice(0, limit);
}

/**
 * Records an outdoor disconnect session into Tiger Data
 */
export async function logDisconnectSession(
  sanctuaryId: number,
  targetDurationMins: number,
  reflectionNotes?: string
): Promise<number | null> {
  const p = getPool();
  if (!p) return null;

  try {
    const res = await p.query(
      `INSERT INTO disconnect_sessions (sanctuary_id, target_duration_mins, completed, reflection_notes)
       VALUES ($1, $2, TRUE, $3) RETURNING id`,
      [sanctuaryId, targetDurationMins, reflectionNotes || 'Touch grass completed']
    );
    return res.rows[0]?.id ?? null;
  } catch (error) {
    console.warn('Could not record disconnect session to database:', error);
    return null;
  }
}

export { getPool };
