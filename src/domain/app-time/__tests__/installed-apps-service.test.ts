import { describe, it, expect } from 'vitest';
import { InstalledAppsService } from '../installed-apps-service';

describe('FR-11: Installed Applications Service', () => {
  it('registers and manages installed applications with capability metadata', () => {
    const service = new InstalledAppsService();
    const app = service.registerApp({
      identifier: 'com.kiloo.subwaysurf',
      name: 'Subway Surfers',
      category: 'games',
      version: '2.35.0',
      controlCapability: 'full_control',
      isSystemApp: false,
      isEmergencyApp: false,
      isBlocked: false,
      isIncompleteData: false,
    });

    expect(app.name).toBe('Subway Surfers');
    expect(service.getInstalledApps()).toHaveLength(2); // Dialer + Subway Surfers
  });

  it('strictly prohibits blocking emergency/dialer apps', () => {
    const service = new InstalledAppsService();
    const result = service.setAppBlocked('com.android.dialer', true);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Favqulodda yordam');

    const dialer = service.getApp('com.android.dialer');
    expect(dialer?.isBlocked).toBe(false);
  });

  it('does NOT assume unsupported capabilities exist', () => {
    const service = new InstalledAppsService();
    service.registerApp({
      identifier: 'com.apple.camera',
      name: 'Kamera',
      category: 'system',
      controlCapability: 'unsupported',
      isSystemApp: true,
      isEmergencyApp: false,
      isBlocked: false,
      isIncompleteData: true,
    });

    const result = service.setAppBlocked('com.apple.camera', true);
    expect(result.success).toBe(false);
    expect(result.error).toContain('UNSUPPORTED');
  });
});
