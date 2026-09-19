// FR-30: Domain Reputation, Typosquatting, Phishing Protection, and Credential Privacy Guard

export type DomainThreatVerdict = 'BLOCK' | 'WARN' | 'ALLOW' | 'UNKNOWN';

export interface DomainCheckResult {
  domain: string;
  verdict: DomainThreatVerdict;
  confidence: number;
  reason: string;
  threatType?: 'known_phishing' | 'typosquatting' | 'suspicious_tld' | 'impersonation';
  targetBrand?: string;
  redirectChain?: string[];
  isLocalTargetSpoof?: boolean;
}

export interface FalsePositiveReport {
  id: string;
  domain: string;
  reportedBy: string; // e.g. guardian or child
  userReason: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Local Bank, Payment & Government Domain Whitelist (Uzbekistan)
export const OFFICIAL_LOCAL_DOMAINS: Record<string, string> = {
  // Central Bank & Commercial Banks
  'cbu.uz': 'O‘zbekiston Respublikasi Markaziy Banki',
  'kapitalbank.uz': 'Kapitalbank',
  'agrobank.uz': 'Agrobank',
  'nbu.uz': 'O‘zmilliybank (NBU)',
  'ipakyulibank.uz': 'Ipak Yo‘li Bank',
  'hamkorbank.uz': 'Hamkorbank',
  'sqb.uz': 'O‘zsanoatqurilishbank (SQB)',
  'asakabank.uz': 'Asakabank',
  'infinbank.uz': 'InFinBank',
  'qtb.uz': 'Qishloq Qurilish Bank',
  'aloqabank.uz': 'Aloqabank',
  'uzumbank.uz': 'Uzum Bank',
  'tbcbank.uz': 'TBC Bank',
  'anorbank.uz': 'Anorbank',
  'ipakyo‘li.uz': 'Ipak Yo‘li Bank',

  // Payment Systems
  'payme.uz': 'Payme',
  'click.uz': 'Click',
  'oson.uz': 'Oson',
  'paynet.uz': 'Paynet',
  'atmos.uz': 'Atmos',

  // Government & Social Portals
  'gov.uz': 'Yagona davlat interaktiv xizmatlari',
  'my.gov.uz': 'Yagona interaktiv davlat xizmatlari portali',
  'soliq.uz': 'Davlat soliq qo‘mitasi',
  'lex.uz': 'Qonun hujjatlari ma’lumotlari milliy bazasi',
  'edu.uz': 'Oliy ta’lim vazirligi',
  'kundalik.com': 'Kundalik ta’lim portali',
  'emaktab.uz': 'eMaktab platformasi',
  'stat.uz': 'Statistika agentligi',
};

// Known Phishing / Threat Database
export const KNOWN_THREAT_DOMAINS = new Set<string>([
  'payme-login.com',
  'payme-security.click',
  'click-uzb.cc',
  'click-online.top',
  'kapital-bank-security.net',
  'agrobank-bonus.info',
  'my-gov-uz-yordam.site',
  'uzum-yutuq.fun',
  'pul-yutuqlari.online',
  'bonus-telegram.xyz',
]);

// False positive store
const falsePositiveReports: FalsePositiveReport[] = [];

// Levenshtein distance calculation
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = new Array<number[]>(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    const row = (matrix[i] = new Array<number>(an + 1));
    row[0] = i;
  }
  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion, deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

// Homoglyph normalizer (e.g. cyrillic look-alikes to latin)
export function normalizeHomoglyphs(str: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x', 'у': 'y', 'і': 'i',
    '0': 'o', '1': 'l',
  };
  return str.split('').map((char) => map[char] || char).join('');
}

// Credential stripper to guarantee passwords and bank credentials never leak
export function sanitizeInputForAI(text: string): { sanitized: string; redactedTypes: string[] } {
  const redactedTypes: string[] = [];
  let sanitized = text;

  // 1. Credit Card Numbers (16 digits with spaces/dashes)
  const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  if (cardRegex.test(sanitized)) {
    sanitized = sanitized.replace(cardRegex, '[REDACTED_CARD_NUMBER]');
    redactedTypes.push('credit_card');
  }

  // 2. CVV / CVC (3-4 digits in context)
  const cvvRegex = /\b(cvv|cvc|kod|kodini|code)[:=\s]*(\d{3,4})\b/gi;
  if (cvvRegex.test(sanitized)) {
    sanitized = sanitized.replace(cvvRegex, '$1: [REDACTED_CVV]');
    redactedTypes.push('cvv');
  }

  // 3. Password fields / patterns
  const pwdRegex = /(password|parol|parolingiz|pin|pin-kod)[:=\s]*([^\s,;]+)/gi;
  if (pwdRegex.test(sanitized)) {
    sanitized = sanitized.replace(pwdRegex, '$1: [REDACTED_PASSWORD]');
    redactedTypes.push('password');
  }

  return { sanitized, redactedTypes };
}

// Domain reputation checker
export function checkDomainReputation(
  rawDomainOrUrl: string,
  redirectChain: string[] = []
): DomainCheckResult {
  const domain = extractCleanDomain(rawDomainOrUrl);
  if (!domain) {
    return {
      domain: rawDomainOrUrl,
      verdict: 'UNKNOWN',
      confidence: 0.5,
      reason: 'Domain formatini aniqlab bo‘lmadi.',
    };
  }

  // 1. Known Threat Sources => Immediate BLOCK
  if (KNOWN_THREAT_DOMAINS.has(domain)) {
    return {
      domain,
      verdict: 'BLOCK',
      confidence: 0.99,
      reason: 'Ushbu domen ma’lum fishing va xavfli resurslar ro‘yxatiga kiritilgan (KNOWN_THREAT_SOURCE).',
      threatType: 'known_phishing',
      redirectChain,
    };
  }

  // Check any redirect in the chain
  for (const chained of redirectChain) {
    const cleanChainDomain = extractCleanDomain(chained);
    if (cleanChainDomain && KNOWN_THREAT_DOMAINS.has(cleanChainDomain)) {
      return {
        domain,
        verdict: 'BLOCK',
        confidence: 0.98,
        reason: `Yo‘naltirishlar zanjirida ma’lum zararli domen aniqlandi (${cleanChainDomain}).`,
        threatType: 'known_phishing',
        redirectChain,
      };
    }
  }

  // 2. Exact match in official whitelist => ALLOW
  if (OFFICIAL_LOCAL_DOMAINS[domain]) {
    return {
      domain,
      verdict: 'ALLOW',
      confidence: 0.99,
      reason: `Tasdiqlangan rasmiy portal: ${OFFICIAL_LOCAL_DOMAINS[domain]}.`,
      targetBrand: OFFICIAL_LOCAL_DOMAINS[domain],
    };
  }

  // 3. Typosquatting / Homoglyph / Impersonation Check against local banks & portals
  const normalizedDomain = normalizeHomoglyphs(domain.toLowerCase());

  for (const [officialDomain, brandName] of Object.entries(OFFICIAL_LOCAL_DOMAINS)) {
    const baseOfficial = officialDomain.replace(/\.uz|\.com/, '');

    // Check if domain includes official brand name with suspicious affix (e.g. payme-security.com)
    if (
      (normalizedDomain.includes(baseOfficial) || domain.includes(baseOfficial)) &&
      domain !== officialDomain &&
      !domain.endsWith(`.${officialDomain}`)
    ) {
      return {
        domain,
        verdict: 'WARN',
        confidence: 0.9,
        reason: `Domen rasmiy ${brandName} (${officialDomain}) servisiga o‘xshash qilib yaratilgan bo‘lishi mumkin (brend soxtalashtirish).`,
        threatType: 'impersonation',
        targetBrand: brandName,
        isLocalTargetSpoof: true,
        redirectChain,
      };
    }

    // Levenshtein typosquatting check (e.g. paynee.uz, clik.uz)
    const distance = levenshteinDistance(domain, officialDomain);
    if (distance > 0 && distance <= 2 && domain.endsWith('.uz')) {
      return {
        domain,
        verdict: 'WARN',
        confidence: 0.88,
        reason: `Domen rasmiy ${officialDomain} (${brandName}) manzilidan atigi ${distance} ta harfga farq qiladi (typosquatting).`,
        threatType: 'typosquatting',
        targetBrand: brandName,
        isLocalTargetSpoof: true,
        redirectChain,
      };
    }
  }

  // 4. Suspicious TLD / TLD mismatch for financial words
  if (/(\.top|\.xyz|\.click|\.site|\.fun|\.buzz|\.monster|\.icu)$/i.test(domain)) {
    if (/bank|pay|pul|kredit|invest|bonus|yutuq/i.test(domain)) {
      return {
        domain,
        verdict: 'WARN',
        confidence: 0.82,
        reason: 'Moliyaviy mavzudagi shubhali yuqori darajadagi domen (TLD).',
        threatType: 'suspicious_tld',
        redirectChain,
      };
    }
  }

  // 5. Unknown domain => FR-30 requirement: Unknown domain must NOT be automatically branded as phishing!
  return {
    domain,
    verdict: 'UNKNOWN',
    confidence: 0.5,
    reason: 'Domen ma’lumotlar bazasida yo‘q, ammo xavfli deb tasdiqlanmagan (avtomatik phishing deb bloklanmaydi).',
    redirectChain,
  };
}

export function reportFalsePositive(report: Omit<FalsePositiveReport, 'id' | 'timestamp' | 'status'>): FalsePositiveReport {
  const item: FalsePositiveReport = {
    ...report,
    id: `fp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  falsePositiveReports.unshift(item);
  return item;
}

export function getFalsePositiveReports(): FalsePositiveReport[] {
  return [...falsePositiveReports];
}

function extractCleanDomain(raw: string): string {
  let cleaned = raw.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, '');
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split('?')[0];
  cleaned = cleaned.split(':')[0];
  return cleaned;
}
