import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getEmbedding } from '../../lib/embeddings';
import { querySanctuariesVector } from '../../db/client';

export const searchSanctuariesInputSchema = z.object({
  userRequest: z
    .string()
    .describe('The user mental state, mood, or sensory requirement (e.g. "high screen fatigue, need deep shade and water")'),
  maxWalkMins: z
    .number()
    .default(15)
    .describe('Maximum walking time in minutes one-way (e.g. 5, 10, 15, 20)'),
  needQuiet: z
    .boolean()
    .default(true)
    .describe('Whether quiet solitude (minimal urban decibels) is requested'),
});

export const searchSanctuariesTool = createTool({
  id: 'searchSanctuariesTool',
  description:
    'Searches Tiger Data PostgreSQL using pgvector cosine distance (<=>) for nearby micro-sanctuaries matching user mood, sensory desires, and walk time.',
  inputSchema: searchSanctuariesInputSchema,
  execute: async (input: any) => {
    const userRequest = input?.userRequest ?? input?.context?.userRequest ?? 'need quiet shaded nature spot';
    const maxWalkMins = input?.maxWalkMins ?? input?.context?.maxWalkMins ?? 15;
    const needQuiet = input?.needQuiet ?? input?.context?.needQuiet ?? true;

    // 1. Generate 768-dim query embedding using Gemini text-embedding-004
    const embedding = await getEmbedding(userRequest);

    // 2. Query Tiger Data PostgreSQL with pgvector <=> cosine distance
    const results = await querySanctuariesVector(embedding, maxWalkMins, 3);

    // 3. Apply quiet filter preference if available
    let filtered = results;
    if (needQuiet) {
      const quietCandidates = results.filter((s) => s.quiet_rating >= 4);
      if (quietCandidates.length > 0) {
        filtered = quietCandidates;
      }
    }

    return {
      totalFound: filtered.length,
      primarySanctuary: filtered[0] || results[0] || null,
      alternatives: filtered.slice(1),
    };
  },
});
