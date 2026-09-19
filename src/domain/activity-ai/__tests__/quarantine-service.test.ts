import { describe, it, expect } from 'vitest';
import { QuarantineManager } from '../quarantine-service';

describe('FR-32: Quarantine Management', () => {
  it('quarantines suspicious file and records audit trail', () => {
    const manager = new QuarantineManager(true);
    const result = manager.quarantineFile('danger.exe', '/downloads/danger.exe', 'sha256-sample', 'Executable risk');

    expect(result.success).toBe(true);
    expect(result.item?.status).toBe('quarantined');
    expect(manager.getQuarantinedItems()).toHaveLength(1);

    const logs = manager.getAuditLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('quarantine');
  });

  it('restores file only with guardian authorization', () => {
    const manager = new QuarantineManager(true);
    const { item } = manager.quarantineFile('tool.bat', '/downloads/tool.bat', 'hash-1', 'Script');
    const itemId = item!.id;

    // Fail without auth
    const failedRestore = manager.restoreFile(itemId, '', '');
    expect(failedRestore.success).toBe(false);
    expect(failedRestore.error).toContain('autentifikatsiya');

    // Succeed with guardian auth
    const successRestore = manager.restoreFile(itemId, 'valid-token', 'guardian-parent-1');
    expect(successRestore.success).toBe(true);

    const restoredItem = manager.getQuarantinedItems().find((i) => i.id === itemId);
    expect(restoredItem?.status).toBe('restored');
    expect(restoredItem?.restoredBy).toBe('guardian-parent-1');

    const logs = manager.getAuditLogs();
    expect(logs.some((l) => l.action === 'restore')).toBe(true);
  });

  it('returns graceful unsupported state when platform does not support quarantine', () => {
    const manager = new QuarantineManager(false);
    const result = manager.quarantineFile('test.exe', '/test.exe', 'h1', 'reason');
    expect(result.success).toBe(false);
    expect(result.error).toContain('UNSUPPORTED');
  });
});
