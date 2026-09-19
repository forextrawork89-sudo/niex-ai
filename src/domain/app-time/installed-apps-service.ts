// FR-11: Installed Applications Inventory, Control Capabilities & Emergency/System Protection

export type AppControlCapability = 'full_control' | 'time_limit_only' | 'monitor_only' | 'unsupported';

export interface InstalledApp {
  identifier: string; // package name / bundle id, e.g. "com.google.android.youtube"
  name: string;
  category: 'social' | 'games' | 'education' | 'productivity' | 'system' | 'emergency' | 'unknown';
  version?: string;
  controlCapability: AppControlCapability;
  isSystemApp: boolean;
  isEmergencyApp: boolean;
  isBlocked: boolean;
  isIncompleteData: boolean;
}

// Protected emergency and critical system apps that MUST NEVER BE BLOCKED
export const EMERGENCY_APP_IDENTIFIERS = new Set<string>([
  'com.android.dialer',
  'com.samsung.android.dialer',
  'com.apple.mobilephone',
  'com.android.emergency',
  'com.android.server.telecom',
  'emergency_call_service',
  'uz.112.emergency',
]);

export class InstalledAppsService {
  private apps: Map<string, InstalledApp> = new Map();

  constructor() {
    // Seed system emergency apps
    this.registerApp({
      identifier: 'com.android.dialer',
      name: 'Telefon (Qo‘ng‘iroqlar)',
      category: 'emergency',
      version: '1.0',
      controlCapability: 'unsupported',
      isSystemApp: true,
      isEmergencyApp: true,
      isBlocked: false,
      isIncompleteData: false,
    });
  }

  public registerApp(app: InstalledApp): InstalledApp {
    // Safety Invariant: Emergency apps are strictly non-blockable
    if (EMERGENCY_APP_IDENTIFIERS.has(app.identifier) || app.category === 'emergency') {
      app.isEmergencyApp = true;
      app.isBlocked = false;
      app.controlCapability = 'unsupported'; // System protection prevents artificial control
    }

    this.apps.set(app.identifier, app);
    return app;
  }

  public setAppBlocked(
    identifier: string,
    blocked: boolean
  ): { success: boolean; app?: InstalledApp; error?: string } {
    const app = this.apps.get(identifier);
    if (!app) {
      return { success: false, error: 'Ilova topilmadi.' };
    }

    // FR-11 Invariant: Emergency/system apps MUST NEVER be blocked
    if (app.isEmergencyApp) {
      return {
        success: false,
        error: 'Favqulodda yordam va asosiy telefon qo‘ng‘iroqlari ilovasini bloklash qat’iyan taqiqlanadi (FR-11).',
      };
    }

    if (app.controlCapability === 'unsupported' && blocked) {
      // FR-11 Invariant: Do not assume unsupported capabilities exist
      return {
        success: false,
        error: 'Ushbu ilovani bloklash platforma tomonidan qo‘llab-quvvatlanmaydi (UNSUPPORTED).',
      };
    }

    app.isBlocked = blocked;
    return { success: true, app };
  }

  public getInstalledApps(): InstalledApp[] {
    return Array.from(this.apps.values());
  }

  public getApp(identifier: string): InstalledApp | undefined {
    return this.apps.get(identifier);
  }
}
