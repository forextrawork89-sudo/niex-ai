// FR-23: SOS Emergency Alert (3s Hold, Parallel Dispatch, Retries, Guardian Ack & Non-Emergency Disclaimer)

export type SosChannel = 'telegram' | 'sms' | 'web_push';

export interface SosAlert {
  id: string;
  childId: string;
  triggeredAt: string;
  holdDurationSeconds: number; // Must be >= 3 seconds
  status: 'initiating' | 'dispatching' | 'sent' | 'seen';
  channelsDispatched: SosChannel[];
  retryCount: number; // Max 3 retries
  lastRetryAt?: string;
  seenAt?: string;
  seenByGuardianId?: string;
  location?: { latitude: number; longitude: number; accuracyMeters: number };
  isOfflineQueued: boolean;
  disclaimer: string;
}

export const NIEX_SOS_DISCLAIMER =
  'MUHIM OGOHLANTIRISH: NIEX favqulodda tezkor xizmat (112) emas. Tarmoq yoki qurilma holatiga ko‘ra xabarlar yetkazilishi 100% kafolatlanmaydi. Hayot uchun xavfli vaziyatlarda darhol 112 ga qo‘ng‘iroq qiling.';

export class SosService {
  private alerts: Map<string, SosAlert> = new Map();
  private maxRetries = 3;
  private retryIntervalMs = 2 * 60 * 1000; // 2 minutes

  // Trigger SOS (must hold for at least 3 seconds)
  public triggerSos(params: {
    childId: string;
    holdDurationSeconds: number;
    isOnline: boolean;
    location?: { latitude: number; longitude: number; accuracyMeters: number };
  }): { success: boolean; alert?: SosAlert; error?: string } {
    if (params.holdDurationSeconds < 3) {
      return {
        success: false,
        error: 'SOS signalini yuborish uchun tugmani kamida 3 soniya bosib turish lozim (tasodifiy bosilishdan himoya).',
      };
    }

    const id = `sos-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const channels: SosChannel[] = params.isOnline
      ? ['telegram', 'sms', 'web_push']
      : ['sms']; // SMS fallback when offline

    const alert: SosAlert = {
      id,
      childId: params.childId,
      triggeredAt: new Date().toISOString(),
      holdDurationSeconds: params.holdDurationSeconds,
      status: 'sent',
      channelsDispatched: channels,
      retryCount: 0,
      location: params.location,
      isOfflineQueued: !params.isOnline,
      disclaimer: NIEX_SOS_DISCLAIMER,
    };

    this.alerts.set(id, alert);
    return { success: true, alert };
  }

  // Guardian acknowledges seeing the SOS
  public acknowledgeSeen(alertId: string, guardianId: string): { success: boolean; alert?: SosAlert; error?: string } {
    const alert = this.alerts.get(alertId);
    if (!alert) return { success: false, error: 'SOS signali topilmadi.' };

    alert.status = 'seen';
    alert.seenAt = new Date().toISOString();
    alert.seenByGuardianId = guardianId;

    return { success: true, alert };
  }

  // Check and process retries if not seen after 2 minutes
  public processRetries(alertId: string, currentDate = new Date()): { retried: boolean; count: number; alert?: SosAlert } {
    const alert = this.alerts.get(alertId);
    if (!alert || alert.status === 'seen') return { retried: false, count: 0 };

    if (alert.retryCount >= this.maxRetries) {
      return { retried: false, count: alert.retryCount, alert };
    }

    const lastTime = alert.lastRetryAt ? new Date(alert.lastRetryAt).getTime() : new Date(alert.triggeredAt).getTime();
    const diff = currentDate.getTime() - lastTime;

    if (diff >= this.retryIntervalMs) {
      alert.retryCount += 1;
      alert.lastRetryAt = currentDate.toISOString();
      return { retried: true, count: alert.retryCount, alert };
    }

    return { retried: false, count: alert.retryCount, alert };
  }

  public getAlert(alertId: string): SosAlert | undefined {
    return this.alerts.get(alertId);
  }

  public getChildAlerts(childId: string): SosAlert[] {
    return Array.from(this.alerts.values()).filter((a) => a.childId === childId);
  }
}
