// FR-34: Daily/Weekly Aggregated Reports, Data Gap Distinction & Authorized Export Audit

export interface WebCategoryStat {
  category: string;
  minutesSpent: number;
  visitCount: number;
}

export interface SecurityEventSummary {
  type: string;
  count: number;
  lastOccurredAt: string;
}

export interface DailyReport {
  date: string;
  childId: string;
  totalScreenTimeMinutes: number;
  hasDataGap: boolean;
  gapReason?: string;
  webCategories: WebCategoryStat[];
  securityEvents: SecurityEventSummary[];
  isLocationIncluded: boolean;
  generatedAt: string;
}

export interface WeeklyReport {
  weekStarting: string;
  childId: string;
  totalScreenTimeHours: number;
  dailyAveragesMinutes: number;
  dataGapsCount: number;
  topCategories: WebCategoryStat[];
  totalSecurityAlerts: number;
  generatedAt: string;
}

export interface ExportAuditRecord {
  exportId: string;
  guardianId: string;
  childId: string;
  dataType: 'screen_time' | 'web_activity' | 'location_history' | 'full_archive';
  dateRange: { from: string; to: string };
  extraLocationConsentGiven: boolean;
  exportedAt: string;
}

export class ReportingService {
  private exportAudits: ExportAuditRecord[] = [];

  // FR-34 Invariant: Aggregated reports do NOT expose raw URLs or exact coordinates
  public generateDailyReport(params: {
    date: string;
    childId: string;
    screenTimeMinutes: number;
    hasDataGap?: boolean;
    gapReason?: string;
    webCategories?: WebCategoryStat[];
    securityEvents?: SecurityEventSummary[];
    includeLocation?: boolean;
  }): DailyReport {
    return {
      date: params.date,
      childId: params.childId,
      totalScreenTimeMinutes: params.hasDataGap ? 0 : params.screenTimeMinutes,
      hasDataGap: Boolean(params.hasDataGap),
      gapReason: params.hasDataGap ? (params.gapReason || 'Qurilma o‘chirilgan yoki internet ulanmagan') : undefined,
      webCategories: params.webCategories || [],
      securityEvents: params.securityEvents || [],
      isLocationIncluded: Boolean(params.includeLocation),
      generatedAt: new Date().toISOString(),
    };
  }

  public generateWeeklyReport(params: {
    weekStarting: string;
    childId: string;
    dailyReports: DailyReport[];
  }): WeeklyReport {
    let totalMinutes = 0;
    let gaps = 0;
    const catMap = new Map<string, { minutes: number; visits: number }>();
    let secAlerts = 0;

    for (const rep of params.dailyReports) {
      if (rep.hasDataGap) {
        gaps++;
      } else {
        totalMinutes += rep.totalScreenTimeMinutes;
      }
      for (const cat of rep.webCategories) {
        const existing = catMap.get(cat.category) || { minutes: 0, visits: 0 };
        catMap.set(cat.category, {
          minutes: existing.minutes + cat.minutesSpent,
          visits: existing.visits + cat.visitCount,
        });
      }
      for (const sec of rep.securityEvents) {
        secAlerts += sec.count;
      }
    }

    const validDays = Math.max(1, params.dailyReports.length - gaps);
    const topCategories: WebCategoryStat[] = Array.from(catMap.entries())
      .map(([category, stat]) => ({
        category,
        minutesSpent: stat.minutes,
        visitCount: stat.visits,
      }))
      .sort((a, b) => b.minutesSpent - a.minutesSpent);

    return {
      weekStarting: params.weekStarting,
      childId: params.childId,
      totalScreenTimeHours: Math.round((totalMinutes / 60) * 10) / 10,
      dailyAveragesMinutes: Math.round(totalMinutes / validDays),
      dataGapsCount: gaps,
      topCategories,
      totalSecurityAlerts: secAlerts,
      generatedAt: new Date().toISOString(),
    };
  }

  // FR-34 Invariant: Location export strictly requires extra authorization
  public exportDataArchive(params: {
    guardianId: string;
    childId: string;
    dataType: 'screen_time' | 'web_activity' | 'location_history' | 'full_archive';
    dateRange: { from: string; to: string };
    extraLocationConsent?: boolean;
  }): { exportId: string; downloadUrl: string; status: string } {
    if (params.dataType === 'location_history' || params.dataType === 'full_archive') {
      if (!params.extraLocationConsent) {
        throw new Error('Joylashuv tarixi eksporti uchun qo‘shimcha vasiy tasdig‘i talab qilinadi (FR-34).');
      }
    }

    const exportId = `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const auditRecord: ExportAuditRecord = {
      exportId,
      guardianId: params.guardianId,
      childId: params.childId,
      dataType: params.dataType,
      dateRange: params.dateRange,
      extraLocationConsentGiven: Boolean(params.extraLocationConsent),
      exportedAt: new Date().toISOString(),
    };
    this.exportAudits.push(auditRecord);

    return {
      exportId,
      downloadUrl: `/api/exports/${exportId}.json`,
      status: 'ready',
    };
  }

  public getExportAudits(): ExportAuditRecord[] {
    return [...this.exportAudits];
  }
}
