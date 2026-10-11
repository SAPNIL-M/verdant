import { GoogleGenAI } from '@google/genai';

export const EMBEDDING_DIMENSION = 768;

/**
 * Deterministic semantic fallback vector generator for offline/local development.
 * Maps text keywords onto normalized 768-dimensional spherical coordinates.
 */
export function generateDeterministicEmbedding(text: string): number[] {
  const vec = new Array(EMBEDDING_DIMENSION).fill(0);
  const normalizedText = text.toLowerCase().trim();

  // Keyword semantic anchors
  const concepts: Record<string, number> = {
    water: 12,
    fountain: 13,
    shade: 45,
    tree: 46,
    bench: 78,
    quiet: 110,
    calm: 111,
    sun: 140,
    solar: 141,
    moss: 180,
    stone: 181,
    bird: 220,
    willow: 250,
    courtyard: 290,
    breeze: 330,
    garden: 380,
    zen: 410,
    flowers: 450,
    bamboo: 500,
    canopy: 550,
    rooftop: 600,
    peace: 650,
    stress: 700,
  };

  for (const [concept, baseIdx] of Object.entries(concepts)) {
    if (normalizedText.includes(concept)) {
      for (let offset = -4; offset <= 4; offset++) {
        const idx = (baseIdx + offset + EMBEDDING_DIMENSION) % EMBEDDING_DIMENSION;
        vec[idx] += 1.5 / (Math.abs(offset) + 1);
      }
    }
  }

  // Token hashing for vocabulary distribution
  for (let i = 0; i < normalizedText.length; i++) {
    const charCode = normalizedText.charCodeAt(i);
    const hash = (charCode * 31 + i * 17) % EMBEDDING_DIMENSION;
    vec[hash] += Math.sin(charCode + i) * 0.4;
  }

  // L2 normalize vector
  let norm = Math.hypot(...vec);
  if (norm === 0) norm = 1;
  return vec.map((v) => Number((v / norm).toFixed(6)));
}

/**
 * Generates 768-dimensional vector embedding for text using Google Gemini text-embedding-004.
 * Gracefully degrades to deterministic fallback if API key is not supplied.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
        config: {
          outputDimensionality: EMBEDDING_DIMENSION,
        },
      });

      const resAny = response as any;
      const values: number[] | undefined = resAny?.embeddings?.[0]?.values ?? resAny?.embedding?.values;
      if (values && values.length === EMBEDDING_DIMENSION) {
        return values;
      }
    } catch (error) {
      console.warn('Gemini embedding API call failed, using deterministic embedding fallback:', error);
    }
  }

  return generateDeterministicEmbedding(text);
}

/**
 * Calculates cosine similarity between two float vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Formats vector as PostgreSQL pgvector string: '[0.123, -0.456, ...]'
 */
export function formatPgVector(vec: number[]): string {
  return `[${vec.join(',')}]`;
}
