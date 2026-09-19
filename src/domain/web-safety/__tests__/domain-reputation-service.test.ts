import { describe, it, expect } from 'vitest';
import {
  checkDomainReputation,
  sanitizeInputForAI,
  reportFalsePositive,
  getFalsePositiveReports,
  OFFICIAL_LOCAL_DOMAINS,
} from '../domain-reputation-service';

describe('FR-30: Domain Reputation & Phishing Protection', () => {
  it('blocks known threat domains with high confidence', () => {
    const result = checkDomainReputation('https://payme-security.click/login');
    expect(result.verdict).toBe('BLOCK');
    expect(result.threatType).toBe('known_phishing');
    expect(result.confidence).toBeGreaterThanOrEqual(0.95);
  });

  it('blocks when a known threat source appears in the redirect chain', () => {
    const result = checkDomainReputation('https://short.link/xyz', ['https://payme-login.com']);
    expect(result.verdict).toBe('BLOCK');
    expect(result.threatType).toBe('known_phishing');
  });

  it('allows verified official banking and government domains', () => {
    const result1 = checkDomainReputation('https://my.gov.uz/oz');
    expect(result1.verdict).toBe('ALLOW');
    expect(result1.targetBrand).toContain('davlat');

    const result2 = checkDomainReputation('https://payme.uz');
    expect(result2.verdict).toBe('ALLOW');
    expect(result2.targetBrand).toBe('Payme');
  });

  it('warns on typosquatting and brand spoofing of local banks', () => {
    // Brand affix spoofing
    const result1 = checkDomainReputation('kapitalbank-online.com');
    expect(result1.verdict).toBe('WARN');
    expect(result1.threatType).toBe('impersonation');
    expect(result1.isLocalTargetSpoof).toBe(true);

    // Typosquatting (1-2 distance)
    const result2 = checkDomainReputation('clik.uz');
    expect(result2.verdict).toBe('WARN');
    expect(result2.threatType).toBe('typosquatting');
  });

  it('does NOT automatically mark unknown domains as phishing', () => {
    const result = checkDomainReputation('myrandomblog123.org');
    expect(result.verdict).toBe('UNKNOWN');
    expect(result.verdict).not.toBe('BLOCK');
    expect(result.reason).toContain('avtomatik phishing deb bloklanmaydi');
  });

  it('strictly redacts credit cards and passwords before AI processing', () => {
    const sensitive = 'Mening kartam: 8600 1234 5678 9999, CVV: 789, parol: MySecretPass!';
    const { sanitized, redactedTypes } = sanitizeInputForAI(sensitive);

    expect(sanitized).not.toContain('8600 1234 5678 9999');
    expect(sanitized).not.toContain('789');
    expect(sanitized).not.toContain('MySecretPass!');
    expect(sanitized).toContain('[REDACTED_CARD_NUMBER]');
    expect(sanitized).toContain('[REDACTED_CVV]');
    expect(sanitized).toContain('[REDACTED_PASSWORD]');
    expect(redactedTypes).toContain('credit_card');
    expect(redactedTypes).toContain('cvv');
    expect(redactedTypes).toContain('password');
  });

  it('records and retrieves false positive reports', () => {
    const report = reportFalsePositive({
      domain: 'safe-student-forum.uz',
      reportedBy: 'user-guardian-1',
      userReason: 'Bu maktab forumi, noto‘g‘ri ogohlantirish berildi.',
    });

    expect(report.id).toBeDefined();
    expect(report.status).toBe('pending');
    const all = getFalsePositiveReports();
    expect(all.some((r) => r.domain === 'safe-student-forum.uz')).toBe(true);
  });
});
