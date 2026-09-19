// FR-14: Child Additional-Time Requests (15/30/60m, Idempotency, Daily Limits, Audit)

export type AdditionalMinutes = 15 | 30 | 60;

export interface AdditionalTimeRequest {
  id: string;
  idempotencyKey: string; // Prevents duplicate execution
  childId: string;
  appOrTarget: string;
  requestedMinutes: AdditionalMinutes;
  reason?: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  resolvedAt?: string;
  resolvedBy?: string;
  channel?: 'dashboard' | 'telegram';
  grantedUntil?: string; // Exact ISO expiration
}

export interface AdditionalTimeAudit {
  id: string;
  requestId: string;
  childId: string;
  action: 'request' | 'approve' | 'reject';
  grantedMinutes?: number;
  actor: string;
  timestamp: string;
}

export class AdditionalTimeService {
  private requests: Map<string, AdditionalTimeRequest> = new Map();
  private auditLogs: AdditionalTimeAudit[] = [];
  private maxDailyRequestsPerChild: number;

  constructor(maxDailyRequestsPerChild = 3) {
    this.maxDailyRequestsPerChild = maxDailyRequestsPerChild;
  }

  // Child requests extra time
  public requestTime(params: {
    idempotencyKey: string;
    childId: string;
    appOrTarget: string;
    requestedMinutes: AdditionalMinutes;
    reason?: string;
  }): { success: boolean; request?: AdditionalTimeRequest; error?: string } {
    // 1. Idempotency check: if request with this idempotencyKey already exists, return existing
    const existing = Array.from(this.requests.values()).find(
      (r) => r.idempotencyKey === params.idempotencyKey
    );
    if (existing) {
      return { success: true, request: existing };
    }

    // 2. Enforce configurable daily request limit (FR-14)
    const todayStr = new Date().toISOString().split('T')[0];
    const childTodayRequests = Array.from(this.requests.values()).filter(
      (r) => r.childId === params.childId && r.requestedAt.startsWith(todayStr)
    );

    if (childTodayRequests.length >= this.maxDailyRequestsPerChild) {
      return {
        success: false,
        error: `Bugun uchun qo‘shimcha vaqt so‘rash limiti (${this.maxDailyRequestsPerChild} marta) tugadi.`,
      };
    }

    const id = `extra-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const req: AdditionalTimeRequest = {
      id,
      idempotencyKey: params.idempotencyKey,
      childId: params.childId,
      appOrTarget: params.appOrTarget,
      requestedMinutes: params.requestedMinutes,
      reason: params.reason,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    this.requests.set(id, req);
    this.recordAudit('request', req.id, req.childId, req.childId, req.requestedMinutes);

    return { success: true, request: req };
  }

  // Parent approves or rejects via Dashboard or Telegram
  public resolveTimeRequest(
    requestId: string,
    decision: 'approved' | 'rejected',
    guardianId: string,
    channel: 'dashboard' | 'telegram'
  ): { success: boolean; request?: AdditionalTimeRequest; error?: string } {
    const req = this.requests.get(requestId);
    if (!req) return { success: false, error: 'So‘rov topilmadi.' };

    if (req.status !== 'pending') {
      return { success: false, error: 'So‘rov allaqachon ko‘rib chiqilgan.' };
    }

    const now = new Date();
    req.status = decision;
    req.resolvedAt = now.toISOString();
    req.resolvedBy = guardianId;
    req.channel = channel;

    if (decision === 'approved') {
      const expires = new Date(now.getTime() + req.requestedMinutes * 60 * 1000);
      req.grantedUntil = expires.toISOString();
    }

    this.recordAudit(decision === 'approved' ? 'approve' : 'reject', req.id, req.childId, guardianId, req.requestedMinutes);

    return { success: true, request: req };
  }

  public getChildRequests(childId: string): AdditionalTimeRequest[] {
    return Array.from(this.requests.values()).filter((r) => r.childId === childId);
  }

  public getAuditLogs(): AdditionalTimeAudit[] {
    return [...this.auditLogs];
  }

  private recordAudit(
    action: AdditionalTimeAudit['action'],
    requestId: string,
    childId: string,
    actor: string,
    grantedMinutes?: number
  ) {
    this.auditLogs.push({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      requestId,
      childId,
      action,
      grantedMinutes,
      actor,
      timestamp: new Date().toISOString(),
    });
  }
}
