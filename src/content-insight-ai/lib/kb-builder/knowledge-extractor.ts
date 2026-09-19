import type { DatasetRecord, ExtractedKnowledgeItem } from './types';

function extractText(content: string): string {
  return content.replace(/\s+/g, ' ').trim();
}

function parseStructuredText(content: string): Record<string, unknown> {
  const lines = content.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return { lines, count: lines.length };
}

export function extractKnowledge(records: DatasetRecord[]): ExtractedKnowledgeItem[] {
  return records.map((record, index) => ({
    id: `extracted-${index + 1}`,
    source: record.source,
    sourceKind: record.sourceType,
    contentType: record.contentType,
    rawText: extractText(record.text),
    structured: parseStructuredText(record.text),
    metadata: {
      sourceId: record.id,
      checksum: record.checksum,
      dedupKey: record.dedupKey,
      contentType: record.contentType,
    },
  }));
}

export function extractFromText(text: string, source = 'text'): ExtractedKnowledgeItem {
  return {
    id: `text-${Date.now()}`,
    source,
    sourceKind: 'text',
    contentType: 'text',
    rawText: extractText(text),
    structured: parseStructuredText(text),
    metadata: { source },
  };
}
