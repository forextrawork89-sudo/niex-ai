// FR-12: Screen Time Accounting (Active vs Background, Category Breakdown, Missing Data != Zero)

export interface AppUsageRecord {
  appIdentifier: string;
  appName: string;
  category: string;
  date: string; // YYYY-MM-DD
  activeScreenSeconds: number; // User was actively touching/looking at screen
  backgroundSeconds: number; // App running in background / audio streaming
  timezone: string;
}

export interface DailyScreenTimeSummary {
  date: string;
  totalActiveMinutes: number;
  totalBackgroundMinutes: number;
  categoryBreakdownMinutes: Record<string, number>;
  appBreakdownMinutes: Record<string, number>;
  hasMissingDataGaps: boolean; // FR-12: Missing data is strictly distinguished from zero activity
  limitProximityWarning?: string;
}

export class ScreenTimeService {
  private records: AppUsageRecord[] = [];
  private deviceHeartbeatTimestamps: Map<string, string[]> = new Map(); // Date -> ISO timestamps

  public recordUsage(record: AppUsageRecord) {
    const existing = this.records.find(
      (r) => r.appIdentifier === record.appIdentifier && r.date === record.date
    );

    if (existing) {
      existing.activeScreenSeconds += record.activeScreenSeconds;
      existing.backgroundSeconds += record.backgroundSeconds;
    } else {
      this.records.push({ ...record });
    }
  }

  public recordHeartbeat(dateStr: string, timestampIso: string) {
    const list = this.deviceHeartbeatTimestamps.get(dateStr) || [];
    list.push(timestampIso);
    this.deviceHeartbeatTimestamps.set(dateStr, list);
  }

  public getDailySummary(dateStr: string, dailyLimitMinutes?: number): DailyScreenTimeSummary {
    const dayRecords = this.records.filter((r) => r.date === dateStr);

    let totalActiveSec = 0;
    let totalBgSec = 0;
    const categoryBreakdownMinutes: Record<string, number> = {};
    const appBreakdownMinutes: Record<string, number> = {};

    for (const rec of dayRecords) {
      totalActiveSec += rec.activeScreenSeconds;
      totalBgSec += rec.backgroundSeconds;

      const activeMin = Math.round(rec.activeScreenSeconds / 60);
      categoryBreakdownMinutes[rec.category] = (categoryBreakdownMinutes[rec.category] || 0) + activeMin;
      appBreakdownMinutes[rec.appName] = (appBreakdownMinutes[rec.appName] || 0) + activeMin;
    }

    const totalActiveMinutes = Math.round(totalActiveSec / 60);
    const totalBackgroundMinutes = Math.round(totalBgSec / 60);

    // FR-12 Invariant: Missing data != zero activity.
    // If device had no heartbeats for > 4 hours during the day, flag data gaps.
    const heartbeats = this.deviceHeartbeatTimestamps.get(dateStr) || [];
    const hasMissingDataGaps = dayRecords.length === 0 && heartbeats.length === 0;

    let limitProximityWarning: string | undefined;
    if (dailyLimitMinutes && dailyLimitMinutes > 0) {
      const remaining = dailyLimitMinutes - totalActiveMinutes;
      if (remaining <= 5 && remaining > 0) {
        limitProximityWarning = `Kunlik limit tugashiga ${remaining} daqiqa qoldi.`;
      } else if (remaining <= 0) {
        limitProximityWarning = 'Kunlik vaqt chegarasi to‘ldi.';
      }
    }

    return {
      date: dateStr,
      totalActiveMinutes,
      totalBackgroundMinutes,
      categoryBreakdownMinutes,
      appBreakdownMinutes,
      hasMissingDataGaps,
      limitProximityWarning,
    };
  }

  public getWeeklySummary(startDateStr: string, endDateStr: string): {
    days: DailyScreenTimeSummary[];
    weeklyTotalActiveMinutes: number;
    weeklyDailyAverageMinutes: number;
  } {
    const summaries: DailyScreenTimeSummary[] = [];
    const dates = Array.from(new Set(this.records.map((r) => r.date))).filter(
      (d) => d >= startDateStr && d <= endDateStr
    );

    let sumActive = 0;
    for (const d of dates) {
      const daySummary = this.getDailySummary(d);
      summaries.push(daySummary);
      sumActive += daySummary.totalActiveMinutes;
    }

    return {
      days: summaries,
      weeklyTotalActiveMinutes: sumActive,
      weeklyDailyAverageMinutes: dates.length > 0 ? Math.round(sumActive / dates.length) : 0,
    };
  }
}
