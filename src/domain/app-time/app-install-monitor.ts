// FR-15: Newly Installed App Detection, Notification & Device Owner Restrictions

export interface NewAppEvent {
  id: string;
  childId: string;
  deviceId: string;
  appIdentifier: string;
  appName: string;
  installedAt: string;
  isInstallationRestricted: boolean;
  actionTaken: 'notified' | 'blocked_by_device_owner' | 'monitoring_only';
}

export class AppInstallMonitor {
  private events: NewAppEvent[] = [];
  private isDeviceOwner: boolean;

  constructor(isDeviceOwner = false) {
    this.isDeviceOwner = isDeviceOwner;
  }

  // Handle detection of a new package install
  public handleNewAppInstalled(params: {
    childId: string;
    deviceId: string;
    appIdentifier: string;
    appName: string;
  }): { event: NewAppEvent; notificationPayload: { title: string; message: string; priority: string } } {
    const id = `install-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    let actionTaken: NewAppEvent['actionTaken'] = 'notified';
    let isInstallationRestricted = false;

    // FR-15: If Device Owner exists, installation can be blocked/restricted
    if (this.isDeviceOwner) {
      actionTaken = 'blocked_by_device_owner';
      isInstallationRestricted = true;
    } else {
      actionTaken = 'monitoring_only';
      isInstallationRestricted = false;
    }

    const event: NewAppEvent = {
      id,
      childId: params.childId,
      deviceId: params.deviceId,
      appIdentifier: params.appIdentifier,
      appName: params.appName,
      installedAt: now,
      isInstallationRestricted,
      actionTaken,
    };

    this.events.unshift(event);

    const notificationPayload = {
      title: 'Yangi ilova o‘rnatildi',
      message: `${params.appName} (${params.appIdentifier}) qurilmaga o‘rnatildi. ${
        this.isDeviceOwner ? 'Device Owner orqali cheklandi.' : 'Ota-ona xabardor qilindi.'
      }`,
      priority: 'high',
    };

    return { event, notificationPayload };
  }

  public getEvents(childId?: string): NewAppEvent[] {
    return childId ? this.events.filter((e) => e.childId === childId) : [...this.events];
  }

  public hasDeviceOwnerCapability(): boolean {
    return this.isDeviceOwner;
  }
}
