import type { DecisionResult, EvidenceCollectionResult, HypothesisResult, ConfidenceResult, ReasoningResult, Logger } from './types';
import { createLogEntry, safeLog } from './helpers';

const MAX_DURATION_MS = 180;

function resolvePrimaryHypothesis(hypotheses: HypothesisResult['hypotheses']): HypothesisResult['hypotheses'][0] | undefined {
  return [...hypotheses].sort((a, b) => b.posteriorProbability - a.posteriorProbability)[0];
}

export function makeDecision(
  reasoning: ReasoningResult,
  confidence: ConfidenceResult,
  hypothesisResult: HypothesisResult,
  evidence: EvidenceCollectionResult,
  logger: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined },
): DecisionResult {
  const start = Date.now();
  const logs: ReturnType<typeof createLogEntry>[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    const topHypothesis = resolvePrimaryHypothesis(hypothesisResult.hypotheses);
    const finalConfidence = confidence.breakdown.finalConfidence;
    let verdict: DecisionResult['verdict'] = 'uncertain';
    let recommendedAction: DecisionResult['recommendedAction'] = 'request_more_analysis';
    let rationale = 'Insufficient evidence to select a firm decision.';

    const kbMatches = evidence.evidenceItems.filter((item) => String(item.label || '').startsWith('kb_match_'));
    const kbSupportMatches = kbMatches.filter((item) => item.direction === 'supports');
    const kbContradictMatches = kbMatches.filter((item) => item.direction === 'contradicts');
    const kbSupportConfidence = kbSupportMatches.length === 0
      ? 0
      : kbSupportMatches.reduce((sum, item) => sum + item.confidence * (item.importance ?? 0.6), 0) / kbSupportMatches.length;
    const kbContradictConfidence = kbContradictMatches.length === 0
      ? 0
      : kbContradictMatches.reduce((sum, item) => sum + item.confidence * (item.importance ?? 0.6), 0) / kbContradictMatches.length;
    const knowledgeGuidedConfidence = Math.min(0.99, finalConfidence + kbSupportConfidence * 0.35);

    const effectiveConfidence = Math.max(finalConfidence, knowledgeGuidedConfidence);
    // Grouped evidence scoring to avoid double-counting correlated signals
    const groupMap: Record<string, { supports: number[]; contradicts: number[]; modality?: string; categories: string[] }> = {};
      for (const item of evidence.evidenceItems) {
        const key = (item.signal || item.label || '').toString();
        const groupKey = key.split('_').slice(0, 3).join('_') || key; // coarse grouping
        const contrib = item.confidence * (item.importance ?? 0.6) * (item.reliability ?? 0.7);
        if (!groupMap[groupKey]) groupMap[groupKey] = { supports: [], contradicts: [], modality: item.modality, categories: item.affectedCategories || [] };
        if (item.direction === 'supports') groupMap[groupKey].supports.push(contrib);
        if (item.direction === 'contradicts') groupMap[groupKey].contradicts.push(contrib);
      }

      // Temporal persistence multiplier for vision groups
      const temporalSignals = evidence.evidenceItems.filter((i) => String(i.signal || '').toLowerCase().includes('persistent') || String(i.signal || '').toLowerCase().includes('repeated') || String(i.signal || '').toLowerCase().includes('sustained') || String(i.signal || '').toLowerCase().includes('temporal'));
      const temporalPersistenceCount = temporalSignals.length;

      // Semantic corroboration: map text signals by categories
      const semanticByCategory: Record<string, { confidence: number; count: number }> = {};
      for (const item of evidence.evidenceItems.filter((i) => i.modality === 'text' && i.direction === 'supports')) {
        for (const c of (item.affectedCategories || [])) {
          if (!semanticByCategory[c]) semanticByCategory[c] = { confidence: 0, count: 0 };
          semanticByCategory[c].confidence += item.confidence;
          semanticByCategory[c].count += 1;
        }
      }

      let evidenceSupportScoreGrouped = 0;
      let evidenceContradictScoreGrouped = 0;
      for (const [gk, grp] of Object.entries(groupMap)) {
        const maxSupport = grp.supports.length ? Math.max(...grp.supports) : 0;
        const maxContradict = grp.contradicts.length ? Math.max(...grp.contradicts) : 0;

        // Apply temporal multiplier only for vision-origin groups
        const isVision = (grp.modality || '') === 'vision' || gk.includes('vision') || gk.includes('camera') || gk.includes('movement') || gk.includes('clothing');
        const temporalMultiplier = isVision && temporalPersistenceCount > 0 ? Math.min(1.5, 1 + 0.18 * temporalPersistenceCount) : 1;

        // Semantic corroboration boost for this group's categories
        let semBoost = 0;
        for (const c of grp.categories || []) {
          const sc = semanticByCategory[c];
          if (sc && sc.count > 0) {
            const avg = sc.confidence / sc.count;
            semBoost = Math.max(semBoost, Math.min(0.35, 0.2 * avg));
          }
        }

        evidenceSupportScoreGrouped += (maxSupport * (1 + semBoost)) * temporalMultiplier;
        evidenceContradictScoreGrouped += maxContradict;
      }

      const evidenceSupportScore = evidenceSupportScoreGrouped;
      const evidenceContradictScore = evidenceContradictScoreGrouped;
      const evidenceNet = evidenceSupportScore - evidenceContradictScore;

    const safeEvidenceScore = evidence.evidenceItems
      .filter((item) => item.direction === 'contradicts')
      .filter((item) => {
        const label = String(item.label || '').toLowerCase();
        const categories = (item.affectedCategories || []).map((c) => String(c).toLowerCase());
        return label.includes('informational')
          || label.includes('educational')
          || label.includes('prevention')
          || label.includes('medical')
          || categories.includes('education')
          || categories.includes('child_safety')
          || categories.includes('prevention_context');
      })
      .reduce((sum, item) => sum + item.confidence * (item.importance ?? 0.6) * (item.reliability ?? 0.7), 0);

    const strongHarmfulIntent = evidence.evidenceItems.some((item) =>
      item.label === 'intent_harmful_explicit' && item.direction === 'supports' && item.confidence >= 0.85,
    );
    const strongSexualExplicitSignal = evidence.evidenceItems.some((item) =>
      item.label === 'context_signal_sexual_explicit' && item.direction === 'supports' && item.confidence >= 0.75,
    );
    const strongSuspiciousMultimodalSignal = evidence.evidenceItems.some((item) =>
      item.label === 'combined_suspicious_multimodal' && item.direction === 'supports' && item.confidence >= 0.7,
    );
    const hasExplicitScamSignal = evidence.evidenceItems.some((item) =>
      String(item.label || '').toLowerCase().includes('phishing')
      || String(item.label || '').toLowerCase().includes('fraud')
      || String(item.label || '').toLowerCase().includes('scam')
      || (item.affectedCategories || []).some((category) => String(category).toLowerCase().includes('fraud'))
    );
    const educationalSafetySignals = evidence.evidenceItems.filter((item) => {
      const label = String(item.label || '').toLowerCase();
      const categories = (item.affectedCategories || []).map((category) => String(category).toLowerCase());
      return item.direction === 'contradicts' && (
        label.includes('educational')
        || label.includes('informational')
        || label.includes('medical')
        || label.includes('prevention')
        || categories.includes('education')
        || categories.includes('child_safety')
      );
    });
    const strongEducationalSafetySignal = educationalSafetySignals.some((item) => item.confidence >= 0.55);
    const educationalContextOverride = strongEducationalSafetySignal && !strongHarmfulIntent && (
      evidenceNet <= 0.25 || safeEvidenceScore >= evidenceSupportScore * 0.6 || educationalSafetySignals.length >= 3
    );
    const strongSafeContext = safeEvidenceScore >= 0.45 && (evidenceNet <= 0.12 || safeEvidenceScore >= evidenceSupportScore * 0.55);

    const hasStrongEvidence = evidenceSupportScore >= 0.35 && evidenceNet > 0;
    const hasBalancingSafeEvidence = safeEvidenceScore > evidenceSupportScore * 0.35;
    const harmfulSignal = (reasoning.conclusion.verdict === 'harmful' && evidenceNet >= 0.2)
      || hasStrongEvidence
      || strongSuspiciousMultimodalSignal
      || (kbSupportConfidence >= 0.3 && evidenceNet >= 0.1)
      || (strongHarmfulIntent && !educationalContextOverride)
      || ((strongSexualExplicitSignal || hasExplicitScamSignal) && !educationalContextOverride && !strongSafeContext);
    const safeSignal = reasoning.conclusion.verdict === 'safe' || (hasBalancingSafeEvidence && evidenceNet <= -0.15) || educationalContextOverride || strongSafeContext;

    if (strongHarmfulIntent && effectiveConfidence >= 0.35) {
      verdict = 'harmful';
      recommendedAction = 'block';
      rationale = 'Explicit harmful intent was detected and the system blocks for safety.';
    } else if (harmfulSignal && effectiveConfidence >= 0.42 && !safeSignal) {
      verdict = 'harmful';
      recommendedAction = 'block';
      rationale = evidenceNet >= 0.3
        ? 'Harmful evidence outweighs safe signals and confidence is sufficient to block.'
        : 'Knowledge base and reasoning support harmful classification; blocking for safety.';
    } else if (safeSignal && effectiveConfidence >= 0.55) {
      verdict = 'safe';
      recommendedAction = 'allow';
      rationale = 'Safe evidence outweighs harmful signals with sufficient confidence.';
    } else if (safeSignal && effectiveConfidence >= 0.45) {
      verdict = 'safe';
      recommendedAction = 'allow';
      rationale = 'Safe conclusion is likely, but confidence remains moderate.';
    } else if (harmfulSignal && effectiveConfidence >= 0.4) {
      verdict = 'harmful';
      recommendedAction = 'block';
      rationale = 'Harmful evidence is present and confidence is adequate to block.';
    } else {
      verdict = 'uncertain';
      recommendedAction = 'request_more_analysis';
      rationale = 'The conclusion is uncertain or evidence is balanced; additional analysis is required.';
    }

    const durationMs = Date.now() - start;
    logs.push(createLogEntry('decision-engine', 'info', 'Decision made.', { verdict, finalConfidence }));
    safeLog(logger, 'info', 'decision-engine', 'Decision made.', { verdict, finalConfidence });

    if (durationMs > MAX_DURATION_MS) {
      warnings.push('Decision making exceeded expected duration.');
      logs.push(createLogEntry('decision-engine', 'warn', 'Decision making exceeded expected duration.', { durationMs }));
    }

    return {
      success: true,
      verdict,
      recommendedAction,
      rationale,
      primaryHypothesis: topHypothesis,
      confidence: finalConfidence,
      warnings,
      errors,
      durationMs,
      logs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Decision engine failed.';
    errors.push(message);
    const entry = createLogEntry('decision-engine', 'error', message, { error });
    logs.push(entry);
    safeLog(logger, 'error', 'decision-engine', message);
    return {
      success: false,
      verdict: 'uncertain',
      recommendedAction: 'request_more_analysis',
      rationale: message,
      primaryHypothesis: undefined,
      confidence: 0,
      warnings,
      errors,
      durationMs,
      logs,
    };
  }
}
