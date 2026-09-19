import { describe, expect, it } from 'vitest';
import { buildKnowledgeBase } from '../builder';

describe('KB ingestion integration', () => {
  it('builds a knowledge base with metadata and graph structure', async () => {
    const result = await buildKnowledgeBase({ changelog: ['integration-test'] });
    expect(result.success).toBe(true);
    expect(result.normalized.length).toBeGreaterThan(0);
    expect(result.graph.nodes.length).toBeGreaterThan(0);
    expect(result.graph.edges.length).toBeGreaterThanOrEqual(0);
  });
});
