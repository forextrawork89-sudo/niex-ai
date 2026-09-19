import { describe, it, expect } from 'vitest';
import { analyzeContentWithContext } from '../safe-context-analyzer';

describe('FR-07b: Safe Context Analyzer', () => {
  it('does not block medical articles discussing intimate health or cancer', () => {
    const text = 'Ushbu tibbiy maqolada ko‘krak bezi saratoni alomatlari, davolash usullari va shifokor maslahatlari batafsil yoritilgan.';
    const result = analyzeContentWithContext({ text, language: 'uz' });

    expect(result.verdict).toBe('allow');
    expect(result.isSafeContext).toBe(true);
    expect(result.detectedCategory).toBe('medical');
    expect(result.snippet.length).toBeLessThanOrEqual(500);
    expect(result.contentHash).toBeDefined();
  });

  it('does not block biological textbook text discussing reproduction or anatomy', () => {
    const text = '8-sinf biologiya darsi: Odam anatomiyasi va reproduktiv tizimning fiziologik rivojlanishi bo‘yicha o‘quv qo‘llanma.';
    const result = analyzeContentWithContext({ text, language: 'uz' });

    expect(result.verdict).toBe('allow');
    expect(result.isSafeContext).toBe(true);
    expect(result.detectedCategory).toBe('biology_education');
  });

  it('does not block news reports covering gambling raids', () => {
    const text = 'Rasmiy yangiliklar: Ichki ishlar vazirligi matbuot xizmati noqonuniy kazino va 1xbet bukmeker uyasini fosh etganini xabar beradi.';
    const result = analyzeContentWithContext({ text, language: 'uz' });

    expect(result.verdict).toBe('allow');
    expect(result.isSafeContext).toBe(true);
    expect(result.detectedCategory).toBe('news_reporting');
  });

  it('blocks blatant pornography and adult spam lacking safe context', () => {
    const text = 'Watch best porn video hardcore sex and adult clips online free.';
    const result = analyzeContentWithContext({ text, language: 'en' });

    expect(result.verdict).toBe('block');
    expect(result.isSafeContext).toBe(false);
    expect(result.detectedCategory).toBe('harmful_candidate');
  });

  it('strictly caps the snippet sent to server to 500 characters', () => {
    const longText = 'A'.repeat(2500);
    const result = analyzeContentWithContext({ text: longText });

    expect(result.snippet.length).toBe(500);
    expect(result.metrics.textLength).toBe(2500);
    expect(result.contentHash.length).toBeGreaterThan(0);
  });
});
