import { describe, it, expect } from 'vitest';
import { GeofenceService, haversineDistanceMeters } from '../geofence-service';

describe('FR-19: Geofence & Safe Zones Service', () => {
  it('correctly calculates haversine distance in meters', () => {
    // Tashkent Amir Timur Square (41.3111, 69.2797) to Tashkent TV Tower (41.3456, 69.2844) ~ 3.8 km
    const dist = haversineDistanceMeters(41.3111, 69.2797, 41.3456, 69.2844);
    expect(dist).toBeGreaterThan(3500);
    expect(dist).toBeLessThan(4200);
  });

  it('marks evaluation as uncertain when GPS accuracy is too poor', () => {
    const service = new GeofenceService();
    service.addZone({
      name: 'Maktab',
      type: 'school',
      latitude: 41.3111,
      longitude: 69.2797,
      radiusMeters: 100,
      activeDaysOfWeek: [1, 2, 3, 4, 5],
      recipients: ['parent-1'],
    });

    const evalRes = service.evaluateLocation({
      childId: 'kid-1',
      latitude: 41.3111,
      longitude: 69.2797,
      accuracyMeters: 150, // Poor accuracy > 100m
    });

    expect(evalRes[0].state).toBe('uncertain');
    expect(evalRes[0].shouldNotify).toBe(false);
    expect(evalRes[0].reason).toContain('aniqligi');
  });

  it('applies hysteresis (R vs 1.3R) to avoid boundary ping-pong', () => {
    const service = new GeofenceService();
    const zone = service.addZone({
      name: 'Uy',
      type: 'home',
      latitude: 41.3000,
      longitude: 69.2400,
      radiusMeters: 100, // Entry R = 100m, Exit 1.3R = 130m
      activeDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      recipients: ['parent-1'],
    });

    const centerLat = 41.3000;
    const centerLng = 69.2400;

    // 1. Enter zone (distance ~ 10 meters)
    const t0 = new Date('2026-09-18T10:00:00Z');
    const enterRes = service.evaluateLocation({
      childId: 'kid-2',
      latitude: centerLat + 0.00008, // ~9m
      longitude: centerLng,
      accuracyMeters: 10,
      currentDate: t0,
    });
    expect(enterRes[0].state).toBe('inside');

    // 2. Step just outside R (distance ~ 115m, which is between R and 1.3R)
    // Because previous state was inside, hysteresis keeps it inside until > 130m
    const t1 = new Date('2026-09-18T10:05:00Z');
    const boundaryRes = service.evaluateLocation({
      childId: 'kid-2',
      latitude: centerLat + 0.0010, // ~111m
      longitude: centerLng,
      accuracyMeters: 10,
      currentDate: t1,
    });
    expect(boundaryRes[0].state).toBe('inside'); // Maintained inside due to hysteresis!

    // 3. Move far away (distance ~ 200m > 1.3R)
    const t2 = new Date('2026-09-18T10:10:00Z');
    const outsideRes = service.evaluateLocation({
      childId: 'kid-2',
      latitude: centerLat + 0.0018, // ~200m
      longitude: centerLng,
      accuracyMeters: 10,
      currentDate: t2,
    });
    expect(outsideRes[0].state).toBe('outside');
  });
});
