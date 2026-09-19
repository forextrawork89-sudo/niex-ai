import { describe, it, expect } from 'vitest';
import { analyzePermissionedPageSafety } from '../page-safety-analyzer';

describe('FR-30b: Permissioned Page Safety Analyzer', () => {
  it('blocks high-confidence phishing page with brand mismatch and card inputs', () => {
    const evaluation = analyzePermissionedPageSafety({
      hasPasswordInput: true,
      hasCreditCardInput: true,
      hasLoginForm: true,
      brandSignals: ['payme'],
      pageTitle: 'Payme tizimiga kirish va kartani tasdiqlash',
      domain: 'free-bonus-site.xyz',
    });

    expect(evaluation.verdict).toBe('BLOCK');
    expect(evaluation.isPhishingSuspect).toBe(true);
    expect(evaluation.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it('warns when signals are suspicious but confidence is below strict block threshold', () => {
    const evaluation = analyzePermissionedPageSafety({
      hasPasswordInput: true,
      hasCreditCardInput: false,
      hasLoginForm: true,
      brandSignals: ['click'],
      pageTitle: 'Shaxsiy kabinet',
      domain: 'somestore-click-partner.uz',
    });

    expect(evaluation.verdict).toBe('WARN');
    expect(evaluation.confidence).toBeLessThan(0.85);
    expect(evaluation.confidence).toBeGreaterThanOrEqual(0.45);
  });

  it('marks safe page with standard form as SAFE', () => {
    const evaluation = analyzePermissionedPageSafety({
      hasPasswordInput: false,
      hasCreditCardInput: false,
      hasLoginForm: false,
      brandSignals: [],
      pageTitle: 'O‘zbekiston tarixi maqolasi',
      domain: 'tarix.uz',
    });

    expect(evaluation.verdict).toBe('SAFE');
    expect(evaluation.isPhishingSuspect).toBe(false);
  });
});
