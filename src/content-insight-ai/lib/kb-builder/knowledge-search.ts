import type { NormalizedKnowledgeItem, SearchResult } from './types';

function normalizeQuery(query: string): string[] {
  return query.toLowerCase().split(/\W+/).filter(Boolean);
}

function keywordScore(item: NormalizedKnowledgeItem, query: string): number {
  const qTokens = normalizeQuery(query);
  if (!qTokens.length) return 0;

  const haystack = [
    item.category,
    item.subcategory,
    item.intent,
    ...item.concepts,
    ...item.entities,
    ...item.context,
    ...item.tags,
    ...(item.relationships || []).map((rel) => rel.target),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const exactMatch = qTokens.some((token) => haystack.includes(token));
  const overlap = qTokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
  const conceptOverlap = item.concepts.reduce((total, concept) => total + (qTokens.some((token) => concept.includes(token)) ? 1 : 0), 0);
  const riskBoost = item.risk === 'critical' ? 0.45 : item.risk === 'high' ? 0.28 : item.risk === 'medium' ? 0.1 : 0;
  const intentBoost = item.intent === 'harmful' ? 0.35 : item.intent === 'safe' ? 0.15 : 0.05;
  const contextBoost = (item.metadata as Record<string, unknown>)?.contextSignals ? 0.08 : 0;
  const ambiguityPenalty = ((item.metadata as Record<string, unknown>)?.ambiguitySignals as string[] | undefined)?.length ? -0.2 : 0;

  const score = (exactMatch ? 0.75 : 0) + overlap * 0.2 + conceptOverlap * 0.18 + riskBoost + intentBoost + contextBoost + ambiguityPenalty;
  return Math.min(score, 2.4);
}

function classifyResult(item: NormalizedKnowledgeItem, score: number): Pick<SearchResult, 'relevance' | 'evidenceType'> {
  const metadata = item.metadata as Record<string, unknown> | undefined;
  const harmfulIndicators = Array.isArray(metadata?.harmfulIndicators) ? metadata.harmfulIndicators : [];
  const safeIndicators = Array.isArray(metadata?.safeIndicators) ? metadata.safeIndicators : [];
  const ambiguitySignals = Array.isArray(metadata?.ambiguitySignals) ? metadata.ambiguitySignals : [];

  const safeContext = safeIndicators.length > 0 || item.intent === 'safe' || item.risk === 'low';
  const harmfulContext = harmfulIndicators.length > 0 || item.intent === 'harmful' || item.risk === 'high' || item.risk === 'critical';
  const preventionContext = item.context.includes('prevention_context') || item.context.includes('educational_context') || item.context.includes('news_context');

  if (ambiguitySignals.length > 0) {
    return { relevance: 'ambiguous', evidenceType: 'ambiguous' };
  }

  if (safeContext && !harmfulContext) {
    return { relevance: score >= 1.0 ? 'medium' : 'low', evidenceType: 'safe' };
  }

  if (safeContext && harmfulContext) {
    if (preventionContext || item.intent === 'safe') {
      return { relevance: score >= 1.1 ? 'medium' : 'low', evidenceType: 'safe' };
    }
    const safeBias = score < 1.1 ? 'safe' : 'ambiguous';
    return { relevance: score >= 1.1 ? 'medium' : 'low', evidenceType: safeBias as 'safe' | 'ambiguous' };
  }

  if (harmfulContext) {
    return { relevance: score >= 1.2 ? 'high' : 'medium', evidenceType: 'harmful' };
  }

  return { relevance: score >= 1.1 ? 'medium' : 'low', evidenceType: 'neutral' };
}

export function searchKnowledge(items: NormalizedKnowledgeItem[], query: string): SearchResult[] {
  const scored = items
    .map((item) => {
      const score = keywordScore(item, query);
      const classification = classifyResult(item, score);
      return {
        item,
        score,
        reasons: [item.category, item.subcategory, item.intent, ...(item.metadata?.harmfulIndicators as string[] || []), ...(item.metadata?.safeIndicators as string[] || [])].filter(Boolean) as string[],
        ...classification,
      };
    })
    .filter((entry) => entry.score > 0.28)
    .sort((a, b) => b.score - a.score);
  return scored.map((entry) => ({ item: entry.item, score: entry.score, reasons: entry.reasons, relevance: entry.relevance, evidenceType: entry.evidenceType }));
}

export function hybridSearch(items: NormalizedKnowledgeItem[], query: string): SearchResult[] {
  const keyword = searchKnowledge(items, query);
  const semantic = items
    .filter((item) => item.concepts.some((concept) => concept.toLowerCase().includes(query.toLowerCase())))
    .map((item) => ({ item, score: 0.82, reasons: ['semantic'], relevance: 'medium' as const, evidenceType: 'neutral' as const }));
  return [...keyword, ...semantic].filter((entry, index, arr) => arr.findIndex((candidate) => candidate.item.id === entry.item.id) === index);
}
