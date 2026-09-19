import { describe, it, expect } from 'vitest';
import { AppInstallMonitor } from '../app-install-monitor';

describe('FR-15: App Install Monitor', () => {
  it('detects app installation and notifies guardians in normal mode', () => {
    const monitor = new AppInstallMonitor(false); // Normal mode
    const { event, notificationPayload } = monitor.handleNewAppInstalled({
      childId: 'kid-1',
      deviceId: 'phone-1',
      appIdentifier: 'com.zhiliaoapp.musically',
      appName: 'TikTok',
    });

    expect(event.appName).toBe('TikTok');
    expect(event.actionTaken).toBe('monitoring_only');
    expect(event.isInstallationRestricted).toBe(false);
    expect(notificationPayload.title).toBe('Yangi ilova o‘rnatildi');
  });

  it('restricts installation when Device Owner is active', () => {
    const monitor = new AppInstallMonitor(true); // Device Owner mode
    const { event } = monitor.handleNewAppInstalled({
      childId: 'kid-1',
      deviceId: 'tablet-1',
      appIdentifier: 'com.casino.slots',
      appName: 'Casino Slots',
    });

    expect(event.actionTaken).toBe('blocked_by_device_owner');
    expect(event.isInstallationRestricted).toBe(true);
  });
});
