import { describe, it, expect } from 'vitest';
import { NotificationCenter } from '../notification-center';

describe('FR-33: Notification Center', () => {
  it('dispatches across channels with deduplication', () => {
    const center = new NotificationCenter();

    // First dispatch
    const res1 = center.dispatch(
      {
        title: 'Sayt bloklandi',
        body: 'Cheklangan o‘yin saytiga kirish taqiqlandi.',
        priority: 'medium',
        category: 'web_block',
        childId: 'kid-1',
        domain: 'games.com',
      },
      [{ guardianId: 'parent-1', channels: ['telegram', 'web_push'] }]
    );

    expect(res1).toHaveLength(2);
    expect(res1[0].occurrenceCount).toBe(1);

    // Immediate duplicate dispatch within window
    const res2 = center.dispatch(
      {
        title: 'Sayt bloklandi',
        body: 'Cheklangan o‘yin saytiga kirish taqiqlandi.',
        priority: 'medium',
        category: 'web_block',
        childId: 'kid-1',
        domain: 'games.com',
      },
      [{ guardianId: 'parent-1', channels: ['telegram', 'web_push'] }]
    );

    expect(res2).toHaveLength(2);
    expect(res2[0].occurrenceCount).toBe(2); // Count incremented, no duplicate spam
  });

  it('redacts exact GPS coordinates and full sensitive URLs from previews', () => {
    const center = new NotificationCenter();
    const dispatched = center.dispatch(
      {
        title: 'Geozona xabari',
        body: 'Bola 41.3111, 69.2797 manziliga yetib keldi. Sayt: https://adult-site.com/secret/token?q=xxx',
        priority: 'high',
        category: 'geofence',
        childId: 'kid-2',
        exactCoordinates: { lat: 41.3111, lng: 69.2797 },
        sensitiveUrl: 'https://adult-site.com/secret/token?q=xxx',
        zoneName: 'Maktab hududi',
        domain: 'adult-site.com',
      },
      [{ guardianId: 'parent-2', channels: ['telegram'] }]
    );

    const preview = dispatched[0].previewBody;
    expect(preview).not.toContain('41.3111, 69.2797');
    expect(preview).not.toContain('/secret/token?q=xxx');
    expect(preview).toContain('Maktab hududi');
    expect(preview).toContain('adult-site.com');
  });

  it('ensures critical notifications cannot be disabled by channel preferences', () => {
    const center = new NotificationCenter();
    center.setPreference('parent-3', 'telegram', false); // Guardian disabled telegram

    const dispatched = center.dispatch(
      {
        title: 'SOS signal',
        body: 'Favqulodda yordam talab qilindi!',
        priority: 'critical',
        category: 'sos',
        childId: 'kid-3',
      },
      [{ guardianId: 'parent-3', channels: ['telegram'] }]
    );

    expect(dispatched).toHaveLength(1);
    expect(dispatched[0].priority).toBe('critical');
    expect(dispatched[0].channel).toBe('telegram');
  });
});
