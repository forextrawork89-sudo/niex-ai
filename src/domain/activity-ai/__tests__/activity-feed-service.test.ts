import { describe, it, expect } from 'vitest';
import { ActivityFeedService } from '../activity-feed-service';

describe('ActivityFeedService (FR-25)', () => {
  it('logs events and assigns unique IDs and timestamps', () => {
    const service = new ActivityFeedService();
    const item = service.logEvent({
      childId: 'child-1',
      deviceId: 'dev-1',
      type: 'web_block',
      severity: 'high',
      title: 'Phishing domain blocked',
      description: 'Attempted to visit malicious page',
      source: 'vpn_filter',
      result: 'blocked',
      metadata: { domain: 'bad-site.com' },
    });

    expect(item.id).toMatch(/^act-/);
    expect(item.timestamp).toBeDefined();
    expect(item.title).toBe('Phishing domain blocked');

    const feed = service.getFeed();
    expect(feed.length).toBe(1);
    expect(feed[0].id).toBe(item.id);
  });

  it('filters feed by childId, type, severity, and limit', () => {
    const service = new ActivityFeedService();
    service.logEvent({
      childId: 'child-1',
      deviceId: 'dev-1',
      type: 'web_block',
      severity: 'high',
      title: 'Block 1',
      description: 'Test block',
      source: 'vpn_filter',
      result: 'blocked',
    });
    service.logEvent({
      childId: 'child-2',
      deviceId: 'dev-2',
      type: 'time_limit',
      severity: 'medium',
      title: 'Limit 1',
      description: 'Test limit',
      source: 'screen_time',
      result: 'warning_shown',
    });
    service.logEvent({
      childId: 'child-1',
      deviceId: 'dev-1',
      type: 'sos',
      severity: 'critical',
      title: 'SOS trigger',
      description: 'Emergency pressed',
      source: 'sos_button',
      result: 'dispatched_all',
    });

    const child1Feed = service.getFeed({ childId: 'child-1' });
    expect(child1Feed.length).toBe(2);

    const sosFeed = service.getFeed({ type: 'sos' });
    expect(sosFeed.length).toBe(1);
    expect(sosFeed[0].severity).toBe('critical');

    const limitedFeed = service.getFeed({ limit: 1 });
    expect(limitedFeed.length).toBe(1);
    expect(limitedFeed[0].type).toBe('sos'); // most recent
  });
});
