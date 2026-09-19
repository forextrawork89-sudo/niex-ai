import { describe, expect, it } from 'vitest';
import { buildKnowledgeBase } from '../builder';
import { collectDataset, verifyDatasetChecksum } from '../dataset-collector';
import { extractKnowledge } from '../knowledge-extractor';
import { normalizeKnowledge } from '../knowledge-normalizer';
import { buildKnowledgeGraph } from '../knowledge-graph-builder';
import { validateKnowledge } from '../knowledge-validator';
import { compressKnowledge } from '../knowledge-compressor';
import { searchKnowledge, hybridSearch } from '../knowledge-search';
import { appendKnowledge, createVersion } from '../incremental-learning';

describe('KB builder', () => {
  it('collects and verifies dataset contents', async () => {
    const collection = await collectDataset();
    expect(collection.records.length).toBeGreaterThan(0);
    const result = await verifyDatasetChecksum(collection);
    expect(result.valid).toBe(true);
  });

  it('ingests the canonical knowledge_base markdown files when available', async () => {
    const collection = await collectDataset();
    const localKbRecords = collection.records.filter((record) => record.metadata.filePath?.toString().includes('knowledge_base') || record.source.includes('knowledge_base'));
    expect(localKbRecords.length).toBeGreaterThan(0);
    expect(localKbRecords[0].text.length).toBeGreaterThan(0);
  });

  it('records real ingestion metadata for each source', async () => {
    const collection = await collectDataset([{ id: 'local-sample', name: 'Local sample', kind: 'custom', url: 'https://example.com/sample', format: 'txt' }]);
    expect(collection.records.length).toBeGreaterThan(0);
    expect(collection.records[0].metadata.filePath).toBeTruthy();
    expect(collection.records[0].metadata.downloadStatus).toBeDefined();
  });

  it('extracts and normalizes knowledge into unified items', () => {
    const extracted = extractKnowledge([{ id: '1', source: 'https://example.org', sourceType: 'official', contentType: 'txt', text: 'Policy example text', checksum: 'abc', dedupKey: 'k', metadata: {} }]);
    const normalized = normalizeKnowledge(extracted);
    expect(normalized[0].id).toBeTruthy();
    expect(normalized[0].concepts.length).toBeGreaterThan(0);
  });

  it('builds a graph and validates it', () => {
    const extracted = extractKnowledge([{ id: '1', source: 'https://example.org', sourceType: 'official', contentType: 'txt', text: 'Policy example text', checksum: 'abc', dedupKey: 'k', metadata: {} }]);
    const normalized = normalizeKnowledge(extracted);
    const graph = buildKnowledgeGraph(normalized);
    const validation = validateKnowledge(normalized, graph);
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(validation.issues.length).toBeGreaterThanOrEqual(0);
  });

  it('compresses and searches knowledge', () => {
    const extracted = extractKnowledge([{ id: '1', source: 'https://example.org', sourceType: 'official', contentType: 'txt', text: 'Policy example text', checksum: 'abc', dedupKey: 'k', metadata: {} }]);
    const normalized = normalizeKnowledge(extracted);
    const compression = compressKnowledge(normalized);
    const results = searchKnowledge(normalized, 'policy');
    const hybrid = hybridSearch(normalized, 'policy');
    expect(compression.chunkCount).toBeGreaterThan(0);
    expect(results.length).toBeGreaterThan(0);
    expect(hybrid.length).toBeGreaterThan(0);
  });

  it('supports incremental updates and versions', () => {
    const one = normalizeKnowledge(extractKnowledge([{ id: '1', source: 'https://example.org', sourceType: 'official', contentType: 'txt', text: 'Policy example text', checksum: 'abc', dedupKey: 'k', metadata: {} }]));
    const two = normalizeKnowledge(extractKnowledge([{ id: '2', source: 'https://example.org/2', sourceType: 'custom', contentType: 'json', text: 'Second policy item', checksum: 'def', dedupKey: 'k2', metadata: {} }]));
    const merged = appendKnowledge(one, two);
    const version = createVersion(merged);
    expect(merged.length).toBe(2);
    expect(version.version).toBeTruthy();
  });

  it('classifies harmful and safe retrieval evidence distinctly', () => {
    const extracted = extractKnowledge([
      { id: '1', source: 'https://example.org/scam', sourceType: 'official', contentType: 'txt', text: 'Urgent phishing account verification scam asks users to enter passwords and click now', checksum: 'abc', dedupKey: 'k', metadata: {} },
      { id: '2', source: 'https://example.org/prevention', sourceType: 'official', contentType: 'txt', text: 'Educational article about phishing prevention and safe awareness for children', checksum: 'def', dedupKey: 'k2', metadata: {} },
    ]);
    const normalized = normalizeKnowledge(extracted);
    const harmful = normalized[0];
    const safe = normalized[1];
    const results = searchKnowledge(normalized, 'phishing');
    const harmfulResult = results.find((result) => result.item.id === harmful.id);
    const safeResult = results.find((result) => result.item.id === safe.id);

    expect(harmfulResult?.evidenceType).toBe('harmful');
    expect(harmfulResult?.relevance).toBe('high');
    expect(safeResult?.evidenceType).toBe('safe');
    expect(['medium', 'high']).toContain(safeResult?.relevance);
  });

  it('builds a full KB pipeline', async () => {
    const result = await buildKnowledgeBase();
    expect(result.success).toBe(true);
    expect(result.normalized.length).toBeGreaterThan(0);
    expect(result.graph.nodes.length).toBeGreaterThan(0);
  });
});
