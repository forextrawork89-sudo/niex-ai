// FR-23b: Offline SMS Fallback (Android SmsManager, Minimal Coordinates, Unsupported Capability)

export interface OfflineSmsPayload {
  recipientPhoneNumber: string;
  message: string;
  sentAt: string;
  isDeliveredDirectly: boolean;
}

export class OfflineSmsFallbackService {
  private hasSmsPermission: boolean;
  private isAndroidPlatform: boolean;

  constructor(isAndroidPlatform = true, hasSmsPermission = false) {
    this.isAndroidPlatform = isAndroidPlatform;
    this.hasSmsPermission = hasSmsPermission;
  }

  public setSmsPermission(granted: boolean) {
    this.hasSmsPermission = granted;
  }

  public sendOfflineSosSms(params: {
    guardianPhoneNumber: string;
    childName: string;
    coordinates?: { lat: number; lng: number };
    timestampIso?: string;
  }): { success: boolean; capability: 'supported' | 'unsupported'; payload?: OfflineSmsPayload; error?: string } {
    // Check platform & permission capability
    if (!this.isAndroidPlatform || !this.hasSmsPermission) {
      return {
        success: false,
        capability: 'unsupported',
        error: !this.isAndroidPlatform
          ? 'Oflayn SMS yuborish faqat Android qurilmalarda qo‘llab-quvvatlanadi (iOS/Web da ruxsat yo‘q).'
          : 'SMS ruxsati (SEND_SMS) taqdim etilmagan (UNSUPPORTED).',
      };
    }

    const timeStr = new Date(params.timestampIso || new Date()).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const locationPart = params.coordinates
      ? ` Lokatsiya: https://maps.google.com/?q=${params.coordinates.lat},${params.coordinates.lng}`
      : '';

    // Minimal SOS message to fit in a single standard 160-char SMS
    const message = `SOS! ${params.childName} favqulodda signal yubordi (${timeStr}).${locationPart}`;

    const payload: OfflineSmsPayload = {
      recipientPhoneNumber: params.guardianPhoneNumber,
      message,
      sentAt: new Date().toISOString(),
      isDeliveredDirectly: true,
    };

    return {
      success: true,
      capability: 'supported',
      payload,
    };
  }
}
