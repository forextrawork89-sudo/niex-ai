// ============================================================
// BRAIN TESTLARI — to'liq verdict (analyzeContent)
//
// End-to-end: matn → verdict (harmful/safe/uncertain) + should_block.
// Bu butun ensemble + senior reasoning pipeline'ni tekshiradi.
// ============================================================

import { describe, it, expect, beforeAll } from 'vitest';
import { analyzeContent } from './brain';
import { initializeDefaultKnowledge } from './knowledge-graph';

beforeAll(() => {
  initializeDefaultKnowledge();
});

describe('analyzeContent — zararli kontent bloklanadi', () => {
  it('aniq pornografik matn → harmful + block', () => {
    const r = analyzeContent('free porn xxx videos nude download');
    expect(r.verdict).toBe('harmful');
    expect(r.should_block).toBe(true);
  });

  it('qimor brendi → harmful', () => {
    const r = analyzeContent('1xbet mostbet casino bonus jackpot');
    expect(r.verdict).toBe('harmful');
  });

  it('narkotik → harmful', () => {
    const r = analyzeContent('buy cocaine heroin lsd online drug dealer');
    expect(r.verdict).toBe('harmful');
  });

  it('rus jinsiy kontent → harmful', () => {
    const r = analyzeContent('порно видео секс смотреть голые');
    expect(r.verdict).toBe('harmful');
  });
});

describe('analyzeContent — xavfsiz kontent o\'tadi (FALSE POSITIVE yo\'q)', () => {
  it('ta\'limiy matn → bloklanmaydi', () => {
    const r = analyzeContent('education learning school university course study');
    expect(r.should_block).toBe(false);
    expect(r.verdict).not.toBe('harmful');
  });

  it('oddiy o\'zbekcha gap → bloklanmaydi', () => {
    const r = analyzeContent('men bugun kitob o\'qidim va maktabga bordim');
    expect(r.should_block).toBe(false);
  });

  it('pishirish retsepti → bloklanmaydi', () => {
    const r = analyzeContent('cooking recipe food kitchen ingredients bake');
    expect(r.should_block).toBe(false);
    expect(r.verdict).not.toBe('harmful');
  });

  it('oddiy inglizcha gap → bloklanmaydi', () => {
    const r = analyzeContent('hello how are you doing today my friend');
    expect(r.should_block).toBe(false);
  });
});

describe('analyzeContent — natija strukturasi to\'g\'ri', () => {
  it('barcha kerakli maydonlar mavjud', () => {
    const r = analyzeContent('test content');
    expect(r).toHaveProperty('verdict');
    expect(r).toHaveProperty('confidence');
    expect(r).toHaveProperty('should_block');
    expect(r).toHaveProperty('risk_level');
    expect(r).toHaveProperty('recommendation');
    expect(['safe', 'harmful', 'uncertain']).toContain(r.verdict);
    expect(r.confidence).toBeGreaterThanOrEqual(0);
    expect(r.confidence).toBeLessThanOrEqual(1);
  });

  it('routes browser text analysis through the AI Core', () => {
    const r = analyzeContent('download explicit pornographic videos now');
    expect((r as any).ai_core).toBeDefined();
    expect((r as any).ai_core.policyAction).toBeDefined();
    expect((r as any).ai_core.verdict).toBe('harmful');
  });
});
