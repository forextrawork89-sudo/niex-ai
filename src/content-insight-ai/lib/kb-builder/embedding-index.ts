import type { NormalizedKnowledgeItem } from './types';

export interface EmbeddingVector {
  id: string;
  values: number[];
}

export interface EmbeddingIndex {
  vectors: EmbeddingVector[];
  metadata: Record<string, unknown>;
}

function hashToken(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function buildEmbeddingIndex(items: NormalizedKnowledgeItem[]): EmbeddingIndex {
  const vectors = items.map((item) => {
    const tokenText = [item.category, item.subcategory, item.intent, ...item.concepts, ...item.entities, ...item.tags].join(' ').toLowerCase();
    const values = Array.from({ length: 16 }, (_, idx) => ((hashToken(tokenText + idx.toString()) % 1000) / 1000));
    return { id: item.id, values };
  });
  return { vectors, metadata: { dimension: 16, strategy: 'hash-based' } };
}

export function nearestNeighborSearch(index: EmbeddingIndex, query: string): EmbeddingVector[] {
  const queryValues = Array.from({ length: 16 }, (_, idx) => ((hashToken(query + idx.toString()) % 1000) / 1000));
  return index.vectors
    .map((vector) => ({ vector, score: cosineSimilarity(vector.values, queryValues) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => entry.vector);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, value, idx) => sum + value * (b[idx] ?? 0), 0);
  const normA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const normB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return normA === 0 || normB === 0 ? 0 : dot / (normA * normB);
}
