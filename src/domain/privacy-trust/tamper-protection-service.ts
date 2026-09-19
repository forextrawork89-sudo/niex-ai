// FR-37: Tamper Protection, 6-digit Parent PIN, 15m Lockout & Non-Accusatory Capability Matrix

export type PlatformTamperCapability =
  | 'android_device_owner'
  | 'android_accessibility_normal'
  | 'ios_mdm_supervised'
  | 'ios_standard';

export interface TamperCapabilityInfo {
  capability: PlatformTamperCapability;
  canPreventUninstall: boolean;
  canLockSettings: boolean;
  canDetectAppRemoval: boolean;
  explanation: string;
}

export const TAMPER_CAPABILITY_MATRIX: Record<PlatformTamperCapability, TamperCapabilityInfo> = {
  android_device_owner: {
    capability: 'android_device_owner',
    canPreventUninstall: true,
    canLockSettings: true,
    canDetectAppRemoval: true,
    explanation: 'To‘liq Device Owner rejimi: ilovani o‘chirish va sozlamalarni o‘zgartirish tizim darajasida bloklangan.',
  },
  android_accessibility_normal: {
    capability: 'android_accessibility_normal',
    canPreventUninstall: false,
    canLockSettings: false,
    canDetectAppRemoval: true,
    explanation: 'Standart Android rejimi: ilovani o‘chirishni to‘liq bloklab bo‘lmaydi; o‘chirilganda yoki maxsus ruxsat olinganda vasiyga xabarnoma yuboriladi.',
  },
  ios_mdm_supervised: {
    capability: 'ios_mdm_supervised',
    canPreventUninstall: true,
    canLockSettings: true,
    canDetectAppRemoval: true,
    explanation: 'Apple MDM Supervised rejimi: profil orqali ilovani olib tashlash cheklangan.',
  },
  ios_standard: {
    capability: 'ios_standard',
    canPreventUninstall: false,
    canLockSettings: false,
    canDetectAppRemoval: true,
    explanation: 'Standart iOS rejimi: Apple xavfsizlik cheklovlari tufayli ilovani o‘chirish taqiqlanmaydi; faolsizlik holatida vasiyga bildirishnoma beriladi.',
  },
};

export class TamperProtectionService {
  private pinHash: string | null = null;
  private failedAttempts = 0;
  private lockedUntil: number | null = null;

  // Simple deterministic hash for demo/testing without external native dependencies
  private hashPin(pin: string): string {
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      hash = (hash << 5) - hash + pin.charCodeAt(i);
      hash |= 0;
    }
    return `pin-hash-${hash}`;
  }

  public setPin(pin: string): void {
    if (!/^\d{6}$/.test(pin)) {
      throw new Error('PIN-kod aniq 6 ta raqamdan iborat bo‘lishi shart (FR-37).');
    }
    this.pinHash = this.hashPin(pin);
    this.failedAttempts = 0;
    this.lockedUntil = null;
  }

  public hasPin(): boolean {
    return this.pinHash !== null;
  }

  public verifyPin(pin: string): { success: boolean; remainingAttempts?: number; lockedUntil?: string; error?: string } {
    const now = Date.now();
    if (this.lockedUntil && now < this.lockedUntil) {
      const waitSeconds = Math.ceil((this.lockedUntil - now) / 1000);
      return {
        success: false,
        lockedUntil: new Date(this.lockedUntil).toISOString(),
        error: `Ko‘p marta xato kiritildi. Tizim ${Math.ceil(waitSeconds / 60)} daqiqaga bloklandi (FR-37).`,
      };
    }

    if (!this.pinHash) {
      return { success: false, error: 'PIN-kod hali o‘rnatilmagan.' };
    }

    if (this.hashPin(pin) === this.pinHash) {
      this.failedAttempts = 0;
      this.lockedUntil = null;
      return { success: true };
    }

    this.failedAttempts++;
    if (this.failedAttempts >= 5) {
      // 15-minute lock
      this.lockedUntil = now + 15 * 60 * 1000;
      return {
        success: false,
        remainingAttempts: 0,
        lockedUntil: new Date(this.lockedUntil).toISOString(),
        error: '5 marta xato PIN kiritildi. Xavfsizlik yuzasidan 15 daqiqaga bloklandi.',
      };
    }

    return {
      success: false,
      remainingAttempts: 5 - this.failedAttempts,
      error: `Noto‘g‘ri PIN. Qolgan urinishlar: ${5 - this.failedAttempts}`,
    };
  }

  public resetPinWithAccountAuth(accountAuthToken: string, newPin: string): boolean {
    if (!accountAuthToken || accountAuthToken.length < 8) {
      throw new Error('Hisob qaydnomasi orqali tasdiqlash tokeni yaroqsiz.');
    }
    this.setPin(newPin);
    return true;
  }

  public getCapabilityInfo(platform: PlatformTamperCapability): TamperCapabilityInfo {
    return TAMPER_CAPABILITY_MATRIX[platform] || TAMPER_CAPABILITY_MATRIX.android_accessibility_normal;
  }
}
