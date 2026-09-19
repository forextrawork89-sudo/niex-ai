import { describe, it, expect } from 'vitest';
import { ScreenTimeService } from '../screen-time-service';

describe('FR-12: Screen Time Accounting Service', () => {
  it('strictly separates active screen time from background playback/sync time', () => {
    const service = new ScreenTimeService();
    service.recordUsage({
      appIdentifier: 'com.spotify.music',
      appName: 'Spotify',
      category: 'music',
      date: '2026-09-18',
      activeScreenSeconds: 300, // 5 mins active screen
      backgroundSeconds: 3600, // 60 mins background audio
      timezone: 'Asia/Tashkent',
    });

    const summary = service.getDailySummary('2026-09-18');
    expect(summary.totalActiveMinutes).toBe(5);
    expect(summary.totalBackgroundMinutes).toBe(60);
    expect(summary.categoryBreakdownMinutes['music']).toBe(5);
  });

  it('triggers limit proximity warning when remaining time is 5 minutes or less', () => {
    const service = new ScreenTimeService();
    service.recordUsage({
      appIdentifier: 'com.google.android.youtube',
      appName: 'YouTube',
      category: 'video',
      date: '2026-09-18',
      activeScreenSeconds: 56 * 60, // 56 minutes
      backgroundSeconds: 0,
      timezone: 'Asia/Tashkent',
    });

    // 60 minutes limit, 56 mins used => 4 mins left
    const summary = service.getDailySummary('2026-09-18', 60);
    expect(summary.limitProximityWarning).toContain('4 daqiqa qoldi');
  });

  it('distinguishes missing data gaps from zero activity (FR-12)', () => {
    const service = new ScreenTimeService();

    // Day with no records and no device heartbeats
    const emptyDaySummary = service.getDailySummary('2026-09-10');
    expect(emptyDaySummary.hasMissingDataGaps).toBe(true);
    expect(emptyDaySummary.totalActiveMinutes).toBe(0);

    // Day with heartbeats but 0 usage (child simply didn't use phone)
    service.recordHeartbeat('2026-09-11', '2026-09-11T10:00:00Z');
    const zeroUsageDay = service.getDailySummary('2026-09-11');
    expect(zeroUsageDay.hasMissingDataGaps).toBe(false);
    expect(zeroUsageDay.totalActiveMinutes).toBe(0);
  });
});
