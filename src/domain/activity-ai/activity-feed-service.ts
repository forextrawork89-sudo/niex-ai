// FR-25: Activity Feed Service (Event Stream, Severity Filtering, Source & Result Tracking)

export type ActivityEventType =
  | 'web_block'
  | 'time_limit'
  | 'permission_request'
  | 'geofence'
  | 'check_in'
  | 'sos'
  | 'system_state';

export type EventSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ActivityFeedItem {
  id: string;
  childId: string;
  deviceId: string;
  type: ActivityEventType;
  severity: EventSeverity;
  title: string;
  description: string;
  timestamp: string;
  source: string; // e.g. "vpn_filter", "screen_time_daemon", "geofence_engine", "sos_button"
  result: string; // e.g. "blocked", "warning_shown", "dispatched_3_channels", "arrived_school"
  metadata?: Record<string, unknown>;
}

export class ActivityFeedService {
  private feed: ActivityFeedItem[] = [];

  public logEvent(item: Omit<ActivityFeedItem, 'id' | 'timestamp'>): ActivityFeedItem {
    const id = `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const fullItem: ActivityFeedItem = {
      ...item,
      id,
      timestamp: new Date().toISOString(),
    };
    this.feed.unshift(fullItem);
    return fullItem;
  }

  public getFeed(filter: {
    childId?: string;
    deviceId?: string;
    type?: ActivityEventType;
    severity?: EventSeverity;
    limit?: number;
  } = {}): ActivityFeedItem[] {
    let result = this.feed;

    if (filter.childId) {
      result = result.filter((item) => item.childId === filter.childId);
    }
    if (filter.deviceId) {
      result = result.filter((item) => item.deviceId === filter.deviceId);
    }
    if (filter.type) {
      result = result.filter((item) => item.type === filter.type);
    }
    if (filter.severity) {
      result = result.filter((item) => item.severity === filter.severity);
    }
    if (filter.limit) {
      result = result.slice(0, filter.limit);
    }

    return result;
  }
}
