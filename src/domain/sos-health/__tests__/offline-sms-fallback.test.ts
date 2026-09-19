import { describe, it, expect } from 'vitest';
import { OfflineSmsFallbackService } from '../offline-sms-fallback';

describe('FR-23b: Offline SMS Fallback', () => {
  it('dispatches minimal emergency SMS when Android platform and permission exist', () => {
    const service = new OfflineSmsFallbackService(true, true); // Android + SMS permission
    const result = service.sendOfflineSosSms({
      guardianPhoneNumber: '+998901234567',
      childName: 'Jasur',
      coordinates: { lat: 41.3111, lng: 69.2797 },
    });

    expect(result.success).toBe(true);
    expect(result.capability).toBe('supported');
    expect(result.payload?.message).toContain('SOS! Jasur favqulodda signal yubordi');
    expect(result.payload?.message).toContain('41.3111,69.2797');
    expect(result.payload?.recipientPhoneNumber).toBe('+998901234567');
  });

  it('reports capability as UNSUPPORTED when SMS permission is unavailable', () => {
    const service = new OfflineSmsFallbackService(true, false); // No SMS permission
    const result = service.sendOfflineSosSms({
      guardianPhoneNumber: '+998901234567',
      childName: 'Jasur',
    });

    expect(result.success).toBe(false);
    expect(result.capability).toBe('unsupported');
    expect(result.error).toContain('UNSUPPORTED');
  });

  it('reports capability as UNSUPPORTED on non-Android platforms', () => {
    const service = new OfflineSmsFallbackService(false, true); // iOS or Web
    const result = service.sendOfflineSosSms({
      guardianPhoneNumber: '+998901234567',
      childName: 'Jasur',
    });

    expect(result.success).toBe(false);
    expect(result.capability).toBe('unsupported');
    expect(result.error).toContain('faqat Android');
  });
});
