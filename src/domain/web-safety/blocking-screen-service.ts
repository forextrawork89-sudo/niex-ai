// FR-10: Child Blocking Screen State, Permission Requests, Approval Channels & Device Applied State Separation

export type ApprovalScope = 'domain' | 'category';
export type ApprovalDuration = '1_hour' | 'today' | 'permanent';

export interface ChildBlockingScreenState {
  domain: string;
  category: string;
  explanation_child: string;
  parent_rule_reason?: string;
  remaining_restriction: string;
  isPermissionRequestAllowed: boolean;
  activeRequestId?: string;
}

export interface PermissionRequest {
  id: string;
  childId: string;
  domain: string;
  category: string;
  requestedAt: string;
  userMessage?: string;
  scope: ApprovalScope;
  backend_status: 'pending' | 'accepted' | 'rejected';
  device_status: 'pending' | 'applied';
  resolution?: {
    decidedBy: 'parent_dashboard' | 'telegram_inline';
    guardianId: string;
    decidedAt: string;
    duration: ApprovalDuration;
    grantedUntil?: string; // Exact ISO timestamp
  };
}

export class BlockingScreenService {
  private requests: Map<string, PermissionRequest> = new Map();

  // Generate blocking screen view data for child
  public getBlockingScreen(params: {
    domain: string;
    category: string;
    explanation_child: string;
    parent_rule_reason?: string;
    remainingMinutes?: number;
    childId: string;
  }): ChildBlockingScreenState {
    const existingReq = Array.from(this.requests.values()).find(
      (r) => r.childId === params.childId && r.domain === params.domain && r.backend_status === 'pending'
    );

    const remainingStr = params.remainingMinutes
      ? `Cheklov tugashiga taxminan ${params.remainingMinutes} daqiqa qoldi.`
      : 'Ushbu manzil doimiy qoidalar bo‘yicha yopiq.';

    return {
      domain: params.domain,
      category: params.category,
      explanation_child: params.explanation_child,
      parent_rule_reason: params.parent_rule_reason,
      remaining_restriction: remainingStr,
      isPermissionRequestAllowed: !existingReq,
      activeRequestId: existingReq?.id,
    };
  }

  // Child initiates request
  public requestPermission(params: {
    childId: string;
    domain: string;
    category: string;
    userMessage?: string;
    scope?: ApprovalScope;
  }): PermissionRequest {
    const id = `perm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const req: PermissionRequest = {
      id,
      childId: params.childId,
      domain: params.domain,
      category: params.category,
      requestedAt: new Date().toISOString(),
      userMessage: params.userMessage,
      scope: params.scope || 'domain',
      backend_status: 'pending',
      device_status: 'pending',
    };

    this.requests.set(id, req);
    return req;
  }

  // Parent resolves request via Dashboard or Telegram
  public resolveRequest(
    requestId: string,
    decision: 'accepted' | 'rejected',
    options: {
      decidedBy: 'parent_dashboard' | 'telegram_inline';
      guardianId: string;
      duration?: ApprovalDuration;
    }
  ): { success: boolean; request?: PermissionRequest; error?: string } {
    const req = this.requests.get(requestId);
    if (!req) return { success: false, error: 'Ruxsat so‘rovi topilmadi.' };

    const duration = options.duration || '1_hour';
    let grantedUntil: string | undefined;

    if (decision === 'accepted') {
      const now = new Date();
      if (duration === '1_hour') {
        grantedUntil = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      } else if (duration === 'today') {
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        grantedUntil = endOfDay.toISOString();
      } else {
        grantedUntil = undefined; // Permanent
      }
    }

    req.backend_status = decision;
    // FR-10: backend accepted and device applied statuses are maintained separately
    req.device_status = 'pending';
    req.resolution = {
      decidedBy: options.decidedBy,
      guardianId: options.guardianId,
      decidedAt: new Date().toISOString(),
      duration,
      grantedUntil,
    };

    return { success: true, request: req };
  }

  // Child device acknowledges policy sync
  public markDeviceApplied(requestId: string): { success: boolean; error?: string } {
    const req = this.requests.get(requestId);
    if (!req) return { success: false, error: 'So‘rov topilmadi.' };
    req.device_status = 'applied';
    return { success: true };
  }

  public getChildRequests(childId: string): PermissionRequest[] {
    return Array.from(this.requests.values()).filter((r) => r.childId === childId);
  }

  public getPendingRequests(): PermissionRequest[] {
    return Array.from(this.requests.values()).filter((r) => r.backend_status === 'pending');
  }
}
