import { describe, it, expect } from 'vitest';
import { ReportingService } from '../reporting-service';

describe('ReportingService (FR-34)', () => {
  it('generates aggregated daily report without exposing raw URLs or coordinates', () => {
    const service = new ReportingService();
    const report = service.generateDailyReport({
      date: '2026-09-18',
      childId: 'child-1',
      screenTimeMinutes: 120,
      webCategories: [
        { category: 'Education', minutesSpent: 60, visitCount: 15 },
        { category: 'Entertainment', minutesSpent: 60, visitCount: 20 },
      ],
      securityEvents: [{ type: 'phishing_blocked', count: 1, lastOccurredAt: '2026-09-18T12:00:00Z' }],
    });

    expect(report.totalScreenTimeMinutes).toBe(120);
    expect(report.hasDataGap).toBe(false);
    expect(report.webCategories.length).toBe(2);
    expect(report.securityEvents[0].count).toBe(1);
    expect(report.isLocationIncluded).toBe(false);
  });

  it('marks data gap explicitly instead of reporting false 0 without reason', () => {
    const service = new ReportingService();
    const report = service.generateDailyReport({
      date: '2026-09-18',
      childId: 'child-1',
      screenTimeMinutes: 0,
      hasDataGap: true,
      gapReason: 'Qurilma o‘chirilgan',
    });

    expect(report.hasDataGap).toBe(true);
    expect(report.gapReason).toBe('Qurilma o‘chirilgan');
  });

  it('aggregates daily reports into weekly report accurately', () => {
    const service = new ReportingService();
    const day1 = service.generateDailyReport({
      date: '2026-09-15',
      childId: 'child-1',
      screenTimeMinutes: 120,
      webCategories: [{ category: 'Education', minutesSpent: 120, visitCount: 10 }],
    });
    const day2 = service.generateDailyReport({
      date: '2026-09-16',
      childId: 'child-1',
      screenTimeMinutes: 60,
      webCategories: [{ category: 'Education', minutesSpent: 60, visitCount: 5 }],
    });
    const day3 = service.generateDailyReport({
      date: '2026-09-17',
      childId: 'child-1',
      screenTimeMinutes: 0,
      hasDataGap: true,
    });

    const weekly = service.generateWeeklyReport({
      weekStarting: '2026-09-15',
      childId: 'child-1',
      dailyReports: [day1, day2, day3],
    });

    expect(weekly.totalScreenTimeHours).toBe(3); // (120+60)/60 = 3h
    expect(weekly.dataGapsCount).toBe(1);
    expect(weekly.topCategories[0].category).toBe('Education');
    expect(weekly.topCategories[0].minutesSpent).toBe(180);
  });

  it('enforces extra authorization requirement for location history export (FR-34)', () => {
    const service = new ReportingService();

    expect(() =>
      service.exportDataArchive({
        guardianId: 'guard-1',
        childId: 'child-1',
        dataType: 'location_history',
        dateRange: { from: '2026-09-01', to: '2026-09-07' },
        extraLocationConsent: false,
      })
    ).toThrow('qo‘shimcha vasiy tasdig‘i talab qilinadi');

    const result = service.exportDataArchive({
      guardianId: 'guard-1',
      childId: 'child-1',
      dataType: 'location_history',
      dateRange: { from: '2026-09-01', to: '2026-09-07' },
      extraLocationConsent: true,
    });

    expect(result.exportId).toBeDefined();
    expect(result.status).toBe('ready');

    const audits = service.getExportAudits();
    expect(audits.length).toBe(1);
    expect(audits[0].extraLocationConsentGiven).toBe(true);
  });
});
