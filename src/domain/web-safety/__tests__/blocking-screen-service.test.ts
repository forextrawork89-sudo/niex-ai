import { describe, it, expect } from 'vitest';
import { BlockingScreenService } from '../blocking-screen-service';

describe('FR-10: Child Blocking Screen & Permission Request Service', () => {
  it('generates friendly child blocking screen state with reasons and remaining time', () => {
    const service = new BlockingScreenService();
    const screen = service.getBlockingScreen({
      domain: 'roblox.com',
      category: 'gaming',
      explanation_child: 'Hozir dars vaqti bo‘lgani uchun o‘yinlar to‘xtatib turilgan.',
      parent_rule_reason: 'Darslarni tayyorlash',
      remainingMinutes: 45,
      childId: 'child-1',
    });

    expect(screen.domain).toBe('roblox.com');
    expect(screen.explanation_child).toContain('dars vaqti');
    expect(screen.remaining_restriction).toContain('45 daqiqa');
    expect(screen.isPermissionRequestAllowed).toBe(true);
  });

  it('handles child request and parent resolution with backend accepted vs device applied status separation', () => {
    const service = new BlockingScreenService();

    // 1. Child requests permission
    const req = service.requestPermission({
      childId: 'child-1',
      domain: 'wikipedia.org',
      category: 'education',
      userMessage: 'Menga referat yozish uchun kerak edi.',
      scope: 'domain',
    });

    expect(req.id).toBeDefined();
    expect(req.backend_status).toBe('pending');
    expect(req.device_status).toBe('pending');

    // 2. Parent approves via Telegram inline button for 1 hour
    const resolved = service.resolveRequest(req.id, 'accepted', {
      decidedBy: 'telegram_inline',
      guardianId: 'guardian-dad',
      duration: '1_hour',
    });

    expect(resolved.success).toBe(true);
    expect(resolved.request?.backend_status).toBe('accepted');
    // FR-10 Requirement: device_status must remain 'pending' until device applies it!
    expect(resolved.request?.device_status).toBe('pending');
    expect(resolved.request?.resolution?.decidedBy).toBe('telegram_inline');
    expect(resolved.request?.resolution?.grantedUntil).toBeDefined();

    // 3. Child device syncs and applies
    const applied = service.markDeviceApplied(req.id);
    expect(applied.success).toBe(true);

    const childReqs = service.getChildRequests('child-1');
    expect(childReqs[0].device_status).toBe('applied');
  });

  it('supports today and permanent approval durations', () => {
    const service = new BlockingScreenService();
    const req = service.requestPermission({
      childId: 'child-1',
      domain: 'math.com',
      category: 'education',
    });

    const resolved = service.resolveRequest(req.id, 'accepted', {
      decidedBy: 'parent_dashboard',
      guardianId: 'guardian-mom',
      duration: 'today',
    });

    expect(resolved.request?.backend_status).toBe('accepted');
    expect(resolved.request?.resolution?.duration).toBe('today');
    expect(resolved.request?.resolution?.grantedUntil).toBeDefined();
    expect(new Date(resolved.request!.resolution!.grantedUntil!).getHours()).toBe(23);
  });
});
