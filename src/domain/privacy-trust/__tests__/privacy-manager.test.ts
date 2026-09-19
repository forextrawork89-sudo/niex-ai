import { describe, it, expect } from 'vitest';
import { PrivacyManager } from '../privacy-manager';

describe('PrivacyManager (FR-35)', () => {
  it('records consent versioning and retrieves active consent', () => {
    const manager = new PrivacyManager();
    const consent = manager.recordConsent({
      childId: 'child-1',
      guardianId: 'guard-1',
      version: 'v1.2',
      categoriesConsented: ['web_safety', 'time_limits', 'safe_zones'],
      isChildNotified: true,
    });

    expect(consent.consentId).toMatch(/^cns-/);
    expect(consent.version).toBe('v1.2');

    const retrieved = manager.getConsent('child-1');
    expect(retrieved?.version).toBe('v1.2');
  });

  it('automatically suspends parental monitoring upon reaching age 18 (FR-35)', () => {
    const manager = new PrivacyManager();
    // Birth date 19 years ago
    const adultBirth = new Date(Date.now() - 19 * 365.25 * 24 * 60 * 60 * 1000).toISOString();

    const check = manager.checkAgeMilestone('child-18', adultBirth);
    expect(check.isAdult).toBe(true);
    expect(check.monitoringSuspended).toBe(true);
    expect(manager.isMonitoringSuspended('child-18')).toBe(true);

    const audits = manager.getDeletionAudits();
    expect(audits.some((a) => a.requestedBy === 'system_age_18')).toBe(true);
  });

  it('maintains active protection for minors under 18', () => {
    const manager = new PrivacyManager();
    // 12 years old
    const minorBirth = new Date(Date.now() - 12 * 365.25 * 24 * 60 * 60 * 1000).toISOString();

    const check = manager.checkAgeMilestone('child-12', minorBirth);
    expect(check.isAdult).toBe(false);
    expect(check.monitoringSuspended).toBe(false);
  });

  it('tracks immediate deletion requests with audit records', () => {
    const manager = new PrivacyManager();
    const record = manager.recordDeletion({
      childId: 'child-1',
      requestedBy: 'guardian',
      categoriesDeleted: ['location_history'],
      reason: 'Foydalanuvchi talabi bilan tozalash',
    });

    expect(record.deletionId).toMatch(/^del-/);
    expect(record.categoriesDeleted).toContain('location_history');

    const audits = manager.getDeletionAudits();
    expect(audits.length).toBe(1);
  });
});
