// FR-18: Adaptive Background Location Intervals, Battery Modes & 30m Auto-expiring Active Tracking

export type TrackingMode = 'normal_background' | 'motion_adaptive' | 'battery_saver' | 'temporary_active';

export interface TrackingIntervalConfig {
  mode: TrackingMode;
  intervalMinutes: number;
  explanation: string;
  isChildVisible: boolean;
  activeTrackingExpiresAt?: string; // Auto expires after 30 minutes
}

export class AdaptiveTrackingService {
  private activeTrackingSessions: Map<string, { startedAt: string; expiresAt: string }> = new Map(); // childId -> session

  // Determine current tracking interval based on battery, motion, and active tracking request
  public resolveTrackingInterval(params: {
    childId: string;
    batteryPercentage: number;
    isMoving: boolean;
    currentDate?: Date;
  }): TrackingIntervalConfig {
    const now = params.currentDate || new Date();
    const nowIso = now.toISOString();

    // 1. Temporary Active Tracking (Requested by parent, max 30 mins, VISIBLE TO CHILD)
    const activeSession = this.activeTrackingSessions.get(params.childId);
    if (activeSession && activeSession.expiresAt > nowIso) {
      return {
        mode: 'temporary_active',
        intervalMinutes: 1, // 1-minute high precision mode
        explanation: 'Vaqtincha faol kuzatuv rejimi (bolaga ko‘rinadi, 30 daqiqadan so‘ng avtomatik o‘chadi).',
        isChildVisible: true, // Strict transparency invariant
        activeTrackingExpiresAt: activeSession.expiresAt,
      };
    }

    // 2. Battery < 20% => 60 minute power-saving mode (FR-18)
    if (params.batteryPercentage < 20) {
      return {
        mode: 'battery_saver',
        intervalMinutes: 60,
        explanation: 'Batareya quvvati 20% dan kam bo‘lgani uchun quvvatni tejash rejimi (har 60 daqiqada).',
        isChildVisible: false,
      };
    }

    // 3. Motion-based adaptive mode
    if (params.isMoving) {
      return {
        mode: 'motion_adaptive',
        intervalMinutes: 5,
        explanation: 'Harakat aniqlandi — adaptiv 5 daqiqalik oraliq.',
        isChildVisible: false,
      };
    }

    // 4. Normal background mode: 15 minutes (Default)
    return {
      mode: 'normal_background',
      intervalMinutes: 15,
      explanation: 'Standart foniy kuzatuv (har 15 daqiqada).',
      isChildVisible: false,
    };
  }

  // Parent triggers temporary active tracking (auto-expires in 30 minutes)
  public startTemporaryActiveTracking(
    childId: string,
    currentDate = new Date()
  ): { expiresAt: string; isChildVisible: true } {
    const expires = new Date(currentDate.getTime() + 30 * 60 * 1000); // exactly 30 minutes
    const session = {
      startedAt: currentDate.toISOString(),
      expiresAt: expires.toISOString(),
    };
    this.activeTrackingSessions.set(childId, session);
    return { expiresAt: session.expiresAt, isChildVisible: true };
  }

  public cancelActiveTracking(childId: string): boolean {
    return this.activeTrackingSessions.delete(childId);
  }
}
