import { describe, expect, it } from 'vitest';
import { runReasoningPipeline } from './pipeline-runner';

describe('reasoning pipeline', () => {
  it('builds a multi-stage context and avoids blocking on ambiguous educational text', async () => {
    const result = await runReasoningPipeline({
      text: 'This article explains how to prevent sexual exploitation and protect children in a medical education context.',
      contentType: 'text',
      metadata: { source: 'test', language: 'en' },
    });

    expect(result.pipelineSummary.stageResults.length).toBeGreaterThanOrEqual(6);
    expect(result.context.intentSummary).toContain('education');
    expect(result.policyAction.action).not.toBe('block');
  });

  it('blocks only after reasoning when the evidence is strong and intent is harmful', async () => {
    const result = await runReasoningPipeline({
      text: 'Download explicit pornographic videos and join the adult content community now.',
      contentType: 'text',
      metadata: { source: 'test', language: 'en' },
    });

    expect(result.policyAction.action).toBe('block');
    expect(result.riskScores.explicitness).toBeGreaterThan(0.6);
    expect(result.reasoningSummary.supportingEvidence.length).toBeGreaterThan(0);
  });
});
