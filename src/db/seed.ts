import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { INITIAL_SANCTUARIES } from './sanctuaries-data';
import { getEmbedding, formatPgVector } from '../lib/embeddings';

async function runSeed() {
  const dbUrl = process.env.DATABASE_URL;

  console.log('🌿 ==========================================');
  console.log('🌿 Verdant: Tiger Data pgvector Seeder');
  console.log('🌿 ==========================================\n');

  if (!dbUrl || dbUrl.trim() === '' || dbUrl.includes('your_tiger_data')) {
    console.log('ℹ️  No DATABASE_URL configured in .env or .env.local.');
    console.log('ℹ️  Tiger Data connection is required to seed PostgreSQL.');
    console.log('💡 Sign up for a free PostgreSQL database at Tiger Data / Timescale:');
    console.log('   https://console.tigerdata.io/ (or use any Postgres with pgvector).');
    console.log('ℹ️  Note: Verdant includes an in-memory vector fallback, so the web UI and agent');
    console.log('   run out of the box even before configuring DATABASE_URL!\n');
    return;
  }

  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  const cleanDbUrl = isLocal ? dbUrl : dbUrl.replace(/([?&])sslmode=[^&]+(&|$)/, '$1').replace(/[?&]$/, '');
  const pool = new Pool({
    connectionString: cleanDbUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('Connecting to Tiger Data PostgreSQL...');
    const client = await pool.connect();
    console.log(' Connected successfully!\n');

    // 1. Read and apply schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('⚙️  Applying pgvector schema & ivfflat index...');
    await client.query(schemaSql);
    console.log(' Schema applied successfully.\n');

    // 2. Clear previous entries if requested
    console.log(' Clearing existing test sanctuaries...');
    await client.query('DELETE FROM disconnect_sessions;');
    await client.query('DELETE FROM micro_sanctuaries;');

    // 3. Insert curated micro-sanctuaries with embeddings
    console.log(`🌱 Seeding ${INITIAL_SANCTUARIES.length} micro-sanctuaries with 768-dim embeddings...`);

    for (const sanctuary of INITIAL_SANCTUARIES) {
      const fullText = `${sanctuary.name}. Category: ${sanctuary.category}. Located in ${sanctuary.neighborhood}. ${sanctuary.ambiance_description} Sensory cues: ${sanctuary.sensory_features.join(', ')}`;
      
      // Get embedding from Gemini text-embedding-004 (or deterministic fallback)
      const embedding = await getEmbedding(fullText);
      const vectorLiteral = formatPgVector(embedding);

      const insertSql = `
        INSERT INTO micro_sanctuaries (
          name, category, neighborhood, estimated_walk_mins,
          shade_rating, quiet_rating, ambiance_description,
          sensory_features, embedding
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::vector)
        RETURNING id, name;
      `;

      const res = await client.query(insertSql, [
        sanctuary.name,
        sanctuary.category,
        sanctuary.neighborhood,
        sanctuary.estimated_walk_mins,
        sanctuary.shade_rating,
        sanctuary.quiet_rating,
        sanctuary.ambiance_description,
        sanctuary.sensory_features,
        vectorLiteral,
      ]);

      console.log(`   [#${res.rows[0].id}] ${res.rows[0].name} (${sanctuary.estimated_walk_mins}m walk) seeded.`);
    }

    // 4. Verify with a sample cosine vector similarity query
    console.log('\n🔎 Verifying vector cosine search (<=> operator)...');
    const testQuery = 'quiet shaded bench under ancient tree with water sound';
    const testVec = await getEmbedding(testQuery);
    const testRes = await client.query(
      `SELECT name, neighborhood, estimated_walk_mins, (embedding <=> $1::vector) AS distance
       FROM micro_sanctuaries
       ORDER BY distance ASC
       LIMIT 2;`,
      [formatPgVector(testVec)]
    );

    console.log(`Top matches for "${testQuery}":`);
    for (const row of testRes.rows) {
      console.log(`   ✨ ${row.name} (${row.neighborhood}) - Distance: ${Number(row.distance).toFixed(4)}`);
    }

    client.release();
    await pool.end();

    console.log('\n🎉 Tiger Data pgvector seeding complete! Ready for micro-sanctuary discovery.');
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runSeed();
