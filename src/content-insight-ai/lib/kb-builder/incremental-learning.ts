import type { KnowledgeBaseVersion, NormalizedKnowledgeItem } from './types';

export function appendKnowledge(existing: NormalizedKnowledgeItem[], incoming: NormalizedKnowledgeItem[]): NormalizedKnowledgeItem[] {
  const merged = [...existing];
  const seen = new Set(existing.map((item) => item.id));
  for (const item of incoming) {
    const candidateId = `${item.source}:${item.category}:${item.subcategory}:${item.concepts[0] || 'item'}`;
    if (!seen.has(candidateId)) {
      const normalizedItem = { ...item, id: candidateId };
      merged.push(normalizedItem);
      seen.add(candidateId);
    }
  }
  return merged;
}

export function createVersion(items: NormalizedKnowledgeItem[], changelog: string[] = []): KnowledgeBaseVersion {
  const payload = JSON.stringify(items);
  const checksum = `kb-${payload.length.toString(16)}`;
  return {
    version: `v${Date.now()}`,
    checksum,
    changelog,
    migrationInfo: ['incremental-update'],
    createdAt: new Date().toISOString(),
  };
}
