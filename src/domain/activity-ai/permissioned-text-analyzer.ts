// FR-27: Permissioned Text Analysis (Threats, Abuse, Fraud, PI Exposure, Consent-Gated)

export type RiskCategory = 'threat' | 'abuse' | 'fraud' | 'personal_data_exposure' | 'safe';

export interface PermissionedAnalysisRequest {
  text: string;
  sourceContext: 'user_submitted' | 'shared_note' | 'browser_form';
  userConsentToken: string; // Explicit consent is mandatory
}

export interface PermissionedAnalysisResult {
  isAuthorized: boolean;
  verdict: 'safe' | 'risk_detected' | 'uncertain';
  detectedCategories: RiskCategory[];
  confidence: number;
  explanation: string;
  evidence: string[];
  isAccusationPrevented: boolean;
}

const FRAUD_PATTERNS = [
  /karta raqamingizni yuboring|sms kodni ayting|plastik karta paroli/i,
  /отправьте код из смс|пароль от карты|выиграли миллион/i,
  /send your credit card|tell me the sms code|otp code/i,
];

const THREAT_PATTERNS = [
  /seni o‘ldiraman|uyni yoqib yuboraman|ko‘chada kutib olaman/i,
  /я тебя убью|найду и побью|расправлюсь с тобой/i,
  /i will kill you|i will find you and hurt you/i,
];

const ABUSE_PATTERNS = [
  /it emgan|onangni|haromi|lattachaynar/i,
  /тварь|ублюдок|мразь|сука/i,
  /idiot|scum|worthless piece of/i,
];

export function analyzePermissionedText(request: PermissionedAnalysisRequest): PermissionedAnalysisResult {
  // Strict Privacy Invariant: Explicit data source & consent token required!
  // NO hidden private-message monitoring!
  if (!request.userConsentToken || request.userConsentToken.trim().length === 0) {
    return {
      isAuthorized: false,
      verdict: 'uncertain',
      detectedCategories: [],
      confidence: 0,
      explanation: 'Tahlil o‘tkazish uchun foydalanuvchining ochiq roziligi (userConsentToken) taqdim etilmagan. Yashirin monitoring taqiqlanadi.',
      evidence: [],
      isAccusationPrevented: true,
    };
  }

  const text = request.text || '';
  const detectedCategories: RiskCategory[] = [];
  const evidence: string[] = [];

  // Check Fraud
  for (const pattern of FRAUD_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      detectedCategories.push('fraud');
      evidence.push(`Moliyaviy firibgarlik signali: "${match[0]}"`);
    }
  }

  // Check Threat
  for (const pattern of THREAT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      detectedCategories.push('threat');
      evidence.push(`Tahdid signali: "${match[0]}"`);
    }
  }

  // Check Abuse
  for (const pattern of ABUSE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      detectedCategories.push('abuse');
      evidence.push(`Haqorat/zo‘ravonlik signali: "${match[0]}"`);
    }
  }

  // Check Personal Information Exposure (Passport, PINFL, Card)
  if (/\b\d{14}\b/.test(text)) {
    detectedCategories.push('personal_data_exposure');
    evidence.push('14 xonali JSHSHIR (PINFL) raqami aniqlandi');
  }

  if (detectedCategories.length === 0) {
    return {
      isAuthorized: true,
      verdict: 'safe',
      detectedCategories: ['safe'],
      confidence: 0.9,
      explanation: 'Matnda xavfli signallar yoki shaxsiy ma’lumotlar sizishi aniqlanmadi.',
      evidence: [],
      isAccusationPrevented: true,
    };
  }

  // Invariant: Uncertain results must NOT become accusations
  const confidence = detectedCategories.length >= 2 ? 0.92 : 0.65;
  const verdict = confidence >= 0.8 ? 'risk_detected' : 'uncertain';

  return {
    isAuthorized: true,
    verdict,
    detectedCategories,
    confidence,
    explanation: verdict === 'risk_detected'
      ? `Tahlil qilingan matnda xavfsizlikka oid signallar aniqlandi: ${detectedCategories.join(', ')}.`
      : 'Signallar to‘liq ishonchli emas. Bolaga ayblov qo‘ymaslik uchun natija noaniq (uncertain) deb belgilandi.',
    evidence,
    isAccusationPrevented: true,
  };
}
