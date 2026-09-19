// FR-24: Technical State Monitoring & Heartbeats (Objective diagnostics without blaming child)

export type TechnicalIssueType =
  | 'location_permission_disabled'
  | 'gps_hardware_off'
  | 'internet_offline'
  | 'stale_heartbeat'
  | 'app_disabled_or_uninstalled'
  | 'all_healthy';

export interface DeviceDiagnostics {
  deviceId: string;
  childId: string;
  lastHeartbeatAt: string;
  hasLocationPermission: boolean;
  isGpsHardwareEnabled: boolean;
  isInternetConnected: boolean;
  batteryLevel: number;
}

export interface DiagnosticEvaluation {
  status: 'healthy' | 'warning' | 'critical';
  primaryIssue: TechnicalIssueType;
  technicalStateLabel: string;
  guardianGuidance: string; // Actionable instructions for parents
  intentNeutralNote: string; // Invariant: Never accuse child without evidence
}

export class TechnicalMonitorService {
  public evaluateDeviceHealth(diagnostics: DeviceDiagnostics, currentDate = new Date()): DiagnosticEvaluation {
    const lastHeartbeatMs = new Date(diagnostics.lastHeartbeatAt).getTime();
    const nowMs = currentDate.getTime();
    const minutesSinceHeartbeat = Math.floor((nowMs - lastHeartbeatMs) / (60 * 1000));

    // Invariant: neutral language, never claim child intentionally did it
    const intentNeutralNote =
      'Eslatma: Texnik uzilishlar batareya tugashi, tarmoq nosozligi yoki tizim cheklovlari tufayli yuzaga kelishi mumkin. Bolani asossiz ayblamang.';

    // 1. Long heartbeat gap (> 60 mins)
    if (minutesSinceHeartbeat > 60) {
      return {
        status: 'critical',
        primaryIssue: 'stale_heartbeat',
        technicalStateLabel: `Qurilmadan ${minutesSinceHeartbeat} daqiqadan beri signal kelmayapti.`,
        guardianGuidance: 'Qurilma quvvati tugagan yoki internetga ulanmagan bo‘lishi mumkin. Bolaga qo‘ng‘iroq qiling yoki telefon quvvatini tekshiring.',
        intentNeutralNote,
      };
    }

    // 2. Internet offline
    if (!diagnostics.isInternetConnected) {
      return {
        status: 'warning',
        primaryIssue: 'internet_offline',
        technicalStateLabel: 'Internet aloqasi mavjud emas (Oflayn).',
        guardianGuidance: 'Wi-Fi yoki mobil internet yoqilganligini tekshirish lozim.',
        intentNeutralNote,
      };
    }

    // 3. Location Permission Disabled
    if (!diagnostics.hasLocationPermission) {
      return {
        status: 'critical',
        primaryIssue: 'location_permission_disabled',
        technicalStateLabel: 'Geolokatsiya ruxsati o‘chirilgan.',
        guardianGuidance: 'Telefon sozlamalariga kirib, NIEX ilovasi uchun "Doimiy joylashuv" ruxsatini qayta yoqing.',
        intentNeutralNote,
      };
    }

    // 4. GPS Hardware Off
    if (!diagnostics.isGpsHardwareEnabled) {
      return {
        status: 'warning',
        primaryIssue: 'gps_hardware_off',
        technicalStateLabel: 'Telefonning GPS (Joylashuv) moduli o‘chirilgan.',
        guardianGuidance: 'Telefonning yuqori menyusidan GPS (Joylashuv) tugmasini yoqing.',
        intentNeutralNote,
      };
    }

    return {
      status: 'healthy',
      primaryIssue: 'all_healthy',
      technicalStateLabel: 'Barcha tizimlar normal ishlamoqda.',
      guardianGuidance: 'Qo‘shimcha harakat talab etilmaydi.',
      intentNeutralNote,
    };
  }
}
