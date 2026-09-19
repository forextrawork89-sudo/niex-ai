// FR-08 & FR-40: Web Rules Management, Schedules, Temporary Exceptions, Mandatory Security Guard & Audit

export type RuleAction = 'allow' | 'block' | 'schedule';
export type RuleTargetType = 'domain' | 'category';

export interface WebRule {
  id: string;
  targetType: RuleTargetType;
  targetValue: string; // e.g. "youtube.com" or "gaming"
  action: RuleAction;
  schedule?: {
    daysOfWeek: number[]; // 0 = Sunday, 1 = Monday...
    allowedStartHour: number; // e.g. 14 (14:00)
    allowedEndHour: number; // e.g. 18 (18:00)
  };
  isMandatorySecurityRule?: boolean; // Phishing/malware rules are mandatory
  parentReason?: string; // FR-40: Optional reason, max 200 chars
  childExplanation?: string; // FR-40: Age-appropriate language for child
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemporaryException {
  id: string;
  targetType: RuleTargetType;
  targetValue: string;
  durationMinutes: number;
  grantedBy: string;
  reason: string;
  deviceId: string;
  startedAt: string;
  expiresAt: string; // Exact ISO timestamp
  serverSynced: boolean;
}

export interface RuleAuditEntry {
  id: string;
  ruleId?: string;
  action: 'create_rule' | 'update_rule' | 'delete_rule' | 'grant_exception' | 'revoke_exception' | 'bypass_attempt';
  actor: string;
  target: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export class WebRulesService {
  private rules: Map<string, WebRule> = new Map();
  private exceptions: Map<string, TemporaryException> = new Map();
  private auditLog: RuleAuditEntry[] = [];

  constructor() {
    // Seed default mandatory security rules
    this.addMandatorySecurityRule('phishing', 'category', 'Phishing va soxta saytlar bolalar uchun xavflidir.');
    this.addMandatorySecurityRule('malware', 'category', 'Zararli virusli manbalar bloklangan.');
  }

  public setRule(
    rule: Omit<WebRule, 'id' | 'createdAt' | 'updatedAt'>,
    adminAuthToken?: string
  ): { success: boolean; rule?: WebRule; error?: string } {
    // Security Invariant: modifying mandatory rules requires admin re-authentication
    const existing = Array.from(this.rules.values()).find(
      (r) => r.targetType === rule.targetType && r.targetValue === rule.targetValue
    );

    if (existing?.isMandatorySecurityRule && (!adminAuthToken || adminAuthToken !== 'ADMIN_REAUTH_TOKEN_VALID')) {
      this.recordAudit('bypass_attempt', rule.createdBy, rule.targetValue, {
        error: 'Majburiy xavfsizlik qoidasini o‘zgartirishga noqonuniy urinish',
      });
      return {
        success: false,
        error: 'Phishing yoki zararli saytlar kabi majburiy qoidalarni o‘zgartirish faqat administrator qayta autentifikatsiyasi bilan mumkin.',
      };
    }

    // Validate FR-40: parentReason max 200 characters
    if (rule.parentReason && rule.parentReason.length > 200) {
      return { success: false, error: 'Qoida sababi 200 belgidan oshmasligi kerak (FR-40).' };
    }

    const id = existing ? existing.id : `rule-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const finalRule: WebRule = {
      ...rule,
      id,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    this.rules.set(id, finalRule);
    this.recordAudit(existing ? 'update_rule' : 'create_rule', rule.createdBy, rule.targetValue, {
      action: rule.action,
      reason: rule.parentReason,
    });

    return { success: true, rule: finalRule };
  }

  public grantTemporaryException(
    params: {
      targetType: RuleTargetType;
      targetValue: string;
      durationMinutes: number;
      grantedBy: string;
      reason: string;
      deviceId: string;
    },
    adminAuthToken?: string
  ): { success: boolean; exception?: TemporaryException; error?: string } {
    // FR-08 Invariant: Cannot bypass mandatory phishing/malware rule without admin re-authentication
    const isTargetMandatory = Array.from(this.rules.values()).some(
      (r) => r.isMandatorySecurityRule && r.targetValue === params.targetValue
    );

    if (isTargetMandatory && (!adminAuthToken || adminAuthToken !== 'ADMIN_REAUTH_TOKEN_VALID')) {
      this.recordAudit('bypass_attempt', params.grantedBy, params.targetValue, {
        error: 'Phishing/malware istisnosiga noqonuniy urinish',
      });
      return {
        success: false,
        error: 'Phishing va zararli manbalarni vaqtincha ochish faqat administrator qayta autentifikatsiyasi bilan ruxsat etiladi.',
      };
    }

    const now = new Date();
    const expires = new Date(now.getTime() + params.durationMinutes * 60 * 1000);

    const id = `ex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const exception: TemporaryException = {
      id,
      targetType: params.targetType,
      targetValue: params.targetValue,
      durationMinutes: params.durationMinutes,
      grantedBy: params.grantedBy,
      reason: params.reason,
      deviceId: params.deviceId,
      startedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      serverSynced: true, // Local timer + server synced
    };

    this.exceptions.set(id, exception);
    this.recordAudit('grant_exception', params.grantedBy, params.targetValue, {
      durationMinutes: params.durationMinutes,
      deviceId: params.deviceId,
      expiresAt: exception.expiresAt,
    });

    return { success: true, exception };
  }

  public evaluateAccess(
    domain: string,
    category: string,
    currentDate = new Date()
  ): { allowed: boolean; reason: string; ruleId?: string; exceptionId?: string } {
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    const nowIso = currentDate.toISOString();

    // 1. Check active temporary exception (Local timer check)
    for (const ex of this.exceptions.values()) {
      if (ex.expiresAt > nowIso) {
        if (
          (ex.targetType === 'domain' && cleanDomain.includes(ex.targetValue.toLowerCase())) ||
          (ex.targetType === 'category' && ex.targetValue.toLowerCase() === category.toLowerCase())
        ) {
          return {
            allowed: true,
            reason: `Vaqtincha ruxsat berilgan (${ex.durationMinutes} daqiqa, beruvchi: ${ex.grantedBy}). Sabab: ${ex.reason}`,
            exceptionId: ex.id,
          };
        }
      }
    }

    // 2. Check explicit domain rules
    for (const rule of this.rules.values()) {
      if (rule.targetType === 'domain' && cleanDomain.includes(rule.targetValue.toLowerCase())) {
        return this.resolveRuleAction(rule, currentDate);
      }
    }

    // 3. Check category rules
    for (const rule of this.rules.values()) {
      if (rule.targetType === 'category' && rule.targetValue.toLowerCase() === category.toLowerCase()) {
        return this.resolveRuleAction(rule, currentDate);
      }
    }

    // Default: Allowed if no blocking rule found
    return { allowed: true, reason: 'Standart ruxsat' };
  }

  public getRules(): WebRule[] {
    return Array.from(this.rules.values());
  }

  public getExceptions(activeOnly = true): TemporaryException[] {
    const nowIso = new Date().toISOString();
    const all = Array.from(this.exceptions.values());
    return activeOnly ? all.filter((e) => e.expiresAt > nowIso) : all;
  }

  public getAuditLogs(): RuleAuditEntry[] {
    return [...this.auditLog];
  }

  private resolveRuleAction(rule: WebRule, currentDate: Date): { allowed: boolean; reason: string; ruleId: string } {
    if (rule.action === 'allow') {
      return { allowed: true, reason: rule.parentReason || 'Ota-ona tomonidan ruxsat berilgan.', ruleId: rule.id };
    }

    if (rule.action === 'block') {
      return {
        allowed: false,
        reason: rule.childExplanation || rule.parentReason || 'Ushbu sayt qoidalar bo‘yicha cheklangan.',
        ruleId: rule.id,
      };
    }

    if (rule.action === 'schedule' && rule.schedule) {
      const day = currentDate.getDay();
      const hour = currentDate.getHours();
      const dayAllowed = rule.schedule.daysOfWeek.includes(day);
      const hourAllowed = hour >= rule.schedule.allowedStartHour && hour < rule.schedule.allowedEndHour;

      if (dayAllowed && hourAllowed) {
        return { allowed: true, reason: 'Reja bo‘yicha ruxsat etilgan vaqt oralig‘i.', ruleId: rule.id };
      } else {
        return {
          allowed: false,
          reason: `Faqat belgilangan vaqtda ruxsat etilgan (${rule.schedule.allowedStartHour}:00 - ${rule.schedule.allowedEndHour}:00).`,
          ruleId: rule.id,
        };
      }
    }

    return { allowed: true, reason: 'Ruxsat berilgan', ruleId: rule.id };
  }

  private addMandatorySecurityRule(targetValue: string, targetType: RuleTargetType, reason: string) {
    const id = `mand-${targetValue}`;
    const now = new Date().toISOString();
    this.rules.set(id, {
      id,
      targetType,
      targetValue,
      action: 'block',
      isMandatorySecurityRule: true,
      parentReason: reason,
      childExplanation: 'Ushbu kategoriya xavfsizlik maqsadida majburiy bloklangan.',
      createdBy: 'system:security-policy',
      createdAt: now,
      updatedAt: now,
    });
  }

  private recordAudit(
    action: RuleAuditEntry['action'],
    actor: string,
    target: string,
    details?: Record<string, unknown>
  ) {
    this.auditLog.push({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action,
      actor,
      target,
      timestamp: new Date().toISOString(),
      details,
    });
  }
}
