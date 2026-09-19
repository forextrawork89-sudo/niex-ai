// FR-20: Expected Arrival Schedule & Separation of Missing GPS from Violations

export interface ArrivalExpectation {
  id: string;
  childId: string;
  zoneId: string;
  zoneName: string;
  expectedByHour: number; // e.g. 8 (08:00)
  expectedByMinute: number; // e.g. 30 (08:30)
  daysOfWeek: number[]; // 1-5 (Mon-Fri)
}

export type ArrivalStatus = 'on_schedule' | 'arrived' | 'arrival_not_confirmed' | 'left_area';

export interface ArrivalEvaluationResult {
  expectationId: string;
  childId: string;
  zoneName: string;
  status: ArrivalStatus;
  isViolation: boolean; // FR-20: GPS/internet absence must NEVER be treated as a rule violation!
  explanation: string;
}

export class ArrivalScheduleService {
  private expectations: Map<string, ArrivalExpectation> = new Map();

  public addExpectation(expectation: Omit<ArrivalExpectation, 'id'>): ArrivalExpectation {
    const id = `arr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const record: ArrivalExpectation = { ...expectation, id };
    this.expectations.set(id, record);
    return record;
  }

  public evaluateArrival(params: {
    childId: string;
    isInsideZone: boolean;
    hasGpsFix: boolean;
    isOnline: boolean;
    currentDate?: Date;
  }): ArrivalEvaluationResult[] {
    const now = params.currentDate || new Date();
    const day = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const results: ArrivalEvaluationResult[] = [];

    for (const exp of this.expectations.values()) {
      if (exp.childId !== params.childId) continue;
      if (!exp.daysOfWeek.includes(day)) continue;

      const expectedMinutes = exp.expectedByHour * 60 + exp.expectedByMinute;
      const isPastExpectedTime = currentMinutes > expectedMinutes;

      // 1. Child is verified inside zone
      if (params.isInsideZone) {
        results.push({
          expectationId: exp.id,
          childId: exp.childId,
          zoneName: exp.zoneName,
          status: 'arrived',
          isViolation: false,
          explanation: `Bola ${exp.zoneName} hududiga yetib kelgan.`,
        });
        continue;
      }

      // 2. Child is not in zone yet, but expected time has not arrived
      if (!isPastExpectedTime) {
        results.push({
          expectationId: exp.id,
          childId: exp.childId,
          zoneName: exp.zoneName,
          status: 'on_schedule',
          isViolation: false,
          explanation: `Belgilangan vaqt hali yetib kelmadi (${exp.expectedByHour}:${String(exp.expectedByMinute).padStart(2, '0')}).`,
        });
        continue;
      }

      // 3. Past expected time without GPS/internet
      if (!params.hasGpsFix || !params.isOnline) {
        // FR-20 Invariant: GPS/internet absence must NOT be treated as proof of rule violation!
        results.push({
          expectationId: exp.id,
          childId: exp.childId,
          zoneName: exp.zoneName,
          status: 'arrival_not_confirmed',
          isViolation: false, // NOT a violation!
          explanation: 'Qurilmadan GPS signali yoki internet aloqasi yo‘q. Yetib kelish tasdiqlanmadi (bu qoidabuzarlik hisoblanmaydi).',
        });
        continue;
      }

      // 4. Past expected time WITH valid GPS fix outside zone
      results.push({
        expectationId: exp.id,
        childId: exp.childId,
        zoneName: exp.zoneName,
        status: 'left_area',
        isViolation: true,
        explanation: `Belgilangan vaqtda (${exp.expectedByHour}:${String(exp.expectedByMinute).padStart(2, '0')}) bola ${exp.zoneName} hududida emasligi aniqlandi.`,
      });
    }

    return results;
  }
}
