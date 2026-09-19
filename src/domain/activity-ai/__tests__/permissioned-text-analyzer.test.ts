import { describe, it, expect } from 'vitest';
import { analyzePermissionedText } from '../permissioned-text-analyzer';

describe('FR-27: Permissioned Text Analyzer', () => {
  it('strictly rejects analysis when user consent token is missing', () => {
    const result = analyzePermissionedText({
      text: 'Shubhali xabar matni',
      sourceContext: 'user_submitted',
      userConsentToken: '', // No consent
    });

    expect(result.isAuthorized).toBe(false);
    expect(result.verdict).toBe('uncertain');
    expect(result.explanation).toContain('ochiq roziligi');
  });

  it('detects multiple threat and fraud signals with high confidence', () => {
    const result = analyzePermissionedText({
      text: 'Tezda karta raqamingizni yuboring va sms kodni ayting, bo‘lmasa seni o‘ldiraman!',
      sourceContext: 'user_submitted',
      userConsentToken: 'consent-token-abc',
    });

    expect(result.isAuthorized).toBe(true);
    expect(result.verdict).toBe('risk_detected');
    expect(result.detectedCategories).toContain('fraud');
    expect(result.detectedCategories).toContain('threat');
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it('marks isolated ambiguous signals as uncertain to prevent premature accusation', () => {
    const result = analyzePermissionedText({
      text: 'lattachaynar bir ishni eplay olmaysan',
      sourceContext: 'user_submitted',
      userConsentToken: 'consent-token-123',
    });

    expect(result.isAuthorized).toBe(true);
    expect(result.verdict).toBe('uncertain');
    expect(result.isAccusationPrevented).toBe(true);
    expect(result.explanation).toContain('ayblov qo‘ymaslik');
  });
});
