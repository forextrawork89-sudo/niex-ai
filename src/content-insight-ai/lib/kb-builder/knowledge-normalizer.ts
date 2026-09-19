import type { ExtractedKnowledgeItem, NormalizedKnowledgeItem } from './types';

const DOMAIN_ALIASES: Record<string, string> = {
  pornography: 'pornography',
  sexual: 'sexual_content',
  scam: 'scam',
  fraud: 'fraud',
  phishing: 'phishing',
  malware: 'malware',
  cyber: 'cyber_attacks',
  violence: 'violence',
  weapon: 'violence',
  child: 'child_safety',
  minor: 'child_safety',
  extremist: 'extremism',
  hate: 'hate_speech',
  suicide: 'self_harm',
  selfharm: 'self_harm',
  drug: 'drugs',
  gambling: 'gambling',
  bet: 'gambling',
  casino: 'gambling',
  educational: 'educational_context',
  medical: 'medical_context',
  scientific: 'scientific_context',
  historical: 'historical_context',
  artistic: 'artistic_context',
  safe: 'safe_context',
  prevention: 'prevention_context',
  news: 'news_context',
  fictional: 'fictional_context',
};

function normalizeDomain(value: string): string {
  const raw = value.toLowerCase().trim();
  return DOMAIN_ALIASES[raw] || raw.replace(/\s+/g, '_');
}

function extractTokens(text: string): string[] {
  return Array.from(new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 20)));
}

function inferIntent(text: string, indicators: ReturnType<typeof inferIndicators>, context: string[]): NormalizedKnowledgeItem['intent'] {
  const lower = text.toLowerCase();
  const hasHarmful = indicators.harmfulIndicators.length > 0 || /harmful|attack|scam|fraud|phishing|malware|drug|gambling|violence|suicide|hate|extrem|child|porn|sexual|exploit|abuse/.test(lower);
  const hasSafe = indicators.safeIndicators.length > 0 || context.includes('educational_context') || context.includes('prevention_context') || /safe|educational|medical|scientific|historical|artistic|prevention|awareness|news|report|fiction|context/.test(lower);

  if (hasSafe && !hasHarmful) return 'safe';
  if (hasHarmful && !hasSafe) return 'harmful';
  if (hasHarmful && hasSafe) return 'informational';
  return 'informational';
}

function inferRisk(text: string, indicators: ReturnType<typeof inferIndicators>, context: string[]): NormalizedKnowledgeItem['risk'] {
  const lower = text.toLowerCase();
  const hasCritical = /child|suicide|extrem|terror|exploit|csam|ransom|malware|phishing|scam|fraud/.test(lower);
  const hasHigh = /attack|violence|weapon|gambling|drugs|hate|abuse/.test(lower);
  const hasSafe = indicators.safeIndicators.length > 0 || context.includes('educational_context') || context.includes('prevention_context');

  if (hasCritical && !hasSafe) return 'critical';
  if (hasHigh && !hasSafe) return 'high';
  if (hasSafe) return 'low';
  return 'medium';
}

function inferSeverity(text: string, indicators: ReturnType<typeof inferIndicators>, context: string[]): 'low' | 'medium' | 'high' | 'critical' {
  const lower = text.toLowerCase();
  const hasCritical = /child|suicide|csam|exploit|ransom|terror|extrem|self-harm/.test(lower);
  const hasHigh = /attack|violence|weapon|scam|fraud|phishing|malware|porn|gambling|hate|drugs/.test(lower);
  const hasSafe = indicators.safeIndicators.length > 0 || context.includes('educational_context') || context.includes('prevention_context');

  if (hasCritical && !hasSafe) return 'critical';
  if (hasHigh && !hasSafe) return 'high';
  if (hasSafe) return 'low';
  return 'medium';
}

function inferContext(text: string): string[] {
  const lower = text.toLowerCase();
  const contexts: string[] = [];
  if (/educational|teach|lesson|awareness|prevention/.test(lower)) contexts.push('educational_context');
  if (/medical|clinical|doctor|health/.test(lower)) contexts.push('medical_context');
  if (/scientific|research|study|analysis/.test(lower)) contexts.push('scientific_context');
  if (/historical|archive|museum|document/.test(lower)) contexts.push('historical_context');
  if (/artistic|film|museum|gallery/.test(lower)) contexts.push('artistic_context');
  if (/news|report|journal/.test(lower)) contexts.push('news_context');
  if (/fiction|novel|movie|story/.test(lower)) contexts.push('fictional_context');
  if (/safe|protect|prevent|warning/.test(lower)) contexts.push('prevention_context');
  if (contexts.length === 0) contexts.push('general_context');
  return contexts;
}

function inferIndicators(text: string) {
  const lower = text.toLowerCase();
  const harmfulIndicators: string[] = [];
  const safeIndicators: string[] = [];
  const ambiguitySignals: string[] = [];

  if (/porn|sexual|explicit|nudity/.test(lower)) harmfulIndicators.push('sexual_content');
  if (/scam|fraud|phishing|impersonat|credential|invoice/.test(lower)) harmfulIndicators.push('fraud_signal');
  if (/malware|ransom|botnet|virus|exploit|credential/.test(lower)) harmfulIndicators.push('cyber_threat');
  if (/gambling|casino|bet|lottery/.test(lower)) harmfulIndicators.push('gambling_signal');
  if (/violence|weapon|kill|attack|terror/.test(lower)) harmfulIndicators.push('violence_signal');
  if (/child|minor|underage/.test(lower)) harmfulIndicators.push('child_safety_signal');
  if (/hate|racis|bigot|slur/.test(lower)) harmfulIndicators.push('hate_signal');
  if (/suicide|self-harm|self harm/.test(lower)) harmfulIndicators.push('self_harm_signal');
  if (/drug|substance|cocaine|meth/.test(lower)) harmfulIndicators.push('drug_signal');

  if (/educational|medical|scientific|historical|artistic|prevention|awareness|news|report/.test(lower)) safeIndicators.push('contextual_safety');
  if (/fiction|quote|parody|satire|discussion/.test(lower)) safeIndicators.push('transformation_context');
  if (/ambiguous|unclear|possible|may|could|alleged/.test(lower)) ambiguitySignals.push('ambiguity');
  if (/quote|quotation|mention|refer|context/.test(lower)) ambiguitySignals.push('contextual_quote');

  return { harmfulIndicators, safeIndicators, ambiguitySignals };
}

function makeRelationships(text: string): Array<{ type: string; target: string; confidence: number }> {
  const tokens = extractTokens(text);
  const relationships: Array<{ type: string; target: string; confidence: number }> = [];
  for (const token of tokens.slice(0, 6)) {
    relationships.push({ type: 'related_to', target: normalizeDomain(token), confidence: 0.6 });
  }
  return relationships;
}

export function normalizeKnowledge(items: ExtractedKnowledgeItem[]): NormalizedKnowledgeItem[] {
  return items.map((item, index) => {
    const text = item.rawText;
    const tokens = extractTokens(text);
    const indicators = inferIndicators(text);
    const context = inferContext(text);
    const intent = inferIntent(text, indicators, context);
    const risk = inferRisk(text, indicators, context);
    const severity = inferSeverity(text, indicators, context);

    return {
      id: item.id || `kb-${index + 1}`,
      source: item.source,
      category: item.sourceKind === 'official' ? 'policy' : 'generic',
      subcategory: item.contentType,
      concepts: Array.from(new Set([...tokens, ...indicators.harmfulIndicators, ...indicators.safeIndicators]))
        .slice(0, 16),
      entities: tokens.slice(0, 8),
      relationships: makeRelationships(text),
      context,
      intent,
      evidence: [{ source: item.source, snippet: text.slice(0, 160), confidence: 0.72 }],
      confidence: intent === 'harmful' ? 0.82 : intent === 'safe' ? 0.78 : 0.65,
      language: 'en',
      risk,
      tags: Array.from(new Set([item.contentType, item.sourceKind, ...indicators.harmfulIndicators, ...indicators.safeIndicators, ...indicators.ambiguitySignals])),
      timestamps: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourceFetchedAt: new Date().toISOString(),
      },
      metadata: {
        ...item.metadata,
        structured: Boolean(item.structured),
        severity,
        harmfulIndicators: indicators.harmfulIndicators,
        safeIndicators: indicators.safeIndicators,
        ambiguitySignals: indicators.ambiguitySignals,
        contextSignals: context,
        provenance: { source: item.source, sourceKind: item.sourceKind, contentType: item.contentType },
      },
    };
  });
}
