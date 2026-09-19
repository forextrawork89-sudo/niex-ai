// ============================================================
// O'RGANISH TESTLARI — foydalanuvchi feedback'dan o'rganish
//
// Eng muhim funksiya: foydalanuvchi "X ni blokla" desa, X bloklanishi kerak.
// Va o'rgatilmagan oddiy so'z bloklanmasligi kerak (false positive yo'q).
// ============================================================

import { describe, it, expect, beforeAll } from 'vitest';
import { analyzeContent, getLocalLLM } from './brain';
import { initializeDefaultKnowledge } from './knowledge-graph';

beforeAll(async () => {
  initializeDefaultKnowledge();
  const llm = getLocalLLM();
  await llm.initialize();
});

describe('Foydalanuvchi feedback o\'rganishi', () => {
  it('o\'rgatilgan zararli so\'z bloklanadi', async () => {
    const llm = getLocalLLM();
    // Ma'nosiz noyob so'z — patternlar uni bilmaydi
    llm.learnFromText('qwxzborbash', 'harmful');

    const r = analyzeContent('qwxzborbash');
    expect(r.should_block).toBe(true);
    expect(r.verdict).toBe('harmful');
  });

  it('o\'rgatilgan ibora to\'liq kelganda bloklanadi', async () => {
    const llm = getLocalLLM();
    llm.learnFromText('zzfoo zzbar', 'harmful');

    // Ibora to'liq mavjud → block
    const r = analyzeContent('zzfoo zzbar video');
    expect(r.verdict).toBe('harmful');
  });

  it('FALSE POSITIVE yo\'q: ibora to\'liq bo\'lmasa bloklanmaydi', async () => {
    const llm = getLocalLLM();
    llm.learnFromText('aabb ccdd', 'harmful');

    // Faqat bitta token bor ("aabb"), to'liq ibora yo'q → bloklanmaydi
    const r = analyzeContent('aabb something unrelated normal text here');
    expect(r.should_block).toBe(false);
  });

  it('o\'rgatilmagan oddiy so\'z bloklanmaydi', () => {
    const r = analyzeContent('randomwordxyz123');
    expect(r.should_block).toBe(false);
  });
});
