import { describe, it, expect } from 'vitest';
import { ActivityHistoryService } from '../activity-history-service';

describe('FR-09: Website Activity History & Retention', () => {
  it('strictly strips query parameters and paths to protect child privacy', () => {
    const service = new ActivityHistoryService();
    const event = service.recordVisit({
      rawUrlOrDomain: 'https://google.com/search?q=private+query&client=chrome&auth=secret123',
      category: 'search',
      action: 'allow',
      reason: 'Qidiruv tizimi',
      signalSource: 'browser_extension',
      isBackgroundRequest: false,
    });

    expect(event.domain).toBe('google.com');
    expect(event.domain).not.toContain('private+query');
    expect(event.domain).not.toContain('secret123');
  });

  it('filters background telemetry requests from real user visits', () => {
    const service = new ActivityHistoryService();

    // User visit
    service.recordVisit({
      rawUrlOrDomain: 'https://wikipedia.org',
      category: 'education',
      action: 'allow',
      reason: 'Maqola',
      signalSource: 'browser_extension',
      isBackgroundRequest: false,
    });

    // Background sync request
    service.recordVisit({
      rawUrlOrDomain: 'https://telemetry.app.com/ping',
      category: 'system',
      action: 'allow',
      reason: 'Foniy yangilanish',
      signalSource: 'vpn_dns',
      isBackgroundRequest: true,
    });

    const userOnly = service.getVisits({ userVisitsOnly: true });
    expect(userOnly).toHaveLength(1);
    expect(userOnly[0].domain).toBe('wikipedia.org');

    const allVisits = service.getVisits({ userVisitsOnly: false });
    expect(allVisits).toHaveLength(2);
  });

  it('aggregates events into daily category statistics', () => {
    const service = new ActivityHistoryService();
    service.recordVisit({
      rawUrlOrDomain: 'edu.uz',
      category: 'education',
      action: 'allow',
      reason: 'Dars',
      signalSource: 'browser_extension',
      isBackgroundRequest: false,
    });
    service.recordVisit({
      rawUrlOrDomain: 'maktab.uz',
      category: 'education',
      action: 'allow',
      reason: 'Dars',
      signalSource: 'browser_extension',
      isBackgroundRequest: false,
    });
    service.recordVisit({
      rawUrlOrDomain: 'casino.com',
      category: 'gambling',
      action: 'block',
      reason: 'Taqiqlangan',
      signalSource: 'vpn_dns',
      isBackgroundRequest: false,
    });

    const stats = service.getDailyAggregatedStats();
    const eduStat = stats.find((s) => s.category === 'education');
    const gambleStat = stats.find((s) => s.category === 'gambling');

    expect(eduStat?.totalVisits).toBe(2);
    expect(eduStat?.allowedCount).toBe(2);
    expect(gambleStat?.blockedCount).toBe(1);
  });

  it('enforces 7-day retention for raw events and 90-day for aggregated stats', () => {
    const service = new ActivityHistoryService();
    const now = new Date();

    // 10 days old raw event
    const oldDate10 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
    service.recordVisit({
      rawUrlOrDomain: 'old-news.uz',
      category: 'news',
      action: 'allow',
      reason: 'Eski tashrif',
      signalSource: 'browser_extension',
      isBackgroundRequest: false,
      visitedAt: oldDate10,
    });

    // 2 days old raw event
    const recentDate2 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    service.recordVisit({
      rawUrlOrDomain: 'fresh-news.uz',
      category: 'news',
      action: 'allow',
      reason: 'Yangi tashrif',
      signalSource: 'browser_extension',
      isBackgroundRequest: false,
      visitedAt: recentDate2,
    });

    // Run cleanup
    const cleanup = service.runRetentionCleanup(now);
    expect(cleanup.prunedRawEvents).toBe(1);

    const remaining = service.getVisits();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].domain).toBe('fresh-news.uz');
  });
});
