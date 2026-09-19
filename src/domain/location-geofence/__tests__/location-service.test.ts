import { describe, it, expect } from 'vitest';
import { LocationService } from '../location-service';

describe('FR-17: Latest Location Service', () => {
  it('reports current location when point is fresh', () => {
    const service = new LocationService();
    const now = new Date();

    service.updateLocation('kid-1', {
      latitude: 41.311081,
      longitude: 69.240562,
      accuracyMeters: 12,
      measuredAt: now.toISOString(),
      batteryPercentage: 85,
      isCharging: false,
      networkState: 'cellular',
    });

    const view = service.getLatestLocation('kid-1', now);
    expect(view.statusLabel).toBe('current');
    expect(view.isStale).toBe(false);
    expect(view.staleMinutes).toBe(0);
    expect(view.displayText).toContain('Hozirgi manzil');
  });

  it('marks location as "last known" when older than 15 minutes (FR-17)', () => {
    const service = new LocationService();
    const pastTime = new Date(Date.now() - 25 * 60 * 1000); // 25 mins ago

    service.updateLocation('kid-2', {
      latitude: 41.2995,
      longitude: 69.2401,
      accuracyMeters: 25,
      measuredAt: pastTime.toISOString(),
      batteryPercentage: 40,
      isCharging: false,
      networkState: 'wifi',
    });

    const view = service.getLatestLocation('kid-2', new Date());
    expect(view.statusLabel).toBe('last_known');
    expect(view.isStale).toBe(true);
    expect(view.staleMinutes).toBeGreaterThanOrEqual(24);
    expect(view.displayText).toContain('Oxirgi ma’lum manzil');
  });
});
