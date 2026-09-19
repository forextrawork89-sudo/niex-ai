// FR-16: Multi-device Shared Time Budget, Offline Synchronization Boundary & Documented Fallback

export interface DeviceBudgetAllocation {
  deviceId: string;
  deviceName: string;
  allocatedMinutes: number;
  consumedMinutes: number;
  isOnline: boolean;
  lastSyncedAt: string;
}

export interface SharedBudgetStatus {
  childId: string;
  totalDailyBudgetMinutes: number;
  consumedTotalMinutes: number;
  remainingTotalMinutes: number;
  devices: DeviceBudgetAllocation[];
  offlineBoundaryFallbackNote: string;
  hasOfflineDevices: boolean;
}

export class SharedTimeBudgetManager {
  private childId: string;
  private totalDailyBudgetMinutes: number;
  private devices: Map<string, DeviceBudgetAllocation> = new Map();

  constructor(childId: string, totalDailyBudgetMinutes: number) {
    this.childId = childId;
    this.totalDailyBudgetMinutes = totalDailyBudgetMinutes;
  }

  public registerDevice(deviceId: string, deviceName: string) {
    this.devices.set(deviceId, {
      deviceId,
      deviceName,
      allocatedMinutes: 0,
      consumedMinutes: 0,
      isOnline: true,
      lastSyncedAt: new Date().toISOString(),
    });
    this.rebalanceAllocations();
  }

  public reportDeviceConsumption(deviceId: string, minutesUsed: number, isOnline = true) {
    const dev = this.devices.get(deviceId);
    if (dev) {
      dev.consumedMinutes += minutesUsed;
      dev.isOnline = isOnline;
      dev.lastSyncedAt = new Date().toISOString();
      this.rebalanceAllocations();
    }
  }

  public setDeviceConnectivity(deviceId: string, isOnline: boolean) {
    const dev = this.devices.get(deviceId);
    if (dev) {
      dev.isOnline = isOnline;
      this.rebalanceAllocations();
    }
  }

  // Rebalance remaining budget across devices
  // Offline Boundary: When offline, device is given a safe local slice
  private rebalanceAllocations() {
    const all = Array.from(this.devices.values());
    if (all.length === 0) return;

    const totalConsumed = all.reduce((sum, d) => sum + d.consumedMinutes, 0);
    const remaining = Math.max(0, this.totalDailyBudgetMinutes - totalConsumed);

    const onlineDevices = all.filter((d) => d.isOnline);

    if (onlineDevices.length > 0) {
      const perDevice = Math.floor(remaining / onlineDevices.length);
      for (const d of onlineDevices) {
        d.allocatedMinutes = d.consumedMinutes + perDevice;
      }
    }

    // For offline devices: preserve documented fallback boundary (e.g. 15 minutes safety floor if remaining exists)
    for (const d of all.filter((dev) => !dev.isOnline)) {
      const floor = Math.min(15, remaining);
      d.allocatedMinutes = d.consumedMinutes + floor;
    }
  }

  public getStatus(): SharedBudgetStatus {
    const all = Array.from(this.devices.values());
    const consumedTotalMinutes = all.reduce((sum, d) => sum + d.consumedMinutes, 0);
    const remainingTotalMinutes = Math.max(0, this.totalDailyBudgetMinutes - consumedTotalMinutes);
    const hasOfflineDevices = all.some((d) => !d.isOnline);

    return {
      childId: this.childId,
      totalDailyBudgetMinutes: this.totalDailyBudgetMinutes,
      consumedTotalMinutes,
      remainingTotalMinutes,
      devices: all,
      hasOfflineDevices,
      offlineBoundaryFallbackNote: hasOfflineDevices
        ? 'Diqqat: Ayrim qurilmalar oflayn. Haqiqiy vaqt kafolati berilmaydi; oflayn qurilma xavfsiz vaqt chegarasi (15 daqiqa) bilan ishlaydi va internetga ulanganda server bilan to‘liq sinxronlanadi.'
        : 'Barcha qurilmalar onlayn sinxronlangan.',
    };
  }
}
