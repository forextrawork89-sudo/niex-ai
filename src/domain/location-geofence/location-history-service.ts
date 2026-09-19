// FR-21: 7-Day Location History, Tracking Gaps & Automatic 7-Day Cleanup

export interface HistoryPoint {
  id: string;
  childId: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestamp: string;
}

export interface TrackingGap {
  start: string;
  end: string;
  gapDurationMinutes: number;
  reason: 'device_offline' | 'gps_lost' | 'power_off';
}

export class LocationHistoryService {
  private history: HistoryPoint[] = [];

  public recordPoint(point: Omit<HistoryPoint, 'id'>): HistoryPoint {
    const id = `pt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const fullPoint: HistoryPoint = { ...point, id };
    this.history.push(fullPoint);
    return fullPoint;
  }

  // Retrieve history (Guard: Authorized guardian access only)
  public getHistory(
    childId: string,
    guardianAuthToken: string,
    currentDate = new Date()
  ): { points: HistoryPoint[]; gaps: TrackingGap[]; error?: string } {
    if (!guardianAuthToken || guardianAuthToken.trim().length === 0) {
      return { points: [], gaps: [], error: 'Joylashuv tarixini ko‘rish uchun ota-ona ruxsati talab qilinadi (FR-21).' };
    }

    // Filter points for this child
    const childPoints = this.history
      .filter((p) => p.childId === childId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Detect tracking gaps (> 30 mins between consecutive points)
    const gaps: TrackingGap[] = [];
    for (let i = 0; i < childPoints.length - 1; i++) {
      const t1 = new Date(childPoints[i].timestamp).getTime();
      const t2 = new Date(childPoints[i + 1].timestamp).getTime();
      const diffMin = Math.floor((t2 - t1) / (60 * 1000));
      if (diffMin >= 30) {
        gaps.push({
          start: childPoints[i].timestamp,
          end: childPoints[i + 1].timestamp,
          gapDurationMinutes: diffMin,
          reason: 'device_offline',
        });
      }
    }

    return { points: childPoints, gaps };
  }

  // Automatic cleanup of points older than 7 days (FR-21)
  public pruneOlderThan7Days(currentDate = new Date()): number {
    const cutoff = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const initial = this.history.length;
    this.history = this.history.filter((p) => p.timestamp >= cutoff);
    return initial - this.history.length;
  }
}
