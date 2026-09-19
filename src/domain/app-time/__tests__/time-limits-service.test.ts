import { describe, it, expect } from 'vitest';
import { TimeLimitsService, AGE_GROUP_TEMPLATES } from '../time-limits-service';

describe('FR-13 & FR-40: Time Limits & Schedules Service', () => {
  it('applies age group template defaults correctly', () => {
    const service = new TimeLimitsService(true);
    const ruleA = service.applyAgeTemplate('age_group_a', 'device');
    expect(ruleA.dailyMinutesLimit).toBe(60);
    expect(ruleA.sleepSchedule?.startHour).toBe(21);

    const ruleB = service.applyAgeTemplate('age_group_b', 'device');
    expect(ruleB.dailyMinutesLimit).toBe(120);

    const ruleC = service.applyAgeTemplate('age_group_c', 'device');
    expect(ruleC.dailyMinutesLimit).toBe(180);
  });

  it('blocks during sleep schedule hours', () => {
    const service = new TimeLimitsService(true);
    service.applyAgeTemplate('age_group_b', 'device');

    // Sleep schedule is 22:00 to 07:00
    const nightTime = new Date('2026-09-18T23:30:00');
    const result = service.checkAppAllowed({
      appIdentifier: 'com.tiktok',
      category: 'social',
      usedMinutesToday: 10,
      currentDate: nightTime,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Uyqu vaqti');
  });

  it('blocks during study hours on school days', () => {
    const service = new TimeLimitsService(true);
    service.applyAgeTemplate('age_group_a', 'device');

    // Wednesday at 10:00 AM (study hours: 8-14)
    const schoolMorning = new Date('2026-09-16T10:00:00'); // Wednesday
    const result = service.checkAppAllowed({
      appIdentifier: 'com.roblox',
      category: 'games',
      usedMinutesToday: 5,
      currentDate: schoolMorning,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Dars vaqti');
  });

  it('emits pre-limit warning exactly 5 minutes before limit is exhausted', () => {
    const service = new TimeLimitsService(true);
    service.setLimit({
      targetType: 'app',
      targetIdentifier: 'com.brawlstars',
      dailyMinutesLimit: 60,
      isEmergencyProtected: false,
    });

    // 56 minutes used => 4 minutes left
    const afternoon = new Date('2026-09-16T17:00:00');
    const result = service.checkAppAllowed({
      appIdentifier: 'com.brawlstars',
      category: 'games',
      usedMinutesToday: 56,
      currentDate: afternoon,
    });

    expect(result.allowed).toBe(true);
    expect(result.preLimitWarning).toBe(true);
    expect(result.reason).toContain('4 daqiqa qoldi');
  });

  it('protects emergency call applications from being limited', () => {
    const service = new TimeLimitsService(true);
    const result = service.setLimit({
      targetType: 'app',
      targetIdentifier: 'com.android.dialer',
      dailyMinutesLimit: 10,
      isEmergencyProtected: false,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Favqulodda yordam');
  });
});
