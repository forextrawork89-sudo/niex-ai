// FR-30b: Permissioned Page Safety Analysis (Forms, Brand Signals, Calibrated Threshold)

export interface PageElementSignals {
  hasPasswordInput: boolean;
  hasCreditCardInput: boolean;
  hasLoginForm: boolean;
  brandSignals: string[]; // e.g. ['payme', 'click', 'kapitalbank']
  pageTitle: string;
  domain: string;
}

export interface PageSafetyEvaluation {
  verdict: 'SAFE' | 'WARN' | 'BLOCK';
  confidence: number;
  isPhishingSuspect: boolean;
  signals: string[];
  explanation: string;
}

const PHISHING_CONFIDENCE_THRESHOLD = 0.85;

export function analyzePermissionedPageSafety(signals: PageElementSignals): PageSafetyEvaluation {
  const detectedSignals: string[] = [];
  let threatScore = 0;

  const domain = signals.domain.toLowerCase();

  // Check if form requests credentials
  if (signals.hasPasswordInput || signals.hasLoginForm) {
    detectedSignals.push('credential_input_present');
    threatScore += 0.25;
  }

  if (signals.hasCreditCardInput) {
    detectedSignals.push('payment_card_input_present');
    threatScore += 0.35;
  }

  // Check if page claims a known brand but domain does not match
  for (const brand of signals.brandSignals) {
    const brandLower = brand.toLowerCase();
    const isDomainMatch = domain === `${brandLower}.uz` || domain.endsWith(`.${brandLower}.uz`) || domain === `${brandLower}.com` || domain.endsWith(`.${brandLower}.com`);
    if (!isDomainMatch) {
      detectedSignals.push(`brand_domain_mismatch_${brandLower}`);
      threatScore += 0.45;
    }
  }

  // Evaluate title impersonation
  const titleLower = signals.pageTitle.toLowerCase();
  if (
    (titleLower.includes('kirish') || titleLower.includes('login') || titleLower.includes('parol')) &&
    signals.brandSignals.length > 0 &&
    !domain.endsWith('.uz')
  ) {
    detectedSignals.push('non_uz_login_for_local_brand');
    threatScore += 0.2;
  }

  const confidence = Math.min(0.99, threatScore);

  if (confidence >= PHISHING_CONFIDENCE_THRESHOLD) {
    return {
      verdict: 'BLOCK',
      confidence,
      isPhishingSuspect: true,
      signals: detectedSignals,
      explanation: 'Ushbu sahifada bank yoki to‘lov tizimi nomidan foydalanilib, maxfiy ma’lumotlarni o‘g‘irlash belgilari aniqlandi.',
    };
  }

  if (confidence >= 0.45) {
    // FR-30b: If confidence is not high enough for a certain block, return WARN
    return {
      verdict: 'WARN',
      confidence,
      isPhishingSuspect: true,
      signals: detectedSignals,
      explanation: 'Sahifada shubhali forma yoki brend nomuvofiqligi aniqlandi. Maxfiy parollarni kiritmang.',
    };
  }

  return {
    verdict: 'SAFE',
    confidence: 0.9,
    isPhishingSuspect: false,
    signals: detectedSignals,
    explanation: 'Sahifada fishing xavfi aniqlanmadi.',
  };
}
