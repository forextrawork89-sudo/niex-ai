import { describe, it, expect } from 'vitest';
import { CheckInService } from '../checkin-service';

describe('FR-22: Child Check-in Service', () => {
  it('records manual check-in and distinguishes it from automated geofence events', () => {
    const service = new CheckInService();
    const record = service.recordManualCheckIn({
      childId: 'kid-1',
      location: { latitude: 41.3111, longitude: 69.2797, accuracyMeters: 15 },
      nearestZoneName: 'Maktab',
      userNote: 'Darsga yetib keldim',
    });

    expect(record.id).toBeDefined();
    expect(record.source).toBe('manual_button'); // Strictly distinguished from geofence_auto
    expect(record.locationAvailable).toBe(true);
    expect(record.nearestZoneName).toBe('Maktab');
  });

  it('handles check-in gracefully when location/GPS is unavailable', () => {
    const service = new CheckInService();
    const record = service.recordManualCheckIn({
      childId: 'kid-2',
      location: undefined, // Location unavailable
      userNote: 'GPS ishlamayapti, lekin yetib keldim',
    });

    expect(record.locationAvailable).toBe(false);
    expect(record.nearestZoneName).toContain('aniqlanmadi');
    expect(record.source).toBe('manual_button');
  });
});
