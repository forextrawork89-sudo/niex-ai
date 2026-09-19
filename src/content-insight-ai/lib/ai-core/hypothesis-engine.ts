import type {
  CapturedContent,
  EvidenceCollectionResult,
  Hypothesis,
  HypothesisResult,
  Logger,
} from './types';
import { createLogEntry, normalizeText, safeLog } from './helpers';
import { analyzeText } from '../semantic-analyzer';
import { searchKnowledge, hybridSearch } from '../kb-builder/knowledge-search';

const MAX_DURATION_MS = 220;

const categoryKeywords: Record<string, string[]> = {
  pornography: ['pornographic_content', 'adult', 'explicit', 'sex', 'nsfw'],
  gambling: ['gambling_promotion', 'bet', 'casino', 'slot', 'jackpot'],
  fraud: ['fraud_scam', 'scam', 'phishing', 'fake'],
  violence: ['violence_intent', 'weapon', 'attack', 'kill', 'abuse'],
  child_safety: ['child_reference', 'minor', 'underage', 'kid', 'teen', 'sexual_exploitation_awareness', 'educational_context'],
  educational: ['educational_context', 'protect', 'prevent', 'medical', 'training', 'sexual_exploitation_awareness'],
};

function buildPrior(score: number): number {
  return Math.min(0.95, Math.max(0.1, 0.25 + score * 0.5));
}

function buildKbCandidates(captured: CapturedContent, semantic: { topics: string[]; entities: Array<{ text: string }> }): string[] {
  const kbItems = Array.isArray(captured.metadata?.knowledgeBaseItems) ? captured.metadata?.knowledgeBaseItems : [];
  if (kbItems.length === 0) return [];

  const query = [captured.text, ...semantic.topics, ...semantic.entities.map((entity) => entity.text)].filter(Boolean).join(' ');
  const matches = hybridSearch(kbItems, query).slice(0, 8);
  const categories = new Set<string>();
  for (const match of matches) {
    if (match.item.category) categories.add(String(match.item.category).toLowerCase());
    if (match.item.subcategory) categories.add(String(match.item.subcategory).toLowerCase());
    if (match.item.intent) categories.add(String(match.item.intent).toLowerCase());
  }
  return [...categories];
}

export function generateHypotheses(
  captured: CapturedContent,
  evidence: EvidenceCollectionResult,
  logger: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined },
  cognitiveState?: any,
): HypothesisResult {
  const start = Date.now();
  const logs: ReturnType<typeof createLogEntry>[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const hypotheses: Hypothesis[] = [];

  try {
    const text = normalizeText(captured.text);
    const evidenceLabels = evidence.evidenceItems.map((item) => item.label);

    // Semantic signals (prefer cognitiveState if available)
    let semanticTopics: string[] = [];
    let semanticEntities: string[] = [];
    let semanticToxicity = 0;
    if (cognitiveState && cognitiveState.features) {
      semanticTopics = cognitiveState.features.topics || [];
      semanticEntities = (cognitiveState.entities || []).map((e: any) => e.name);
      semanticToxicity = cognitiveState.features.toxicity ?? 0;
    } else {
      const semantic = analyzeText(text);
      semanticTopics = semantic.topics || [];
      semanticEntities = (semantic.entities || []).map((e: any) => e.text);
      semanticToxicity = semantic.toxicity ?? 0;
    }

    const semantic = { topics: semanticTopics, entities: semanticEntities.map((name) => ({ text: name })) };
    const kbCandidates = buildKbCandidates(captured, semantic);

    const candidates = new Set<string>(Object.keys(categoryKeywords));
    for (const c of kbCandidates) candidates.add(c);
    semanticTopics.forEach((t) => candidates.add(String(t).toLowerCase()));
    semanticEntities.forEach((e) => candidates.add(String(e).toLowerCase()));
    evidence.evidenceItems.flatMap((item) => item.affectedCategories || []).forEach((category) => {
      const normalizedCategory = String(category).toLowerCase();
      if (normalizedCategory) candidates.add(normalizedCategory);
    });

    const kbItems = Array.isArray(captured.metadata?.knowledgeBaseItems) ? captured.metadata.knowledgeBaseItems : [];
    const kbQuery = [text, ...semanticTopics, ...semanticEntities].filter(Boolean).join(' ');
    const kbMatches = kbItems.length ? hybridSearch(kbItems, kbQuery).slice(0, 8) : [];

    for (const candidate of candidates) {
      const supportMagnitude = evidence.evidenceItems.reduce((sum, item) => {
        const labelMatch = String(item.label || '').toLowerCase().includes(candidate);
        const categoryMatch = (item.affectedCategories || []).some((ac) => String(ac).toLowerCase().includes(candidate));
        if (!labelMatch && !categoryMatch) return sum;

        const directionMultiplier = item.direction === 'supports' ? 1 : item.direction === 'contradicts' ? -1 : 0;
        const weight = item.confidence * (item.importance ?? 0.6) * (item.reliability ?? 0.7);
        return sum + directionMultiplier * weight;
      }, 0);

      const kbSupportScore = kbMatches.reduce((sum, match) => {
        if (match.item.category?.toLowerCase() === candidate || match.item.subcategory?.toLowerCase() === candidate) {
          return sum + match.score;
        }
        return sum;
      }, 0);

      const topicStrength = Math.min(1, (semanticTopics.length || 0) / 3);
      const semanticSignal = Math.max(0, semanticToxicity * 0.6 + topicStrength * 0.3);
      const prior = buildPrior(Math.max(0, supportMagnitude) * 0.5 + semanticSignal * 0.3 + Math.min(0.25, kbSupportScore * 0.15));

      const supporting = evidence.evidenceItems.filter((item) => ((item.affectedCategories || []).some((ac) => String(ac).toLowerCase().includes(candidate)) || String(item.label || '').toLowerCase().includes(candidate)) && item.direction === 'supports').map((i) => i.id);
      const opposing = evidence.evidenceItems.filter((item) => ((item.affectedCategories || []).some((ac) => String(ac).toLowerCase().includes(candidate)) || String(item.label || '').toLowerCase().includes(candidate)) && item.direction === 'contradicts').map((i) => i.id);

      const evidenceScore = evidence.evidenceItems.reduce((sum, item) => {
        const isRelated = (item.affectedCategories || []).some((ac) => String(ac).toLowerCase().includes(candidate)) || String(item.label || '').toLowerCase().includes(candidate);
        if (!isRelated) return sum;
        const multiplier = item.direction === 'supports' ? 1 : item.direction === 'contradicts' ? -1 : 0;
        return sum + multiplier * item.confidence * (item.importance ?? 0.6) * (item.reliability ?? 0.7);
      }, 0);

      const priorWithEvidence = Math.min(0.99, Math.max(0.001, prior + evidenceScore * 0.12));
      const posterior = Math.min(0.99, Math.max(0.001, priorWithEvidence + supporting.reduce((s, id) => s + 0.03, 0) - opposing.reduce((s, id) => s + 0.02, 0) + Math.min(0.2, kbSupportScore * 0.12)));

      hypotheses.push({
        id: `hypothesis-${candidate}`,
        category: candidate,
        statement: `This content may relate to ${candidate}.`,
        priorProbability: prior,
        posteriorProbability: posterior,
        evidenceFor: supporting,
        evidenceAgainst: opposing,
        status: 'active',
      });
    }

    if (hypotheses.length === 0) {
      hypotheses.push({
        id: 'hypothesis-other',
        category: 'other',
        statement: 'The content does not fit a known harmful category.',
        priorProbability: 0.2,
        posteriorProbability: 0.2,
        evidenceFor: [],
        evidenceAgainst: [],
        status: 'active',
      });
    }

    logs.push(createLogEntry('hypothesis-engine', 'info', `Generated ${hypotheses.length} hypotheses.`, {
      evidenceLabels,
      categories: Object.keys(categoryKeywords),
    }));
    safeLog(logger, 'info', 'hypothesis-engine', 'Hypotheses generated.', { hypothesisCount: hypotheses.length });

    const durationMs = Date.now() - start;
    if (durationMs > MAX_DURATION_MS) {
      warnings.push('Hypothesis generation exceeded expected duration.');
      logs.push(createLogEntry('hypothesis-engine', 'warn', 'Hypothesis generation exceeded expected duration.', { durationMs }));
      safeLog(logger, 'warn', 'hypothesis-engine', 'Hypothesis generation exceeded expected duration.', { durationMs });
    }

    return {
      success: true,
      hypotheses,
      summary: `Generated ${hypotheses.length} candidate hypotheses for reasoning.`,
      warnings,
      errors,
      durationMs,
      logs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Hypothesis generation failed.';
    errors.push(message);
    const entry = createLogEntry('hypothesis-engine', 'error', message, { error });
    logs.push(entry);
    safeLog(logger, 'error', 'hypothesis-engine', message);

    return {
      success: false,
      hypotheses,
      summary: 'Hypothesis generation failed.',
      warnings,
      errors,
      durationMs,
      logs,
    };
  }
}
