import { describe, it, expect } from 'vitest';
import { QuietHoursService } from '../quiet-hours-service';

describe('FR-38: Guardian Quiet Hours Service', () => {
  it('suppresses medium/low notifications during quiet hours and collects them in digest', () => {
    const service = new QuietHoursService();
    service.setQuietHours({
      guardianId: 'parent-1',
      channel: 'telegram',
      startHour: 22,
      endHour: 7,
      enabled: true,
    });

    const midnight = new Date('2026-09-18T00:30:00');

    // Medium priority alert at midnight -> Should suppress
    const checkMedium = service.shouldSuppress('parent-1', 'telegram', 'medium', midnight);
    expect(checkMedium.suppress).toBe(true);

    // Queue dummy notification
    service.queueForDigest('parent-1', {
      id: 'n1',
      dedupKey: 'k1',
      priority: 'medium',
      category: 'web_block',
      channel: 'telegram',
      guardianId: 'parent-1',
      previewTitle: 'Bloklandi',
      previewBody: 'O‘yin bloklandi',
      fullBody: 'O‘yin bloklandi',
      providerStatus: 'sent',
      deviceStatus: 'delivered',
      userStatus: 'unread',
      dispatchedAt: midnight.toISOString(),
      occurrenceCount: 1,
    });

    expect(service.getPendingDigestCount('parent-1')).toBe(1);

    // Morning -> Flush digest
    const flushed = service.flushDigest('parent-1');
    expect(flushed).toHaveLength(1);
    expect(service.getPendingDigestCount('parent-1')).toBe(0);
  });

  it('never suppresses critical or high notifications during quiet hours', () => {
    const service = new QuietHoursService();
    service.setQuietHours({
      guardianId: 'parent-2',
      channel: 'sms',
      startHour: 22,
      endHour: 7,
      enabled: true,
    });

    const midnight = new Date('2026-09-18T01:15:00');

    // Critical SOS alert
    const checkCritical = service.shouldSuppress('parent-2', 'sms', 'critical', midnight);
    expect(checkCritical.suppress).toBe(false);

    // High priority alert
    const checkHigh = service.shouldSuppress('parent-2', 'sms', 'high', midnight);
    expect(checkHigh.suppress).toBe(false);
  });
});
