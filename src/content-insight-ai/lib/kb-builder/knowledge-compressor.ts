import type { CompressionChunk, KnowledgeCompressionResult, NormalizedKnowledgeItem } from './types';

export function compressKnowledge(items: NormalizedKnowledgeItem[]): KnowledgeCompressionResult {
  const chunks: CompressionChunk[] = [];
  const index: Record<string, { chunkIndex: number; offset: number }> = {};
  const chunkSize = 8;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunks.push({ index: chunks.length, items: chunk });
  }

  const serialized = new TextEncoder().encode(JSON.stringify(items));
  for (const chunk of chunks) {
    for (const item of chunk.items) {
      index[item.id] = { chunkIndex: chunk.index, offset: chunk.items.indexOf(item) };
    }
  }

  return {
    chunks,
    index,
    serialized,
    serializedSize: serialized.byteLength,
    chunkCount: chunks.length,
  };
}

export function loadCompressedKnowledge(chunk: CompressionChunk): NormalizedKnowledgeItem[] {
  return chunk.items;
}
