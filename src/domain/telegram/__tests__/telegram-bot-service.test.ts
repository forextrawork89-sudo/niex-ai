import { describe, it, expect } from 'vitest';
import { TelegramBotService } from '../telegram-bot-service';

describe('TelegramBotService (Operational Fast Alerting & Inline Approvals)', () => {
  it('registers guardian and responds to /start and /status commands', () => {
    const service = new TelegramBotService();
    service.registerGuardian('chat-100', 'guard-1', 'Alisher');

    const startResp = service.handleCommand('chat-100', '/start');
    expect(startResp.text).toContain('Alisher');
    expect(startResp.text).toContain('/status');

    const statusResp = service.handleCommand('chat-100', '/status', {
      childName: 'Jasur',
      batteryPercent: 88,
      screenTimeSpentMinutes: 95,
      screenTimeLimitMinutes: 120,
      currentZone: 'Maktab hududi',
    });

    expect(statusResp.text).toContain('Jasur');
    expect(statusResp.text).toContain('88%');
    expect(statusResp.text).toContain('95 / 120');
    expect(statusResp.text).toContain('Maktab hududi');
  });

  it('provides inline keyboard for quiet hours configuration', () => {
    const service = new TelegramBotService();
    const resp = service.handleCommand('chat-100', '/quiet');

    expect(resp.inlineKeyboard).toBeDefined();
    expect(resp.inlineKeyboard?.length).toBe(2);
    expect(resp.inlineKeyboard?.[0][0].callbackData).toBe('quiet:60');
  });

  it('enforces security invariant: bot cannot create rules or add guardians', () => {
    const service = new TelegramBotService();
    const ruleAttempt = service.handleCommand('chat-100', '/add_rule block-youtube');
    expect(ruleAttempt.text).toContain('Xavfsizlik talabi');
    expect(ruleAttempt.text).toContain('faqat himoyalangan veb-kabinet orqali');

    const guardianAttempt = service.handleCommand('chat-100', '/add_guardian +998901234567');
    expect(guardianAttempt.text).toContain('Xavfsizlik talabi');
  });

  it('processes inline approval callbacks (time extension, SOS seen, web permission)', () => {
    const service = new TelegramBotService();
    service.registerGuardian('chat-100', 'guard-1', 'Alisher');

    // Time extension
    const extRes = service.handleCallbackQuery('chat-100', 'extend_time:30:child-1', 'guard-1');
    expect(extRes.action).toBe('approve_time_extension');
    expect(extRes.success).toBe(true);
    expect(extRes.childNotification).toContain('30 daqiqa');

    // SOS acknowledgement
    const sosRes = service.handleCallbackQuery('chat-100', 'sos_seen:sos-999', 'guard-1');
    expect(sosRes.action).toBe('acknowledge_sos');
    expect(sosRes.success).toBe(true);
    expect(sosRes.childNotification).toContain('ko‘rdi');

    // Web permission
    const webRes = service.handleCallbackQuery('chat-100', 'allow_web:1h:wikipedia.org', 'guard-1');
    expect(webRes.action).toBe('allow_web_page');
    expect(webRes.success).toBe(true);
    expect(webRes.childNotification).toContain('wikipedia.org');
  });

  it('formats SOS and permission request payloads with action buttons', () => {
    const service = new TelegramBotService();
    const sosPayload = service.formatSosAlertTelegram({
      sosId: 'sos-123',
      childName: 'Jasur',
      zoneOrCoords: 'Maktab yaqini',
      timestamp: '2026-09-18 16:30',
    });

    expect(sosPayload.text).toContain('FAVQULODDA SOS SIGNALI');
    expect(sosPayload.text).toContain('112');
    expect(sosPayload.inlineKeyboard?.[0][0].callbackData).toBe('sos_seen:sos-123');

    const permPayload = service.formatPermissionRequestTelegram({
      childName: 'Jasur',
      domain: 'coursera.org',
      reason: 'Dars uchun',
    });

    expect(permPayload.inlineKeyboard?.[0][0].text).toContain('1 soatga');
    expect(permPayload.inlineKeyboard?.[1][0].text).toContain('Doimiy');
  });
});
