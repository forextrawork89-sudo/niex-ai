import { describe, it, expect } from 'vitest';
import { LocationHistoryService } from '../location-history-service';

describe('FR-21: 7-Day Location History Service', () => {
  it('detects tracking gaps greater than 30 minutes', () => {
    const service = new LocationHistoryService();
    const t1 = '2026-09-18T10:00:00Z';
    const t2 = '2026-09-18T11:15:00Z'; // 75 minutes gap

    service.recordPoint({ childId: 'kid-1', latitude: 41.3, longitude: 69.2, accuracyMeters: 10, timestamp: t1 });
    service.recordPoint({ childId: 'kid-1', latitude: 41.31, longitude: 69.21, accuracyMeters: 12, timestamp: t2 });

    const result = service.getHistory('kid-1', 'auth-parent-token');
    expect(result.points).toHaveLength(2);
    expect(result.gaps).toHaveLength(1);
    expect(result.gaps[0].gapDurationMinutes).toBe(75);
  });

  it('prunes points older than 7 days', () => {
    const service = new LocationHistoryService();
    const now = new Date();
    const oldDate = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(); // 8 days old
    const freshDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days old

    service.recordPoint({ childId: 'kid-2', latitude: 41.3, longitude: 69.2, accuracyMeters: 10, timestamp: oldDate });
    service.recordPoint({ childId: 'kid-2', latitude: 41.3, longitude: 69.2, accuracyMeters: 10, timestamp: freshDate });

    const prunedCount = service.pruneOlderThan7Days(now);
    expect(prunedCount).toBe(1);

    const history = service.getHistory('kid-2', 'auth-token');
    expect(history.points).toHaveLength(1);
    expect(history.points[0].timestamp).toBe(freshDate);
  });
});
