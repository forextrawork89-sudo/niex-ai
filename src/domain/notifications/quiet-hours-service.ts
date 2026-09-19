// FR-38: Guardian Quiet Hours, High/Critical Passthrough, Medium/Low Digesting

import type { NotificationPriority, DispatchedNotification } from './notification-center';

export interface QuietHoursConfig {
  guardianId: string;
  channel: string;
  startHour: number; // e.g. 22 (22:00)
  endHour: number; // e.g. 7 (07:00)
  enabled: boolean;
}

export interface DigestQueueItem {
  guardianId: string;
  notification: DispatchedNotification;
  queuedAt: string;
}

export class QuietHoursService {
  private configs: Map<string, QuietHoursConfig> = new Map(); // key: `${guardianId}:${channel}`
  private digestQueue: DigestQueueItem[] = [];

  public setQuietHours(config: QuietHoursConfig) {
    this.configs.set(`${config.guardianId}:${config.channel}`, config);
  }

  public getQuietHours(guardianId: string, channel: string): QuietHoursConfig | undefined {
    return this.configs.get(`${guardianId}:${channel}`);
  }

  public shouldSuppress(
    guardianId: string,
    channel: string,
    priority: NotificationPriority,
    currentDate = new Date()
  ): { suppress: boolean; reason?: string } {
    // Invariant: CRITICAL and HIGH notifications are NEVER suppressed during quiet hours!
    if (priority === 'critical' || priority === 'high') {
      return { suppress: false, reason: 'Favqulodda (critical/high) xabarnoma sukunat vaqtida ham yetkaziladi.' };
    }

    const config = this.configs.get(`${guardianId}:${channel}`);
    if (!config || !config.enabled) {
      return { suppress: false };
    }

    const hour = currentDate.getHours();
    const isQuiet =
      config.startHour > config.endHour
        ? hour >= config.startHour || hour < config.endHour
        : hour >= config.startHour && hour < config.endHour;

    if (isQuiet) {
      return {
        suppress: true,
        reason: `Sukunat vaqti (${config.startHour}:00 - ${config.endHour}:00). O‘rtacha/past darajadagi bildirishnoma digestga yig‘ilmoqda.`,
      };
    }

    return { suppress: false };
  }

  public queueForDigest(guardianId: string, notification: DispatchedNotification) {
    this.digestQueue.push({
      guardianId,
      notification,
      queuedAt: new Date().toISOString(),
    });
  }

  // Release and return digest when quiet hours end
  public flushDigest(guardianId: string): DispatchedNotification[] {
    const forGuardian = this.digestQueue.filter((item) => item.guardianId === guardianId);
    this.digestQueue = this.digestQueue.filter((item) => item.guardianId !== guardianId);
    return forGuardian.map((item) => item.notification);
  }

  public getPendingDigestCount(guardianId: string): number {
    return this.digestQueue.filter((item) => item.guardianId === guardianId).length;
  }
}
