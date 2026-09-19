import { describe, it, expect } from 'vitest';
import { WhatChangedService } from '../what-changed-service';

describe('WhatChangedService (FR-45)', () => {
  it('computes empty diff when no changes occurred after last seen', () => {
    const service = new WhatChangedService();
    const now = new Date().toISOString();
    service.setGuardianLastSeen('guardian-1', now);

    const oldDate = new Date(Date.now() - 10000).toISOString();

    const diff = service.computeWhatChanged({
      guardianId: 'guardian-1',
      newApps: [{ appName: 'Old App', installedAt: oldDate }],
      blocks: [{ domain: 'old.com', blockedAt: oldDate }],
      permissionRequests: [{ target: 'camera', requestedAt: oldDate }],
      capabilityChanges: [{ description: 'Accessibility changed', changedAt: oldDate }],
    });

    expect(diff.isEmpty).toBe(true);
    expect(diff.diffRows.length).toBe(0);
    expect(diff.emptyMessage).toContain('muhim o‘zgarishlar yuz bermadi');
  });

  it('caps diff rows to maximum 5 rows sorted descending by occurredAt', () => {
    const service = new WhatChangedService();
    const lastSeen = '2026-09-18T10:00:00.000Z';
    service.setGuardianLastSeen('guardian-1', lastSeen);

    const diff = service.computeWhatChanged({
      guardianId: 'guardian-1',
      newApps: [
        { appName: 'App 1', installedAt: '2026-09-18T11:00:00.000Z' },
        { appName: 'App 2', installedAt: '2026-09-18T11:10:00.000Z' },
        { appName: 'App 3', installedAt: '2026-09-18T11:20:00.000Z' },
      ],
      blocks: [
        { domain: 'bad1.com', blockedAt: '2026-09-18T11:30:00.000Z' },
        { domain: 'bad2.com', blockedAt: '2026-09-18T11:35:00.000Z' },
      ],
      permissionRequests: [
        { target: 'storage', requestedAt: '2026-09-18T11:40:00.000Z' },
        { target: 'location', requestedAt: '2026-09-18T11:45:00.000Z' },
      ],
      capabilityChanges: [
        { description: 'VPN turned on', changedAt: '2026-09-18T11:50:00.000Z' },
      ],
    });

    expect(diff.isEmpty).toBe(false);
    expect(diff.diffRows.length).toBe(5); // Invariant: max 5 rows
    expect(diff.diffRows[0].type).toBe('capability_change'); // most recent (11:50)
  });
});
