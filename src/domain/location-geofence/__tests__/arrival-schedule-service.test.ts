import { describe, it, expect } from 'vitest';
import { ArrivalScheduleService } from '../arrival-schedule-service';

describe('FR-20: Expected Arrival Schedule Service', () => {
  it('identifies confirmed arrival', () => {
    const service = new ArrivalScheduleService();
    service.addExpectation({
      childId: 'kid-1',
      zoneId: 'z-school',
      zoneName: 'Maktab',
      expectedByHour: 8,
      expectedByMinute: 30,
      daysOfWeek: [1, 2, 3, 4, 5],
    });

    const wednesday = new Date('2026-09-16T08:25:00'); // Wednesday 08:25
    const results = service.evaluateArrival({
      childId: 'kid-1',
      isInsideZone: true,
      hasGpsFix: true,
      isOnline: true,
      currentDate: wednesday,
    });

    expect(results[0].status).toBe('arrived');
    expect(results[0].isViolation).toBe(false);
  });

  it('strictly distinguishes technical GPS/offline absence from rule violation (FR-20)', () => {
    const service = new ArrivalScheduleService();
    service.addExpectation({
      childId: 'kid-2',
      zoneId: 'z-school',
      zoneName: 'Maktab',
      expectedByHour: 8,
      expectedByMinute: 30,
      daysOfWeek: [1, 2, 3, 4, 5],
    });

    // 08:45 AM (past 08:30) but device is offline / lost GPS
    const wednesdayLate = new Date('2026-09-16T08:45:00');
    const results = service.evaluateArrival({
      childId: 'kid-2',
      isInsideZone: false,
      hasGpsFix: false, // GPS absence
      isOnline: false,
      currentDate: wednesdayLate,
    });

    expect(results[0].status).toBe('arrival_not_confirmed');
    // FR-20 Requirement: GPS/internet absence must NOT be treated as proof of rule violation!
    expect(results[0].isViolation).toBe(false);
    expect(results[0].explanation).toContain('qoidabuzarlik hisoblanmaydi');
  });

  it('marks actual violation only when GPS is verified outside after expected time', () => {
    const service = new ArrivalScheduleService();
    service.addExpectation({
      childId: 'kid-3',
      zoneId: 'z-school',
      zoneName: 'Maktab',
      expectedByHour: 8,
      expectedByMinute: 30,
      daysOfWeek: [1, 2, 3, 4, 5],
    });

    const wednesdayLate = new Date('2026-09-16T08:45:00');
    const results = service.evaluateArrival({
      childId: 'kid-3',
      isInsideZone: false,
      hasGpsFix: true, // Verified GPS fix
      isOnline: true, // Verified online
      currentDate: wednesdayLate,
    });

    expect(results[0].status).toBe('left_area');
    expect(results[0].isViolation).toBe(true);
  });
});
