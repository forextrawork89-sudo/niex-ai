import { describe, it, expect } from 'vitest';
import { LinkCheckerService, isPrivateOrReservedIp } from '../link-checker-service';

describe('LinkCheckerService (FR-43)', () => {
  it('identifies private and reserved IP addresses accurately', () => {
    expect(isPrivateOrReservedIp('localhost')).toBe(true);
    expect(isPrivateOrReservedIp('127.0.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('10.0.0.5')).toBe(true);
    expect(isPrivateOrReservedIp('192.168.1.1')).toBe(true);
    expect(isPrivateOrReservedIp('169.254.169.254')).toBe(true);
    expect(isPrivateOrReservedIp('172.20.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('::1')).toBe(true);
    expect(isPrivateOrReservedIp('0.0.0.0')).toBe(true);
    expect(isPrivateOrReservedIp('172.15.0.1')).toBe(false); // outside 172.16-31
    expect(isPrivateOrReservedIp('8.8.8.8')).toBe(false);
    expect(isPrivateOrReservedIp('google.com')).toBe(false);
  });

  it('blocks SSRF attempts to internal networks or non-whitelisted ports', () => {
    const service = new LinkCheckerService();

    const localRes = service.checkLink('http://127.0.0.1/admin');
    expect(localRes.verdict).toBe('blocked');
    expect(localRes.ssrfCheckPassed).toBe(false);
    expect(localRes.childExplanation).toContain('ichki tarmoq');

    const ipv6Res = service.checkLink('http://[::1]/secret');
    expect(ipv6Res.verdict).toBe('blocked');
    expect(ipv6Res.ssrfCheckPassed).toBe(false);

    const portRes = service.checkLink('https://example.com:8080/test');
    expect(portRes.verdict).toBe('blocked');
    expect(portRes.ssrfCheckPassed).toBe(false);
    expect(portRes.childExplanation).toContain('ruxsat berilmagan maxsus port');
  });

  it('handles malformed URLs gracefully returning unknown verdict with technical details', () => {
    const service = new LinkCheckerService();
    const res = service.checkLink('http://[invalid-ipv6');
    expect(res.verdict).toBe('unknown');
    expect(res.ssrfCheckPassed).toBe(false);
    expect(res.technicalDetails).toContain('URL parse error');
  });

  it('blocks phishing and scam links with child-friendly explanation', () => {
    const service = new LinkCheckerService();
    const res = service.checkLink('https://free-robux-unlimited.click');

    expect(res.verdict).toBe('blocked');
    expect(res.childExplanation).toContain('soxta sahifa yoki firibgarlik');
  });

  it('marks whitelisted safe sites as safe', () => {
    const service = new LinkCheckerService();
    const res = service.checkLink('https://edu.uz');

    expect(res.verdict).toBe('safe');
    expect(res.childExplanation).toContain('xavfsiz ko‘rinmoqda');
  });

  it('never marks unknown domains as safe (FR-43 invariant)', () => {
    const service = new LinkCheckerService();
    const res = service.checkLink('https://some-random-new-site-2026.io');

    expect(res.verdict).toBe('unknown');
    expect(res.verdict).not.toBe('safe');
    expect(res.childExplanation).toContain('kam uchraydigan sayt');
  });
});
