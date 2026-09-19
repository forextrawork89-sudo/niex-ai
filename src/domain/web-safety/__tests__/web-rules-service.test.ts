import { describe, it, expect } from 'vitest';
import { WebRulesService } from '../web-rules-service';

describe('FR-08 & FR-40: Web Rules Service', () => {
  it('enforces block and allow domain rules with parent-written reason', () => {
    const service = new WebRulesService();
    const result = service.setRule({
      targetType: 'domain',
      targetValue: 'gaming-site.com',
      action: 'block',
      parentReason: 'Dars vaqtida o‘yin o‘ynash taqiqlanadi.',
      childExplanation: 'Hozir dars vaqti. O‘yin saytlari darsdan keyin ochiladi.',
      createdBy: 'parent-1',
    });

    expect(result.success).toBe(true);

    const access = service.evaluateAccess('https://gaming-site.com/play', 'games');
    expect(access.allowed).toBe(false);
    expect(access.reason).toContain('dars vaqti');
  });

  it('strictly validates parent reason length to 200 characters (FR-40)', () => {
    const service = new WebRulesService();
    const longReason = 'A'.repeat(205);
    const result = service.setRule({
      targetType: 'domain',
      targetValue: 'test.com',
      action: 'block',
      parentReason: longReason,
      createdBy: 'parent-1',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('200 belgidan');
  });

  it('correctly evaluates scheduled access based on day and hour', () => {
    const service = new WebRulesService();
    service.setRule({
      targetType: 'domain',
      targetValue: 'youtube.com',
      action: 'schedule',
      schedule: {
        daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
        allowedStartHour: 16,
        allowedEndHour: 18,
      },
      createdBy: 'parent-1',
    });

    // Tuesday at 17:00 -> Allowed
    const tuesday17 = new Date('2026-09-15T17:00:00'); // Tuesday
    const accessAllowed = service.evaluateAccess('youtube.com', 'video', tuesday17);
    expect(accessAllowed.allowed).toBe(true);

    // Tuesday at 20:00 -> Blocked
    const tuesday20 = new Date('2026-09-15T20:00:00');
    const accessBlocked = service.evaluateAccess('youtube.com', 'video', tuesday20);
    expect(accessBlocked.allowed).toBe(false);
    expect(accessBlocked.reason).toContain('16:00 - 18:00');
  });

  it('temporarily unblocks via temporary exception until exact expiration', () => {
    const service = new WebRulesService();
    service.setRule({
      targetType: 'domain',
      targetValue: 'math-helper.com',
      action: 'block',
      createdBy: 'parent-1',
    });

    // Grant 30 mins exception
    const exResult = service.grantTemporaryException({
      targetType: 'domain',
      targetValue: 'math-helper.com',
      durationMinutes: 30,
      grantedBy: 'parent-1',
      reason: 'Matematika uy vazifasi uchun',
      deviceId: 'device-kid-1',
    });

    expect(exResult.success).toBe(true);

    // Right now -> Allowed
    const nowAccess = service.evaluateAccess('math-helper.com', 'education');
    expect(nowAccess.allowed).toBe(true);
    expect(nowAccess.reason).toContain('Vaqtincha ruxsat berilgan');

    // After 35 minutes -> Expired & Blocked
    const futureDate = new Date(Date.now() + 35 * 60 * 1000);
    const futureAccess = service.evaluateAccess('math-helper.com', 'education', futureDate);
    expect(futureAccess.allowed).toBe(false);
  });

  it('prohibits bypassing mandatory phishing/malware rules without admin re-authentication', () => {
    const service = new WebRulesService();

    // Try to grant exception to phishing without token -> rejected
    const attempt = service.grantTemporaryException({
      targetType: 'category',
      targetValue: 'phishing',
      durationMinutes: 15,
      grantedBy: 'attacker',
      reason: 'Bypass test',
      deviceId: 'device-1',
    });

    expect(attempt.success).toBe(false);
    expect(attempt.error).toContain('qayta autentifikatsiyasi');

    // Audit logs should record bypass attempt
    const audit = service.getAuditLogs();
    expect(audit.some((a) => a.action === 'bypass_attempt')).toBe(true);
  });
});
