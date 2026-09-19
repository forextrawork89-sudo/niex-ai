// ============================================================
// SEMANTIC ANALYZER TESTLARI — zararli kontent aniqlash
//
// Eng muhim deterministik qatlam: HARMFUL_PATTERNS keyword detection.
// Har o'zgartirishdan keyin `npm test` — agar biror narsa buzilsa, darrov bilamiz.
// ============================================================

import { describe, it, expect } from 'vitest';
import { analyzeText } from './semantic-analyzer';

const HARMFUL = 0.6;  // bundan yuqori = zararli
const SAFE = 0.5;     // bundan past = xavfsiz

function tox(text: string): number {
  return analyzeText(text).toxicity;
}

describe('Zararli kontent — ingliz tili', () => {
  it('jinsiy explicit bloklanadi', () => {
    expect(tox('free porn videos download')).toBeGreaterThan(HARMFUL);
    expect(tox('xxx adult content')).toBeGreaterThan(HARMFUL);
    expect(tox('nude naked photos')).toBeGreaterThan(HARMFUL);
  });

  it('so\'kinish (profanity) bloklanadi', () => {
    expect(tox('fuck this shit')).toBeGreaterThan(HARMFUL);
    expect(tox('you stupid bitch')).toBeGreaterThan(HARMFUL);
  });

  it('zo\'ravonlik bloklanadi', () => {
    expect(tox('how to kill someone')).toBeGreaterThan(HARMFUL);
    expect(tox('murder and torture')).toBeGreaterThan(HARMFUL);
  });

  it('o\'z joniga qasd bloklanadi', () => {
    expect(tox('suicide methods how to')).toBeGreaterThan(HARMFUL);
    expect(tox('self harm cutting')).toBeGreaterThan(HARMFUL);
  });
});

describe('Qimor (gambling) — kengaytirilgan', () => {
  it('brendlar bloklanadi', () => {
    expect(tox('1xbet bonus olish')).toBeGreaterThan(HARMFUL);
    expect(tox('mostbet promo code')).toBeGreaterThan(HARMFUL);
    expect(tox('vulkan casino')).toBeGreaterThan(HARMFUL);
  });

  it('terminlar bloklanadi', () => {
    expect(tox('online casino real money')).toBeGreaterThan(HARMFUL);
    expect(tox('aviator game crash')).toBeGreaterThan(HARMFUL);
    expect(tox('slot machine jackpot')).toBeGreaterThan(HARMFUL);
  });

  it('domenlar bloklanadi', () => {
    expect(tox('visit casino777.com now')).toBeGreaterThan(HARMFUL);
    expect(tox('bet365.net registration')).toBeGreaterThan(HARMFUL);
  });
});

describe('Narkotik (drugs) — kengaytirilgan', () => {
  it('moddalar bloklanadi', () => {
    expect(tox('buy cocaine online')).toBeGreaterThan(HARMFUL);
    expect(tox('lsd mdma ecstasy')).toBeGreaterThan(HARMFUL);
    expect(tox('crystal meth fentanyl')).toBeGreaterThan(HARMFUL);
  });

  it('slang bloklanadi', () => {
    expect(tox('buy weed online')).toBeGreaterThan(HARMFUL);
    expect(tox('selling dope and coke')).toBeGreaterThan(HARMFUL);
  });
});

describe('Bola rivojiga zararli — viral challenge\'lar', () => {
  it('xavfli challenge\'lar bloklanadi', () => {
    expect(tox('blue whale challenge')).toBeGreaterThan(HARMFUL);
    expect(tox('blackout challenge tutorial')).toBeGreaterThan(HARMFUL);
    expect(tox('tide pod challenge')).toBeGreaterThan(HARMFUL);
  });
});

describe('Ko\'p tilli zararli kontent', () => {
  it('rus tili (Cyrillic)', () => {
    expect(tox('порно видео смотреть')).toBeGreaterThan(HARMFUL);
    expect(tox('казино онлайн ставки')).toBeGreaterThan(HARMFUL);
    expect(tox('наркотики закладка купить')).toBeGreaterThan(HARMFUL);
  });

  it('koreys tili (Hangul)', () => {
    expect(tox('마약 판매')).toBeGreaterThan(HARMFUL);
    expect(tox('포르노 영상')).toBeGreaterThan(HARMFUL);
  });

  it('xitoy tili (Han)', () => {
    expect(tox('色情视频')).toBeGreaterThan(HARMFUL);
    expect(tox('毒品贩卖')).toBeGreaterThan(HARMFUL);
  });

  it('o\'zbek tili', () => {
    expect(tox('pornografiya behayo rasm')).toBeGreaterThan(HARMFUL);
    expect(tox('qimor kazino tikish')).toBeGreaterThan(HARMFUL);
    expect(tox('giyohvand narkotik nasha')).toBeGreaterThan(HARMFUL);
  });

  it('turk tili', () => {
    expect(tox('porno seks izle')).toBeGreaterThan(HARMFUL);
    expect(tox('kumar bahis casino')).toBeGreaterThan(HARMFUL);
  });
});

describe('Uzbek safety and real-world persuasion language', () => {
  it('detects Uzbek scam and phishing-style persuasion language', () => {
    const result = analyzeText('Akkountingizni tezda tekshiring, parolni kiriting, bonus olish uchun hozir bosing');
    expect(result.toxicity).toBeGreaterThan(0.6);
    expect(result.context_signals.some((signal) => signal.signal.includes('scam') || signal.signal.includes('phishing') || signal.signal.includes('fraud') || signal.signal.includes('phishing_variant'))).toBe(true);
  });

  it('detects transliterated and misspelled scam language', () => {
    const result = analyzeText('Akkountni tezkor tekshiring, paswordni kiriting, bonusni olish uchun klik bosing');
    expect(result.toxicity).toBeGreaterThan(0.6);
  });

  it('detects suggestive euphemistic bait used in social media invites', () => {
    const result = analyzeText('Bu videoda maxsus taklif, faqat a\'zo bo\'lsangiz ochiladi, qizg\'in va jalb qiluvchi content');
    expect(result.toxicity).toBeGreaterThan(0.55);
    expect(result.context_signals.some((signal) => signal.signal.includes('suggestive') || signal.signal.includes('bait') || signal.signal.includes('invitation'))).toBe(true);
  });

  it('detects Uzbek social trend content with pose and camera focus as contextual risk', () => {
    const result = analyzeText('Yashirin video: tiktok challenge, tight frame va sexy pose bilan ko\'proq ko\'ring.');
    expect(result.toxicity).toBeGreaterThan(0.55);
    expect(result.context_signals.some((signal) => signal.signal === 'camera_focus')).toBe(true);
    expect(result.context_signals.some((signal) => signal.signal === 'pose_context')).toBe(true);
    expect(result.context_signals.some((signal) => signal.signal === 'movement_context')).toBe(true);
  });

  it('detects manipulative gambling invitation language', () => {
    const result = analyzeText('Tez pul ishlash va yutuq kafolati bilan qiziqarli taklif, hozir ro\'yxatdan o\'ting');
    expect(result.toxicity).toBeGreaterThan(0.55);
  });

  it('keeps educational prevention context from being over-flagged', () => {
    const result = analyzeText('Ushbu maqola jinsiy ekspluatatsiyani oldini olish va bolalarni himoya qilish haqida ta\'limiy ma\'lumot beradi');
    expect(result.toxicity).toBeLessThan(0.7);
    expect(result.context_signals.some((signal) => signal.signal.includes('prevention') || signal.signal.includes('education'))).toBe(true);
  });
});

describe('Xavfsiz kontent — FALSE POSITIVE bo\'lmasligi kerak (KRITIK)', () => {
  it('ta\'limiy kontent o\'tadi', () => {
    expect(tox('education learning school university')).toBeLessThan(SAFE);
    expect(tox('ta\'lim o\'qish maktab universitet')).toBeLessThan(SAFE);
  });

  it('oddiy kontent o\'tadi', () => {
    expect(tox('cooking recipe food kitchen')).toBeLessThan(SAFE);
    expect(tox('sport futbol musobaqa')).toBeLessThan(SAFE);
    expect(tox('family vacation travel')).toBeLessThan(SAFE);
  });

  it('tibbiy kontekst o\'tadi', () => {
    expect(tox('medical doctor health treatment')).toBeLessThan(SAFE);
  });

  it('oddiy gaplar bloklanmaydi', () => {
    expect(tox('men kitob o\'qiyapman')).toBeLessThanOrEqual(0.55);
    expect(tox('hello how are you today')).toBeLessThanOrEqual(0.55);
    expect(tox('привет как дела сегодня')).toBeLessThanOrEqual(0.55);
  });

  it('chegaraviy so\'zlar normal kontekstda o\'tadi', () => {
    // "pose" yakka holda zararli emas (faqat user o'rgatsa)
    expect(tox('picture poses photography')).toBeLessThanOrEqual(0.55);
    expect(tox('yoga pose meditation')).toBeLessThanOrEqual(0.55);
  });
});
