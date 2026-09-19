// FR-43: Child Suspicious Link Checker with SSRF Protection & Child-Friendly Risk Explanations

export type LinkCheckVerdict = 'safe' | 'suspicious' | 'blocked' | 'unknown';

export interface LinkCheckResult {
  submittedUrl: string;
  verdict: LinkCheckVerdict;
  childExplanation: string; // Child-friendly wording
  technicalDetails: string;
  ssrfCheckPassed: boolean;
  isVisibleToParent: boolean;
  checkedAt: string;
}

const ALLOWED_PORTS = new Set(['80', '443', '']);

export function isPrivateOrReservedIp(hostname: string): boolean {
  // Strip IPv6 brackets if present (e.g., [::1] -> ::1)
  const clean = hostname.replace(/^\[|\]$/g, '').toLowerCase();

  // IPv4 & IPv6 local/private ranges:
  // 127.0.0.0/8
  // 10.0.0.0/8
  // 172.16.0.0/12 (172.16 - 172.31)
  // 192.168.0.0/16
  // 169.254.0.0/16 (AWS/cloud metadata)
  // localhost, ::1, 0.0.0.0, fe80:: (link-local), fc00::/fd00:: (ULA)
  if (
    clean === 'localhost' ||
    clean === '::1' ||
    clean === '0.0.0.0' ||
    clean.startsWith('fe80:') ||
    clean.startsWith('fc') ||
    clean.startsWith('fd') ||
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(clean) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(clean) ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(clean) ||
    /^169\.254\.\d{1,3}\.\d{1,3}$/.test(clean)
  ) {
    return true;
  }

  // 172.16.0.0 - 172.31.255.255
  const match172 = hostname.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  if (match172) {
    const secondOctet = parseInt(match172[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }

  return false;
}

export class LinkCheckerService {
  private checkHistory: LinkCheckResult[] = [];

  public checkLink(urlStr: string): LinkCheckResult {
    let parsed: URL;
    try {
      const withProto = /^https?:\/\//i.test(urlStr) ? urlStr : `https://${urlStr}`;
      parsed = new URL(withProto);
    } catch {
      return {
        submittedUrl: urlStr,
        verdict: 'unknown',
        childExplanation: 'Bu havola to‘g‘ri internet manzili shaklida yozilmagan.',
        technicalDetails: 'URL parse error',
        ssrfCheckPassed: false,
        isVisibleToParent: true,
        checkedAt: new Date().toISOString(),
      };
    }

    // SSRF Guard 1: Allowlisted ports only (80, 443)
    if (!ALLOWED_PORTS.has(parsed.port)) {
      return {
        submittedUrl: urlStr,
        verdict: 'blocked',
        childExplanation: 'Bu havolada ruxsat berilmagan maxsus port ishlatilgan. Xavfsizlik maqsadida ochilmadi.',
        technicalDetails: `SSRF Violation: Non-whitelisted port ${parsed.port}`,
        ssrfCheckPassed: false,
        isVisibleToParent: true,
        checkedAt: new Date().toISOString(),
      };
    }

    // SSRF Guard 2: Private/Internal IP blocking
    if (isPrivateOrReservedIp(parsed.hostname)) {
      return {
        submittedUrl: urlStr,
        verdict: 'blocked',
        childExplanation: 'Bu manzil ichki tarmoq yoki maxfiy tizimga qaratilgan bo‘lib, xavfli hisoblanadi.',
        technicalDetails: `SSRF Violation: Blocked private/reserved IP ${parsed.hostname}`,
        ssrfCheckPassed: false,
        isVisibleToParent: true,
        checkedAt: new Date().toISOString(),
      };
    }

    const host = parsed.hostname.toLowerCase();

    // Check phishing/harmful keywords
    if (/free-robux|pul-yutuq|bonus-click|1xbet|kazino|parol-kiriting/i.test(urlStr)) {
      const result: LinkCheckResult = {
        submittedUrl: urlStr,
        verdict: 'blocked',
        childExplanation: 'Ehtiyot bo‘ling! Bu havola shubhali soxta sahifa yoki firibgarlik belgisiga ega. Unga kirmang.',
        technicalDetails: 'Phishing keyword / scam bait pattern matched',
        ssrfCheckPassed: true,
        isVisibleToParent: true,
        checkedAt: new Date().toISOString(),
      };
      this.checkHistory.unshift(result);
      return result;
    }

    // Check trusted domains
    if (host.endsWith('.uz') || host.includes('google.com') || host.includes('wikipedia.org')) {
      const result: LinkCheckResult = {
        submittedUrl: urlStr,
        verdict: 'safe',
        childExplanation: 'Bu havola xavfsiz ko‘rinmoqda. U rasmiy va taniqli saytga tegishli.',
        technicalDetails: 'Domain is in trusted whitelist',
        ssrfCheckPassed: true,
        isVisibleToParent: true,
        checkedAt: new Date().toISOString(),
      };
      this.checkHistory.unshift(result);
      return result;
    }

    // FR-43 Invariant: Unknown result must NOT be called safe!
    const result: LinkCheckResult = {
      submittedUrl: urlStr,
      verdict: 'unknown',
      childExplanation: 'Bu yangi yoki kam uchraydigan sayt. U xavfli bo‘lmasligi mumkin, lekin ehtiyot bo‘ling va begonalarga shaxsiy parollarni bermang.',
      technicalDetails: 'Unknown domain - not verified as completely safe',
      ssrfCheckPassed: true,
      isVisibleToParent: true,
      checkedAt: new Date().toISOString(),
    };
    this.checkHistory.unshift(result);
    return result;
  }

  public getHistory(): LinkCheckResult[] {
    return [...this.checkHistory];
  }
}
