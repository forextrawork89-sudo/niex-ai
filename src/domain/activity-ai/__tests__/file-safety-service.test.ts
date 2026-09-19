import { describe, it, expect } from 'vitest';
import { inspectFileSafety } from '../file-safety-service';

describe('FR-31: File Safety Inspection', () => {
  it('detects executable masquerading as a harmless PDF via magic bytes', () => {
    const verdict = inspectFileSafety({
      filename: 'homework-tasks.pdf',
      sizeBytes: 1048576,
      mimeType: 'application/pdf',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      magicBytesHex: '4d5a9000', // MZ executable header
    });

    expect(verdict.status).toBe('MALICIOUS');
    expect(verdict.detectedThreat).toBe('trojan_masquerade');
    expect(verdict.isExecutable).toBe(true);
  });

  it('warns on direct executable downloads', () => {
    const verdict = inspectFileSafety({
      filename: 'game-installer.exe',
      sizeBytes: 52428800,
      mimeType: 'application/x-msdownload',
      sha256Hash: 'a1b2c3d4',
    });

    expect(verdict.status).toBe('WARN');
    expect(verdict.isExecutable).toBe(true);
  });

  it('allows safe legitimate documents', () => {
    const verdict = inspectFileSafety({
      filename: 'insho_matni.docx',
      sizeBytes: 45000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      sha256Hash: 'ffff0000',
    });

    expect(verdict.status).toBe('SAFE');
    expect(verdict.isExecutable).toBe(false);
  });

  it('does NOT mark unknown file formats as automatically malicious', () => {
    const verdict = inspectFileSafety({
      filename: 'custom_dataset.xyzformat',
      sizeBytes: 2500,
      mimeType: 'application/octet-stream',
      sha256Hash: '12345678',
    });

    expect(verdict.status).toBe('UNKNOWN');
    expect(verdict.status).not.toBe('MALICIOUS');
    expect(verdict.reason).toContain('avtomatik zararli deb hisoblanmaydi');
  });
});
