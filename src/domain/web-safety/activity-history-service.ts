// FR-09: Website Activity History, Background Filter, Query Param Sanitization & Retention Management

export interface ActivityRawEvent {
  id: string;
  domain: string;
  visitedAt: string;
  category: string;
  action: 'allow' | 'block' | 'warn';
  reason: string;
  signalSource: 'browser_extension' | 'vpn_dns' | 'accessibility';
  isBackgroundRequest: boolean;
}

export interface AggregatedDailyCategoryStats {
  date: string; // YYYY-MM-DD
  category: string;
  totalVisits: number;
  blockedCount: number;
  allowedCount: number;
}

export class ActivityHistoryService {
  private rawEvents: ActivityRawEvent[] = [];
  private dailyStats: Map<string, AggregatedDailyCategoryStats> = new Map(); // key: "YYYY-MM-DD:category"

  // Record an event with privacy guarantees
  public recordVisit(event: {
    rawUrlOrDomain: string;
    category: string;
    action: 'allow' | 'block' | 'warn';
    reason: string;
    signalSource: 'browser_extension' | 'vpn_dns' | 'accessibility';
    isBackgroundRequest: boolean;
    visitedAt?: string;
  }): ActivityRawEvent {
    // Privacy Requirement FR-09: NEVER store query parameters or search tokens!
    const cleanDomain = this.sanitizeDomainOnly(event.rawUrlOrDomain);

    const record: ActivityRawEvent = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      domain: cleanDomain,
      visitedAt: event.visitedAt || new Date().toISOString(),
      category: event.category,
      action: event.action,
      reason: event.reason,
      signalSource: event.signalSource,
      isBackgroundRequest: event.isBackgroundRequest,
    };

    this.rawEvents.unshift(record);

    // Aggregate into daily category statistics
    const dateStr = record.visitedAt.split('T')[0];
    const statKey = `${dateStr}:${record.category}`;
    const existing = this.dailyStats.get(statKey) || {
      date: dateStr,
      category: record.category,
      totalVisits: 0,
      blockedCount: 0,
      allowedCount: 0,
    };

    existing.totalVisits += 1;
    if (record.action === 'block') {
      existing.blockedCount += 1;
    } else {
      existing.allowedCount += 1;
    }

    this.dailyStats.set(statKey, existing);
    return record;
  }

  // Get visits with background filter option
  public getVisits(options: { userVisitsOnly?: boolean; limit?: number } = {}): ActivityRawEvent[] {
    let list = this.rawEvents;
    if (options.userVisitsOnly) {
      // Background requestlarni real tashrifdan ajratish
      list = list.filter((e) => !e.isBackgroundRequest);
    }
    if (options.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  public getDailyAggregatedStats(): AggregatedDailyCategoryStats[] {
    return Array.from(this.dailyStats.values());
  }

  // Enforce retention rules (FR-09):
  // raw events: 7 kun retention
  // aggregated daily stats: 90 kun retention
  public runRetentionCleanup(currentDate = new Date()): { prunedRawEvents: number; prunedAggregatedDays: number } {
    const rawCutoff = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const aggCutoff = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const initialRawCount = this.rawEvents.length;
    this.rawEvents = this.rawEvents.filter((event) => event.visitedAt >= rawCutoff);
    const prunedRawEvents = initialRawCount - this.rawEvents.length;

    let prunedAggregatedDays = 0;
    for (const [key, stat] of this.dailyStats.entries()) {
      if (stat.date < aggCutoff) {
        this.dailyStats.delete(key);
        prunedAggregatedDays += 1;
      }
    }

    return { prunedRawEvents, prunedAggregatedDays };
  }

  private sanitizeDomainOnly(input: string): string {
    let clean = input.trim();
    // Remove protocol
    clean = clean.replace(/^https?:\/\//i, '');
    // Strip query strings strictly
    clean = clean.split('?')[0];
    // Strip fragments
    clean = clean.split('#')[0];
    // Strip path to preserve pure domain
    clean = clean.split('/')[0];
    // Strip port
    clean = clean.split(':')[0];
    return clean.toLowerCase();
  }
}
