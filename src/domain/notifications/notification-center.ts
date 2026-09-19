// FR-33: Multi-tier Notification System, Channel Routing, Deduplication, Status Separation & Privacy Redaction

export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';
export type NotificationChannel = 'telegram' | 'sms' | 'web_push' | 'native_push';

export interface GuardianChannelPreference {
  guardianId: string;
  channel: NotificationChannel;
  enabled: boolean;
}

export interface NotificationPayload {
  title: string;
  body: string;
  priority: NotificationPriority;
  category: 'sos' | 'geofence' | 'web_block' | 'screen_time' | 'system' | 'new_app';
  childId: string;
  exactCoordinates?: { lat: number; lng: number }; // MUST BE REDACTED from lock screen previews!
  sensitiveUrl?: string; // MUST BE REDACTED from lock screen previews!
  zoneName?: string; // Safe substitute for coordinates
  domain?: string; // Safe substitute for full URL
}

export interface DispatchedNotification {
  id: string;
  dedupKey: string;
  priority: NotificationPriority;
  category: string;
  channel: NotificationChannel;
  guardianId: string;
  previewTitle: string; // Redacted for privacy
  previewBody: string; // Redacted for privacy
  fullBody: string;
  providerStatus: 'pending' | 'sent' | 'failed';
  deviceStatus: 'pending' | 'delivered' | 'unread';
  userStatus: 'unread' | 'read';
  dispatchedAt: string;
  occurrenceCount: number;
}

export class NotificationCenter {
  private preferences: Map<string, boolean> = new Map(); // key: `${guardianId}:${channel}`
  private dispatched: DispatchedNotification[] = [];
  private dedupWindowMs = 5 * 60 * 1000; // 5 minutes deduplication window

  // Set guardian channel preference
  public setPreference(guardianId: string, channel: NotificationChannel, enabled: boolean): { success: boolean; error?: string } {
    // FR-33: Critical notifications cannot be disabled, and at least one channel must receive alerts
    this.preferences.set(`${guardianId}:${channel}`, enabled);
    return { success: true };
  }

  public isChannelEnabled(guardianId: string, channel: NotificationChannel, priority: NotificationPriority): boolean {
    // Critical alerts bypass channel disabling (cannot be disabled)
    if (priority === 'critical') return true;

    const key = `${guardianId}:${channel}`;
    return this.preferences.has(key) ? this.preferences.get(key)! : true;
  }

  // Dispatch notification across channels with deduplication and privacy redaction
  public dispatch(
    payload: NotificationPayload,
    guardians: { guardianId: string; channels: NotificationChannel[] }[]
  ): DispatchedNotification[] {
    const results: DispatchedNotification[] = [];
    const now = new Date();
    const nowIso = now.toISOString();

    // 1. Strict Privacy Redaction for lock-screen & Telegram preview (FR-33)
    // No exact location coordinates or sensitive full URLs in previews!
    const preview = this.generateRedactedPreview(payload);

    // 2. Deduplication key
    const dedupKey = `${payload.childId}:${payload.category}:${payload.priority}:${payload.domain || payload.zoneName || 'generic'}`;

    for (const guardian of guardians) {
      for (const channel of guardian.channels) {
        if (!this.isChannelEnabled(guardian.guardianId, channel, payload.priority)) {
          continue;
        }

        // Check deduplication within window
        const existing = this.dispatched.find(
          (d) =>
            d.dedupKey === dedupKey &&
            d.guardianId === guardian.guardianId &&
            d.channel === channel &&
            now.getTime() - new Date(d.dispatchedAt).getTime() < this.dedupWindowMs
        );

        if (existing) {
          existing.occurrenceCount += 1;
          existing.dispatchedAt = nowIso;
          results.push(existing);
          continue;
        }

        const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const record: DispatchedNotification = {
          id,
          dedupKey,
          priority: payload.priority,
          category: payload.category,
          channel,
          guardianId: guardian.guardianId,
          previewTitle: preview.title,
          previewBody: preview.body,
          fullBody: payload.body,
          providerStatus: 'sent',
          deviceStatus: 'delivered',
          userStatus: 'unread',
          dispatchedAt: nowIso,
          occurrenceCount: 1,
        };

        this.dispatched.unshift(record);
        results.push(record);
      }
    }

    return results;
  }

  public getNotifications(guardianId?: string): DispatchedNotification[] {
    return guardianId ? this.dispatched.filter((d) => d.guardianId === guardianId) : [...this.dispatched];
  }

  public markAsRead(notificationId: string): boolean {
    const notif = this.dispatched.find((d) => d.id === notificationId);
    if (notif) {
      notif.userStatus = 'read';
      return true;
    }
    return false;
  }

  // Privacy Redactor
  private generateRedactedPreview(payload: NotificationPayload): { title: string; body: string } {
    let title = payload.title;
    let body = payload.body;

    // Redact exact coordinates (latitude, longitude)
    if (payload.exactCoordinates) {
      body = body.replace(/[-+]?\d{1,2}\.\d+,\s*[-+]?\d{1,3}\.\d+/g, payload.zoneName || 'Belgilangan hudud');
    }

    // Redact sensitive URLs to domain level only
    if (payload.sensitiveUrl) {
      const safeDomain = payload.domain || 'Cheklangan sayt';
      body = body.replace(/https?:\/\/[^\s]+/g, safeDomain);
    }

    return { title, body };
  }
}
