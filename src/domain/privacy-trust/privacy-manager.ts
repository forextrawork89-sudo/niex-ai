// FR-35: Privacy Management, Data Retention, Deletion, Consent Versioning & Age 18 Suspension

export interface ConsentRecord {
  consentId: string;
  childId: string;
  guardianId: string;
  version: string; // e.g. "v1.2"
  consentedAt: string;
  categoriesConsented: string[];
  isChildNotified: boolean;
}

export interface DataRetentionPolicy {
  rawTelemetryDays: number; // 7 days (FR-09, FR-21)
  aggregatedStatsDays: number; // 90 days
  quarantineRetainDays: number; // 30 days
  deleteImmediatelyOnAccountClose: boolean;
}

export interface DeletionAuditRecord {
  deletionId: string;
  childId: string;
  requestedBy: 'guardian' | 'child' | 'system_age_18';
  categoriesDeleted: string[];
  deletedAt: string;
  reason: string;
}

export class PrivacyManager {
  private activeConsents: Map<string, ConsentRecord> = new Map(); // childId -> record
  private deletionAudits: DeletionAuditRecord[] = [];
  private suspendedMonitoring: Set<string> = new Set(); // childId

  public readonly retentionPolicy: DataRetentionPolicy = {
    rawTelemetryDays: 7,
    aggregatedStatsDays: 90,
    quarantineRetainDays: 30,
    deleteImmediatelyOnAccountClose: true,
  };

  public recordConsent(consent: Omit<ConsentRecord, 'consentId' | 'consentedAt'>): ConsentRecord {
    const record: ConsentRecord = {
      ...consent,
      consentId: `cns-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      consentedAt: new Date().toISOString(),
    };
    this.activeConsents.set(consent.childId, record);
    return record;
  }

  public getConsent(childId: string): ConsentRecord | null {
    return this.activeConsents.get(childId) || null;
  }

  // FR-35 Invariant: Age 18 automatically suspends parental monitoring
  public checkAgeMilestone(childId: string, birthDateIso: string): {
    isAdult: boolean;
    monitoringSuspended: boolean;
    message: string;
  } {
    const birth = new Date(birthDateIso);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }

    if (age >= 18) {
      this.suspendedMonitoring.add(childId);
      this.recordDeletion({
        childId,
        requestedBy: 'system_age_18',
        categoriesDeleted: ['parental_dashboard_access', 'live_tracking'],
        reason: 'Foydalanuvchi 18 yoshga to‘ldi. Ota-ona nazorati qonuniy talab bo‘yicha to‘xtatildi (FR-35).',
      });
      return {
        isAdult: true,
        monitoringSuspended: true,
        message: 'Foydalanuvchi 18 yoshga to‘lganligi sababli ota-ona monitoringi to‘xtatildi. Foydalanuvchi endi mustaqil hisob egasi hisoblanadi.',
      };
    }

    return {
      isAdult: false,
      monitoringSuspended: this.suspendedMonitoring.has(childId),
      message: 'Voyaga yetmagan foydalanuvchi. Ota-ona roziligi va himoyasi faol.',
    };
  }

  public isMonitoringSuspended(childId: string): boolean {
    return this.suspendedMonitoring.has(childId);
  }

  public recordDeletion(params: {
    childId: string;
    requestedBy: 'guardian' | 'child' | 'system_age_18';
    categoriesDeleted: string[];
    reason: string;
  }): DeletionAuditRecord {
    const record: DeletionAuditRecord = {
      deletionId: `del-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      childId: params.childId,
      requestedBy: params.requestedBy,
      categoriesDeleted: params.categoriesDeleted,
      deletedAt: new Date().toISOString(),
      reason: params.reason,
    };
    this.deletionAudits.push(record);
    return record;
  }

  public getDeletionAudits(): DeletionAuditRecord[] {
    return [...this.deletionAudits];
  }
}
