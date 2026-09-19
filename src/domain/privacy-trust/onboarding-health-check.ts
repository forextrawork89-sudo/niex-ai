// FR-39: 5-Step Onboarding Health Check & Actionable Remediation Guide

export type HealthCheckStepId =
  | 'step_1_permissions'
  | 'step_2_test_block'
  | 'step_3_test_location'
  | 'step_4_test_notification'
  | 'step_5_final_readiness';

export type StepStatus = 'pending' | 'passed' | 'failed';

export interface HealthCheckStepResult {
  stepId: HealthCheckStepId;
  stepNumber: number;
  title: string;
  status: StepStatus;
  detail: string;
  actionableGuidance?: string; // Clear instruction for parents on how to resolve
}

export interface OnboardingHealthCheckReport {
  childId: string;
  deviceId: string;
  completedAt: string;
  isAllPassed: boolean;
  healthScorePercent: number;
  steps: HealthCheckStepResult[];
}

export class OnboardingHealthCheckService {
  public run5StepHealthCheck(params: {
    childId: string;
    deviceId: string;
    permissions: {
      accessibility: boolean;
      usageStats: boolean;
      location: boolean;
      notifications: boolean;
    };
    testBlockExecuted: boolean;
    testLocationAccuracyMeters?: number;
    testNotificationAcknowledged: boolean;
  }): OnboardingHealthCheckReport {
    const steps: HealthCheckStepResult[] = [];

    // Step 1: Permissions Check
    const missingPerms: string[] = [];
    if (!params.permissions.accessibility) missingPerms.push('Maxsus imkoniyatlar (Accessibility)');
    if (!params.permissions.usageStats) missingPerms.push('Ilova faolligi statistikasi (Usage Stats)');
    if (!params.permissions.location) missingPerms.push('Joylashuv (GPS)');
    if (!params.permissions.notifications) missingPerms.push('Xabarnomalar yuborish');

    if (missingPerms.length === 0) {
      steps.push({
        stepId: 'step_1_permissions',
        stepNumber: 1,
        title: 'Tizim ruxsatlari tekshiruvi',
        status: 'passed',
        detail: 'Barcha asosiy xavfsizlik va vaqt nazorati ruxsatlari berilgan.',
      });
    } else {
      steps.push({
        stepId: 'step_1_permissions',
        stepNumber: 1,
        title: 'Tizim ruxsatlari tekshiruvi',
        status: 'failed',
        detail: `Quyidagi ruxsatlar yetishmayapti: ${missingPerms.join(', ')}`,
        actionableGuidance:
          'Telefon "Sozlamalar" -> "Ilovalar" -> "NIEX AI" bo‘limiga kiring va ko‘rsatilgan ruxsatlarni faollashtiring.',
      });
    }

    // Step 2: Test Block Execution (e.g. test-blocked.niex.uz)
    if (params.testBlockExecuted) {
      steps.push({
        stepId: 'step_2_test_block',
        stepNumber: 2,
        title: 'Filtrlash mexanizmi testi',
        status: 'passed',
        detail: 'Sinov bloklash ekrani va mahalliy filtr to‘g‘ri ishladi.',
      });
    } else {
      steps.push({
        stepId: 'step_2_test_block',
        stepNumber: 2,
        title: 'Filtrlash mexanizmi testi',
        status: 'failed',
        detail: 'Sinov saytini bloklash muvaffaqiyatsiz tugadi.',
        actionableGuidance:
          'VPN profili yoki mahalliy filtr xizmati o‘chirilgan bo‘lishi mumkin. Ilovani qayta ishga tushiring va VPN ulanishiga ruxsat bering.',
      });
    }

    // Step 3: Test Location (GPS)
    const accuracy = params.testLocationAccuracyMeters;
    if (typeof accuracy === 'number' && accuracy <= 100) {
      steps.push({
        stepId: 'step_3_test_location',
        stepNumber: 3,
        title: 'Geolokatsiya aniqligi testi',
        status: 'passed',
        detail: `GPS signali qabul qilindi (aniqlik: ${Math.round(accuracy)} metr).`,
      });
    } else {
      steps.push({
        stepId: 'step_3_test_location',
        stepNumber: 3,
        title: 'Geolokatsiya aniqligi testi',
        status: 'failed',
        detail:
          typeof accuracy === 'number'
            ? `GPS signali noaniq (${Math.round(accuracy)} metr > 100m ruxsat etilgan me’yor).`
            : 'GPS koordinatalari qabul qilinmadi.',
        actionableGuidance:
          'Telefon sozlamalarida "Yuqori aniqlikdagi geolokatsiya" (Google Location Accuracy) yoqilganligiga va bino ichida signal to‘silmaganligiga ishonch hosil qiling.',
      });
    }

    // Step 4: Test Notification
    if (params.testNotificationAcknowledged) {
      steps.push({
        stepId: 'step_4_test_notification',
        stepNumber: 4,
        title: 'Xabarnomalar yetkazish testi',
        status: 'passed',
        detail: 'Sinov xabarnomasi muvaffaqiyatli qabul qilindi.',
      });
    } else {
      steps.push({
        stepId: 'step_4_test_notification',
        stepNumber: 4,
        title: 'Xabarnomalar yetkazish testi',
        status: 'failed',
        detail: 'Sinov xabarnomasi yetib bormadi.',
        actionableGuidance:
          'Telegram boti yoki push-bildirishnomalar uchun internet ulanishini va ovozsiz rejimni tekshiring.',
      });
    }

    // Step 5: Final Readiness Evaluation
    const passedCount = steps.filter((s) => s.status === 'passed').length;
    const isAllPassed = passedCount === 4;
    const healthScorePercent = Math.round((passedCount / 4) * 100);

    steps.push({
      stepId: 'step_5_final_readiness',
      stepNumber: 5,
      title: 'Yakuniy tizim tayyorgarligi',
      status: isAllPassed ? 'passed' : 'failed',
      detail: isAllPassed
        ? 'Tizim bolaning xavfsizligini ta’minlashga to‘liq tayyor (100%).'
        : `Tizim tayyorgarligi qisman (${healthScorePercent}%). Yuqoridagi xatoliklarni bartaraf eting.`,
      actionableGuidance: isAllPassed
        ? undefined
        : 'Qizil belgi bilan ko‘rsatilgan bosqichlar bo‘yicha ko‘rsatmalarni bajaring va tekshiruvni qayta o‘tkazing.',
    });

    return {
      childId: params.childId,
      deviceId: params.deviceId,
      completedAt: new Date().toISOString(),
      isAllPassed,
      healthScorePercent,
      steps,
    };
  }
}
