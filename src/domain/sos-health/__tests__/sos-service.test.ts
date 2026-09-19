import { describe, it, expect } from 'vitest';
import { SosService, NIEX_SOS_DISCLAIMER } from '../sos-service';

describe('FR-23: SOS Emergency Alert Service', () => {
  it('requires at least 3-second hold to trigger (prevents accidental clicks)', () => {
    const service = new SosService();

    // 1-second accidental tap -> Rejected
    const tapAttempt = service.triggerSos({
      childId: 'kid-1',
      holdDurationSeconds: 1,
      isOnline: true,
    });
    expect(tapAttempt.success).toBe(false);
    expect(tapAttempt.error).toContain('3 soniya');

    // 3-second intentional hold -> Triggered
    const holdAttempt = service.triggerSos({
      childId: 'kid-1',
      holdDurationSeconds: 3,
      isOnline: true,
    });
    expect(holdAttempt.success).toBe(true);
    expect(holdAttempt.alert?.status).toBe('sent');
    expect(holdAttempt.alert?.channelsDispatched).toEqual(['telegram', 'sms', 'web_push']);
    expect(holdAttempt.alert?.disclaimer).toBe(NIEX_SOS_DISCLAIMER);
  });

  it('records guardian seen acknowledgement', () => {
    const service = new SosService();
    const { alert } = service.triggerSos({
      childId: 'kid-2',
      holdDurationSeconds: 4,
      isOnline: true,
    });

    const acknowledged = service.acknowledgeSeen(alert!.id, 'guardian-mom');
    expect(acknowledged.success).toBe(true);
    expect(acknowledged.alert?.status).toBe('seen');
    expect(acknowledged.alert?.seenByGuardianId).toBe('guardian-mom');
  });

  it('retries up to 3 times after 2 minutes if not seen', () => {
    const service = new SosService();
    const { alert } = service.triggerSos({
      childId: 'kid-3',
      holdDurationSeconds: 3,
      isOnline: true,
    });
    const alertId = alert!.id;

    // Right away (0 minutes) -> No retry
    const res0 = service.processRetries(alertId, new Date());
    expect(res0.retried).toBe(false);

    // After 2.5 minutes -> Retry 1
    const t1 = new Date(Date.now() + 150 * 1000);
    const res1 = service.processRetries(alertId, t1);
    expect(res1.retried).toBe(true);
    expect(res1.count).toBe(1);

    // After 5 minutes -> Retry 2
    const t2 = new Date(t1.getTime() + 150 * 1000);
    const res2 = service.processRetries(alertId, t2);
    expect(res2.retried).toBe(true);
    expect(res2.count).toBe(2);

    // After 7.5 minutes -> Retry 3
    const t3 = new Date(t2.getTime() + 150 * 1000);
    const res3 = service.processRetries(alertId, t3);
    expect(res3.retried).toBe(true);
    expect(res3.count).toBe(3);

    // After 10 minutes -> Cap reached, max 3 retries
    const t4 = new Date(t3.getTime() + 150 * 1000);
    const res4 = service.processRetries(alertId, t4);
    expect(res4.retried).toBe(false);
    expect(res4.count).toBe(3);
  });

  it('queues for offline SMS dispatch when offline', () => {
    const service = new SosService();
    const { success, alert } = service.triggerSos({
      childId: 'kid-offline',
      holdDurationSeconds: 5,
      isOnline: false,
    });

    expect(success).toBe(true);
    expect(alert?.isOfflineQueued).toBe(true);
    expect(alert?.channelsDispatched).toEqual(['sms']);
  });

  it('returns error when acknowledging non-existent alert ID', () => {
    const service = new SosService();
    const result = service.acknowledgeSeen('non-existent-sos-id', 'guardian-1');
    expect(result.success).toBe(false);
    expect(result.error).toContain('topilmadi');
  });
});

