import { describe, it, expect } from 'vitest';
import { AdditionalTimeService } from '../additional-time-service';

describe('FR-14: Additional Time Service', () => {
  it('submits time request and preserves idempotency on duplicate clicks', () => {
    const service = new AdditionalTimeService(3);
    const key = 'idem-req-123';

    const res1 = service.requestTime({
      idempotencyKey: key,
      childId: 'kid-1',
      appOrTarget: 'roblox',
      requestedMinutes: 30,
      reason: 'Do‘stlarim bilan o‘yinni tugatish',
    });

    expect(res1.success).toBe(true);
    expect(res1.request?.status).toBe('pending');
    expect(res1.request?.requestedMinutes).toBe(30);

    // Duplicate call with exact same idempotency key
    const res2 = service.requestTime({
      idempotencyKey: key,
      childId: 'kid-1',
      appOrTarget: 'roblox',
      requestedMinutes: 30,
    });

    expect(res2.success).toBe(true);
    expect(res2.request?.id).toBe(res1.request?.id);
    expect(service.getChildRequests('kid-1')).toHaveLength(1);
  });

  it('enforces configurable daily request limit', () => {
    const service = new AdditionalTimeService(2); // Max 2 requests per day

    service.requestTime({ idempotencyKey: 'k1', childId: 'kid-2', appOrTarget: 'app1', requestedMinutes: 15 });
    service.requestTime({ idempotencyKey: 'k2', childId: 'kid-2', appOrTarget: 'app2', requestedMinutes: 15 });

    // 3rd attempt exceeds limit
    const res3 = service.requestTime({ idempotencyKey: 'k3', childId: 'kid-2', appOrTarget: 'app3', requestedMinutes: 15 });
    expect(res3.success).toBe(false);
    expect(res3.error).toContain('limiti (2 marta) tugadi');
  });

  it('approves request and sets exact expiration time with audit trail', () => {
    const service = new AdditionalTimeService();
    const { request } = service.requestTime({
      idempotencyKey: 'k-approve',
      childId: 'kid-3',
      appOrTarget: 'minecraft',
      requestedMinutes: 60,
    });

    const approved = service.resolveTimeRequest(request!.id, 'approved', 'parent-dad', 'telegram');
    expect(approved.success).toBe(true);
    expect(approved.request?.status).toBe('approved');
    expect(approved.request?.channel).toBe('telegram');
    expect(approved.request?.grantedUntil).toBeDefined();

    const audit = service.getAuditLogs();
    expect(audit.some((a) => a.action === 'approve')).toBe(true);
  });
});
