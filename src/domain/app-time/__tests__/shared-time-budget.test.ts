import { describe, it, expect } from 'vitest';
import { SharedTimeBudgetManager } from '../shared-time-budget';

describe('FR-16: Multi-Device Shared Time Budget', () => {
  it('shares single budget across phone and tablet and rebalances on consumption', () => {
    const manager = new SharedTimeBudgetManager('kid-1', 120); // 120 minutes total

    manager.registerDevice('phone-1', 'Telefon');
    manager.registerDevice('tablet-1', 'Planshet');

    let status = manager.getStatus();
    expect(status.remainingTotalMinutes).toBe(120);

    // Child uses 40 minutes on phone
    manager.reportDeviceConsumption('phone-1', 40);

    status = manager.getStatus();
    expect(status.consumedTotalMinutes).toBe(40);
    expect(status.remainingTotalMinutes).toBe(80);
  });

  it('documents offline fallback without making false real-time claims', () => {
    const manager = new SharedTimeBudgetManager('kid-2', 90);
    manager.registerDevice('phone-2', 'Telefon');
    manager.registerDevice('tablet-2', 'Planshet');

    // Tablet goes offline
    manager.setDeviceConnectivity('tablet-2', false);

    const status = manager.getStatus();
    expect(status.hasOfflineDevices).toBe(true);
    expect(status.offlineBoundaryFallbackNote).toContain('Haqiqiy vaqt kafolati berilmaydi');
    expect(status.offlineBoundaryFallbackNote).toContain('15 daqiqa');
  });
});
