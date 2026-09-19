// FR-13 & FR-40: Time Limits, Schedules (Study/Sleep/Weekend), Age Templates, Pre-limit Warnings

export type AgeGroup = 'age_group_a' | 'age_group_b' | 'age_group_c'; // A: 6-9, B: 10-13, C: 14-17

export interface TimeLimitRule {
  id: string;
  targetType: 'app' | 'category' | 'device';
  targetIdentifier: string; // e.g. "games", "youtube", or "device_total"
  dailyMinutesLimit: number;
  studySchedule?: {
    daysOfWeek: number[]; // 1-5 (Mon-Fri)
    blockedHours: number[]; // e.g. [8, 9, 10, 11, 12, 13] (08:00 - 14:00)
  };
  sleepSchedule?: {
    startHour: number; // e.g. 22 (22:00)
    endHour: number; // e.g. 7 (07:00)
  };
  weekendBonusMinutes?: number;
  isEmergencyProtected: boolean;
  parentReason?: string; // FR-40: Max 200 chars
}

export interface AgeGroupTemplate {
  ageGroup: AgeGroup;
  defaultDailyLimitMinutes: number;
  defaultStudyBlockedHours: number[];
  defaultSleepSchedule: { startHour: number; endHour: number };
  weekendBonusMinutes: number;
}

export const AGE_GROUP_TEMPLATES: Record<AgeGroup, AgeGroupTemplate> = {
  age_group_a: {
    ageGroup: 'age_group_a',
    defaultDailyLimitMinutes: 60, // 1 hour for young kids
    defaultStudyBlockedHours: [8, 9, 10, 11, 12, 13],
    defaultSleepSchedule: { startHour: 21, endHour: 7 }, // 21:00 - 07:00
    weekendBonusMinutes: 30,
  },
  age_group_b: {
    ageGroup: 'age_group_b',
    defaultDailyLimitMinutes: 120, // 2 hours
    defaultStudyBlockedHours: [8, 9, 10, 11, 12, 13, 14],
    defaultSleepSchedule: { startHour: 22, endHour: 7 }, // 22:00 - 07:00
    weekendBonusMinutes: 60,
  },
  age_group_c: {
    ageGroup: 'age_group_c',
    defaultDailyLimitMinutes: 180, // 3 hours
    defaultStudyBlockedHours: [8, 9, 10, 11, 12, 13, 14],
    defaultSleepSchedule: { startHour: 23, endHour: 6 }, // 23:00 - 06:00
    weekendBonusMinutes: 60,
  },
};

export class TimeLimitsService {
  private limits: Map<string, TimeLimitRule> = new Map();
  private platformSupportsEnforcement: boolean;

  constructor(platformSupportsEnforcement = true) {
    this.platformSupportsEnforcement = platformSupportsEnforcement;
  }

  public setLimit(rule: Omit<TimeLimitRule, 'id'>): { success: boolean; rule?: TimeLimitRule; error?: string } {
    if (!this.platformSupportsEnforcement) {
      return {
        success: false,
        error: 'Ushbu platformada ilovalar vaqtini cheklash qo‘llab-quvvatlanmaydi (UNSUPPORTED).',
      };
    }

    if (rule.targetIdentifier === 'emergency' || rule.targetIdentifier.includes('dialer')) {
      return {
        success: false,
        error: 'Favqulodda yordam ilovalari uchun vaqt chegarasi o‘rnatib bo‘lmaydi (FR-13).',
      };
    }

    if (rule.parentReason && rule.parentReason.length > 200) {
      return { success: false, error: 'Qoida sababi 200 belgidan oshmasligi kerak (FR-40).' };
    }

    const id = `lim-${rule.targetType}-${rule.targetIdentifier}`;
    const item: TimeLimitRule = { ...rule, id, isEmergencyProtected: false };
    this.limits.set(id, item);

    return { success: true, rule: item };
  }

  public applyAgeTemplate(
    ageGroup: AgeGroup,
    targetType: 'device' | 'category',
    targetIdentifier = 'device_total'
  ): TimeLimitRule {
    const template = AGE_GROUP_TEMPLATES[ageGroup];
    const rule: TimeLimitRule = {
      id: `lim-${targetType}-${targetIdentifier}`,
      targetType,
      targetIdentifier,
      dailyMinutesLimit: template.defaultDailyLimitMinutes,
      studySchedule: {
        daysOfWeek: [1, 2, 3, 4, 5],
        blockedHours: template.defaultStudyBlockedHours,
      },
      sleepSchedule: template.defaultSleepSchedule,
      weekendBonusMinutes: template.weekendBonusMinutes,
      isEmergencyProtected: false,
      parentReason: `${ageGroup.toUpperCase()} yosh guruhi standarti bo‘yicha avtomatik o‘rnatildi.`,
    };

    this.limits.set(rule.id, rule);
    return rule;
  }

  public checkAppAllowed(params: {
    appIdentifier: string;
    category: string;
    usedMinutesToday: number;
    currentDate?: Date;
  }): { allowed: boolean; reason: string; preLimitWarning?: boolean } {
    if (!this.platformSupportsEnforcement) {
      return { allowed: true, reason: 'Platformada cheklov mavjud emas' };
    }

    const now = params.currentDate || new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const isWeekend = day === 0 || day === 6;

    // Check specific app limit, then category, then device_total
    const appRule = this.limits.get(`lim-app-${params.appIdentifier}`);
    const catRule = this.limits.get(`lim-category-${params.category}`);
    const devRule = this.limits.get('lim-device-device_total');

    const activeRule = appRule || catRule || devRule;
    if (!activeRule) {
      return { allowed: true, reason: 'Cheklov o‘rnatilmagan' };
    }

    // 1. Sleep Schedule Check
    if (activeRule.sleepSchedule) {
      const { startHour, endHour } = activeRule.sleepSchedule;
      const isSleep = startHour > endHour ? hour >= startHour || hour < endHour : hour >= startHour && hour < endHour;
      if (isSleep) {
        return { allowed: false, reason: `Uyqu vaqti (${startHour}:00 - ${endHour}:00). Telefon dam olishi kerak.` };
      }
    }

    // 2. Study Schedule Check
    if (activeRule.studySchedule && !isWeekend) {
      if (activeRule.studySchedule.daysOfWeek.includes(day)) {
        if (activeRule.studySchedule.blockedHours.includes(hour)) {
          return { allowed: false, reason: 'Dars vaqti. O‘yin va ijtimoiy tarmoqlar to‘xtatilgan.' };
        }
      }
    }

    // 3. Daily Limit Check with Weekend Bonus
    const effectiveLimit = activeRule.dailyMinutesLimit + (isWeekend ? activeRule.weekendBonusMinutes || 0 : 0);
    const remaining = effectiveLimit - params.usedMinutesToday;

    if (remaining <= 0) {
      return { allowed: false, reason: 'Bugungi kunlik vaqt chegarasi to‘ldi.' };
    }

    // FR-13: 5 minutes pre-limit warning
    const preLimitWarning = remaining <= 5;
    return {
      allowed: true,
      reason: preLimitWarning ? `Ogohlantirish: Limit tugashiga ${remaining} daqiqa qoldi!` : 'Ruxsat berilgan',
      preLimitWarning,
    };
  }

  public getLimits(): TimeLimitRule[] {
    return Array.from(this.limits.values());
  }
}
