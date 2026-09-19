// ============================================================
// FAST DECISION TESTLARI — tezkor bloklist + verdict cache
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkFastBlocklist, addToBlocklist,
  getCachedVerdict, setCachedVerdict, clearVerdictCache,
} from './fast-decision';
import { analyzeContent } from './brain';
import { initializeDefaultKnowledge } from './knowledge-graph';

describe('Tezkor bloklist', () => {
  it('porn aktrisalar nomi bloklanadi', () => {
    expect(checkFastBlocklist('eva elfie video')?.category).toBe('adult_performer');
    expect(checkFastBlocklist('mia khalifa photos')?.category).toBe('adult_performer');
  });

  it('explicit iboralar bloklanadi', () => {
    expect(checkFastBlocklist('hot girl photos')?.category).toBe('explicit_phrase');
    expect(checkFastBlocklist('free porn video')?.category).toBe('explicit_phrase');
    expect(checkFastBlocklist('erotic video download')?.category).toBe('explicit_phrase');
  });

  it('oddiy matn bloklanmaydi', () => {
    expect(checkFastBlocklist('cooking recipe book')).toBeNull();
    expect(checkFastBlocklist('men kitob o\'qiyapman')).toBeNull();
  });

  it('custom blocklist qo\'shilgan atama bloklanadi', () => {
    addToBlocklist('xyzcustomterm');
    expect(checkFastBlocklist('see xyzcustomterm here')?.category).toBe('custom');
  });
});

describe('Verdict cache', () => {
  beforeEach(() => {
    clearVerdictCache();
  });

  it('saqlangan verdict qaytadi', () => {
    setCachedVerdict('some test content', 'harmful', 0.9, true);
    const c = getCachedVerdict('some test content');
    expect(c?.verdict).toBe('harmful');
    expect(c?.should_block).toBe(true);
  });

  it('saqlanmagan kontent uchun null', () => {
    expect(getCachedVerdict('never seen this before xyz')).toBeNull();
  });

  it('normalizatsiya: katta/kichik harf farqi yo\'q', () => {
    setCachedVerdict('Hello World', 'safe', 0.8, false);
    expect(getCachedVerdict('hello world')?.verdict).toBe('safe');
  });
});

describe('Integratsiya — analyzeContent tezkor qatlam', () => {
  beforeEach(() => {
    initializeDefaultKnowledge();
    clearVerdictCache();
  });

  it('blocklist atamasi analyzeContent\'da bloklanadi', () => {
    const r = analyzeContent('eva elfie new video');
    expect(r.should_block).toBe(true);
    expect(r.verdict).toBe('harmful');
  });

  it('ikkinchi chaqiruv cache\'dan keladi (tezroq)', () => {
    const r1 = analyzeContent('free porn videos here');
    expect(r1.should_block).toBe(true);
    // Ikkinchi marta — cache yoki blocklist, baribir harmful
    const r2 = analyzeContent('free porn videos here');
    expect(r2.should_block).toBe(true);
  });
});
