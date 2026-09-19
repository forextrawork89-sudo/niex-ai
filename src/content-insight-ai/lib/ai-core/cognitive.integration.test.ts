import { describe, it, expect } from 'vitest';
import { analyzeContent } from '../brain';

describe('Cognitive integration (browser-facing)', () => {
  it('includes cognitive stage in pipeline summary when analyzing content', () => {
    const res = analyzeContent('This is a test content about educational safety and prevention.', 'text');
    const stages = res.ai_core?.pipelineSummary?.stageResults || [];
    const cognitive = stages.find((s) => s.stage === 'cognitive');
    expect(cognitive).toBeDefined();
    expect(typeof cognitive.durationMs).toBe('number');
  });
});
