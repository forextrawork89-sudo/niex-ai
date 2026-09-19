import { describe, it, expect } from 'vitest';
import { TamperProtectionService } from '../tamper-protection-service';

describe('TamperProtectionService (FR-37)', () => {
  it('enforces 6-digit PIN format and verifies correct PIN', () => {
    const service = new TamperProtectionService();

    expect(() => service.setPin('12345')).toThrow('aniq 6 ta raqam');
    expect(() => service.setPin('1234567')).toThrow('aniq 6 ta raqam');
    expect(() => service.setPin('abcdef')).toThrow('aniq 6 ta raqam');

    service.setPin('123456');
    expect(service.hasPin()).toBe(true);

    const check = service.verifyPin('123456');
    expect(check.success).toBe(true);
  });

  it('triggers 15-minute lock after 5 failed attempts (FR-37)', () => {
    const service = new TamperProtectionService();
    service.setPin('999888');

    for (let i = 1; i <= 4; i++) {
      const res = service.verifyPin('000000');
      expect(res.success).toBe(false);
      expect(res.remainingAttempts).toBe(5 - i);
    }

    const fifthAttempt = service.verifyPin('000000');
    expect(fifthAttempt.success).toBe(false);
    expect(fifthAttempt.remainingAttempts).toBe(0);
    expect(fifthAttempt.lockedUntil).toBeDefined();

    // Consecutive attempt during lockout
    const duringLock = service.verifyPin('999888');
    expect(duringLock.success).toBe(false);
    expect(duringLock.error).toContain('bloklandi');
  });

  it('provides transparent non-accusatory platform capability details', () => {
    const service = new TamperProtectionService();
    const doInfo = service.getCapabilityInfo('android_device_owner');
    expect(doInfo.canPreventUninstall).toBe(true);
    expect(doInfo.explanation).toContain('Device Owner');

    const iosInfo = service.getCapabilityInfo('ios_standard');
    expect(iosInfo.canPreventUninstall).toBe(false);
    expect(iosInfo.explanation).toContain('Apple');
  });

  it('handles uninitialized PIN and resets PIN with valid account authentication', () => {
    const service = new TamperProtectionService();
    expect(service.hasPin()).toBe(false);
    const checkUninit = service.verifyPin('123456');
    expect(checkUninit.success).toBe(false);
    expect(checkUninit.error).toContain('PIN-kod hali o‘rnatilmagan');

    expect(() => service.resetPinWithAccountAuth('short', '654321')).toThrow('yaroqsiz');

    const resetSuccess = service.resetPinWithAccountAuth('auth-token-valid-12345', '654321');
    expect(resetSuccess).toBe(true);
    expect(service.hasPin()).toBe(true);
    expect(service.verifyPin('654321').success).toBe(true);
  });
});
