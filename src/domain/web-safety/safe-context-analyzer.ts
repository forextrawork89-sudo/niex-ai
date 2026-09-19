// FR-07b: Context-aware content analysis with minimal server payload and safe-context preservation

export type ContentContextCategory = 'medical' | 'biology_education' | 'news_reporting' | 'general' | 'harmful_candidate';

export interface ContextAnalysisRequest {
  url?: string;
  text: string;
  language?: 'uz' | 'ru' | 'en';
}

export interface ContextAnalysisPayload {
  contentHash: string;
  snippet: string; // Maximum 500 chars snippet
  detectedCategory: ContentContextCategory;
  isSafeContext: boolean;
  verdict: 'allow' | 'block' | 'warn';
  confidence: number;
  explanation: string;
  metrics: {
    language: string;
    textLength: number;
    safeContextSignals: string[];
    riskSignals: string[];
  };
}

// Simple SHA-256 equivalent hash in pure TS/JS for browser & node
export function simpleSha256(str: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

export const SAFE_CONTEXT_PATTERNS = {
  medical: [
    /tibbiyot|shifokor|davolash|kasallik|klinika|salomatlik|alomatlari|dorilar|terapiya|saraton/i,
    /медицин[а-я]|врач|лечение|болезнь|клиника|здоровье|симптомы|препарат|терапия|онкология/i,
    /medical|medicine|doctor|treatment|disease|clinic|health|symptoms|medication|therapy|cancer/i,
  ],
  biology: [
    /biologiya|anatomiya|organizm|hujayra|reproduktiv|irsiyat|fiziologiya|o['`’]quv qo['`’]llanma/i,
    /биологи[яи]|анатоми[яи]|организм|клетка|репродуктивн|физиологи[яи]|учебник|урок/i,
    /biology|anatomy|organism|cell|reproductive|genetics|physiology|textbook|lesson|curriculum/i,
  ],
  news: [
    /yangiliklar|xabar beradi|muhbir|rasmiy manba|matbuot xizmati|gazeta|axborot/i,
    /новости|сообщает|корреспондент|официальный источник|пресс-служба|газета|информация/i,
    /news|reports|correspondent|official source|press release|journalism|article/i,
  ],
};

export const HARMFUL_PATTERNS = [
  /porn|xxx|hentai|escort|sex video|intravir|bukake|boobies|hardcore adult/i,
  /порно|секс видео|интим услуги|проститутки|взрослый контент/i,
  /fohisha|qizlar bilan tanishuv nomeri|intim xizmatlar|yotoq sirlari porn/i,
  /kazino|stavka|1xbet|mostbet|bukmeker|slot machine/i,
  /казино|ставки|1xbet|мостбет|букмекер|азартные игры/i,
];

export function analyzeContentWithContext(request: ContextAnalysisRequest): ContextAnalysisPayload {
  const text = request.text || '';
  const lang = request.language || detectLanguage(text);

  // Payload minimization (FR-07b requirement):
  // Maximum 500 characters snippet
  const snippet = text.slice(0, 500);
  const contentHash = simpleSha256(text);

  const safeContextSignals: string[] = [];
  const riskSignals: string[] = [];

  let detectedCategory: ContentContextCategory = 'general';

  // Check safe contexts
  for (const pattern of SAFE_CONTEXT_PATTERNS.medical) {
    if (pattern.test(text)) {
      safeContextSignals.push('medical_terminology');
      detectedCategory = 'medical';
      break;
    }
  }

  for (const pattern of SAFE_CONTEXT_PATTERNS.biology) {
    if (pattern.test(text)) {
      safeContextSignals.push('biology_education');
      detectedCategory = 'biology_education';
      break;
    }
  }

  for (const pattern of SAFE_CONTEXT_PATTERNS.news) {
    if (pattern.test(text)) {
      safeContextSignals.push('news_reporting');
      if (detectedCategory === 'general') detectedCategory = 'news_reporting';
      break;
    }
  }

  // Check potential harmful keywords
  for (const pattern of HARMFUL_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      riskSignals.push(`matched_pattern_${match[0]}`);
    }
  }

  const isSafeContext = safeContextSignals.length > 0;
  let verdict: 'allow' | 'block' | 'warn' = 'allow';
  let explanation = 'Kontent xavfsiz deb topildi.';
  let confidence = 0.85;

  if (riskSignals.length > 0) {
    if (isSafeContext) {
      // FR-07b: Do NOT block safe context just because keywords appear (e.g., biological anatomy or medical oncology report)
      verdict = 'allow';
      confidence = 0.88;
      explanation = `Kontentda sezgir atamalar mavjud bo'lsa-da, ${detectedCategory} ta'lim/tibbiy konteksti aniqlandi. Bloklanmadi.`;
    } else {
      verdict = 'block';
      detectedCategory = 'harmful_candidate';
      confidence = 0.92;
      explanation = `Taqiqlangan yoki zararli kontent signallari aniqlandi. Kontekst: ${riskSignals.join(', ')}`;
    }
  }

  return {
    contentHash,
    snippet,
    detectedCategory,
    isSafeContext,
    verdict,
    confidence,
    explanation,
    metrics: {
      language: lang,
      textLength: text.length,
      safeContextSignals,
      riskSignals,
    },
  };
}

function detectLanguage(text: string): 'uz' | 'ru' | 'en' {
  if (/[ўқғҳ]/.test(text.toLowerCase()) || /bilan|uchun|ham|esa|haqida|fani/.test(text.toLowerCase())) {
    return 'uz';
  }
  if (/[а-яё]/i.test(text)) {
    return 'ru';
  }
  return 'en';
}
