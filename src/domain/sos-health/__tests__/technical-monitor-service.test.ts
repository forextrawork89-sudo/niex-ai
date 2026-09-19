import { describe, it, expect } from 'vitest';
import { TechnicalMonitorService } from '../technical-monitor-service';

describe('FR-24: Technical State Monitoring Service', () => {
  it('reports healthy when all permissions and heartbeats are normal', () => {
    const service = new TechnicalMonitorService();
    const evaluation = service.evaluateDeviceHealth({
      deviceId: 'dev-1',
      childId: 'kid-1',
      lastHeartbeatAt: new Date().toISOString(),
      hasLocationPermission: true,
      isGpsHardwareEnabled: true,
      isInternetConnected: true,
      batteryLevel: 90,
    });

    expect(evaluation.status).toBe('healthy');
    expect(evaluation.primaryIssue).toBe('all_healthy');
    expect(evaluation.technicalStateLabel).toContain('normal ishlamoqda');
  });

  it('accurately identifies location permission disabled without accusing child', () => {
    const service = new TechnicalMonitorService();
    const evaluation = service.evaluateDeviceHealth({
      deviceId: 'dev-1',
      childId: 'kid-1',
      lastHeartbeatAt: new Date().toISOString(),
      hasLocationPermission: false, // Disabled
      isGpsHardwareEnabled: true,
      isInternetConnected: true,
      batteryLevel: 80,
    });

    expect(evaluation.status).toBe('critical');
    expect(evaluation.primaryIssue).toBe('location_permission_disabled');
    expect(evaluation.guardianGuidance).toContain('Doimiy joylashuv');
    expect(evaluation.intentNeutralNote).toContain('Bolani asossiz ayblamang');
  });

  it('identifies stale heartbeat when device has been silent for > 60 minutes', () => {
    const service = new TechnicalMonitorService();
    const past75 = new Date(Date.now() - 75 * 60 * 1000).toISOString(); // 75 mins ago

    const evaluation = service.evaluateDeviceHealth({
      deviceId: 'dev-2',
      childId: 'kid-2',
      lastHeartbeatAt: past75,
      hasLocationPermission: true,
      isGpsHardwareEnabled: true,
      isInternetConnected: true,
      batteryLevel: 25,
    });

    expect(evaluation.status).toBe('critical');
    expect(evaluation.primaryIssue).toBe('stale_heartbeat');
    expect(evaluation.technicalStateLabel).toContain('75 daqiqadan beri signal kelmayapti');
    expect(evaluation.guardianGuidance).toContain('Bolaga qo‘ng‘iroq qiling');
  });
});
