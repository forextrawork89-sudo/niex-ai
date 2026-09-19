import { describe, it, expect } from 'vitest';
import { AdaptiveTrackingService } from '../adaptive-tracking-service';

describe('FR-18: Adaptive Tracking Service', () => {
  it('uses normal 15-minute background interval by default', () => {
    const service = new AdaptiveTrackingService();
    const config = service.resolveTrackingInterval({
      childId: 'kid-1',
      batteryPercentage: 70,
      isMoving: false,
    });

    expect(config.mode).toBe('normal_background');
    expect(config.intervalMinutes).toBe(15);
    expect(config.isChildVisible).toBe(false);
  });

  it('switches to 60-minute power saver when battery is under 20%', () => {
    const service = new AdaptiveTrackingService();
    const config = service.resolveTrackingInterval({
      childId: 'kid-1',
      batteryPercentage: 15,
      isMoving: true, // Movement overridden by critical battery saving
    });

    expect(config.mode).toBe('battery_saver');
    expect(config.intervalMinutes).toBe(60);
  });

  it('uses 5-minute interval when moving with sufficient battery', () => {
    const service = new AdaptiveTrackingService();
    const config = service.resolveTrackingInterval({
      childId: 'kid-1',
      batteryPercentage: 60,
      isMoving: true,
    });

    expect(config.mode).toBe('motion_adaptive');
    expect(config.intervalMinutes).toBe(5);
  });

  it('handles temporary active tracking with 30-minute auto expiration and child visibility', () => {
    const service = new AdaptiveTrackingService();
    const start = new Date('2026-09-18T12:00:00Z');

    const session = service.startTemporaryActiveTracking('kid-1', start);
    expect(session.isChildVisible).toBe(true);
    expect(session.expiresAt).toBe('2026-09-18T12:30:00.000Z'); // exactly 30 mins

    // At 12:15 (active)
    const at15 = service.resolveTrackingInterval({
      childId: 'kid-1',
      batteryPercentage: 50,
      isMoving: false,
      currentDate: new Date('2026-09-18T12:15:00Z'),
    });
    expect(at15.mode).toBe('temporary_active');
    expect(at15.isChildVisible).toBe(true);

    // At 12:35 (expired -> fallback to normal)
    const at35 = service.resolveTrackingInterval({
      childId: 'kid-1',
      batteryPercentage: 50,
      isMoving: false,
      currentDate: new Date('2026-09-18T12:35:00Z'),
    });
    expect(at35.mode).toBe('normal_background');
    expect(at35.isChildVisible).toBe(false);
  });
});
