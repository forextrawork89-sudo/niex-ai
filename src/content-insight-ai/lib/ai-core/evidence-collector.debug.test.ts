import { describe, it, expect } from 'vitest';
import { collectEvidence } from './evidence-collector';
import { processContent } from './orchestrator';

describe('Evidence collector validation tests', () => {
  it('collects explicit harmful evidence', async () => {
    const result = collectEvidence({
      text: 'Download explicit pornographic videos and join the adult content community now.',
      textLength: 80,
      hasText: true,
      hasImage: false,
      hasVideo: false,
      hasAudio: false,
      metadata: { source: 'test' },
      contentType: 'text',
      sourceSummary: 'text',
    });
    expect(result.success).toBe(true);
    expect(result.evidenceItems.length).toBeGreaterThan(0);

    const full = await processContent({
      requestId: 'debug-explicit',
      text: 'Download explicit pornographic videos and join the adult content community now.',
      contentType: 'text',
      metadata: { source: 'test' },
    });
    expect(full.success).toBe(true);
    expect(full.decisionResult).toBeDefined();
  });

  it('collects ambiguous educational evidence', async () => {
    const result = collectEvidence({
      text: 'This article explains how to prevent sexual exploitation and protect children in a medical education context.',
      textLength: 120,
      hasText: true,
      hasImage: false,
      hasVideo: false,
      hasAudio: false,
      metadata: { source: 'test' },
      contentType: 'text',
      sourceSummary: 'text',
    });
    expect(result.success).toBe(true);

    const full = await processContent({
      requestId: 'debug-educational',
      text: 'This article explains how to prevent sexual exploitation and protect children in a medical education context.',
      contentType: 'text',
      metadata: { source: 'test' },
    });
    expect(full.success).toBe(true);
    expect(full.decisionResult).toBeDefined();
  });
});
