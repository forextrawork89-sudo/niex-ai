import type { ConfidenceResult, ConfidenceBreakdown, EvidenceCollectionResult, HypothesisResult, ReasoningResult, Logger } from './types';
import { createLogEntry, safeLog } from './helpers';

const MAX_DURATION_MS = 200;

export function calibrateConfidence(
  evidence: EvidenceCollectionResult,
  hypotheses: HypothesisResult,
  reasoning: ReasoningResult,
  logger: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined },
): ConfidenceResult {
  const start = Date.now();
  const logs: ReturnType<typeof createLogEntry>[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    const evidenceWeights = evidence.evidenceItems.map((item) => (item.importance ?? 0.6) * (item.reliability ?? 0.7));
    const evidenceWeightedSum = evidence.evidenceItems.reduce(
      (sum, item) => sum + item.confidence * ((item.importance ?? 0.6) * (item.reliability ?? 0.7)),
      0,
    );
    const evidenceConfidence = evidence.evidenceItems.length && evidenceWeights.reduce((sum, w) => sum + w, 0)
      ? evidenceWeightedSum / evidenceWeights.reduce((sum, w) => sum + w, 0)
      : 0.15;

    const directKbConfidence = Math.min(0.99, evidence.evidenceItems
      .filter((item) => String(item.label || '').startsWith('kb_match_'))
      .reduce((sum, item) => sum + item.confidence * (item.importance ?? 0.6), 0) / Math.max(1, evidence.evidenceItems.filter((item) => String(item.label || '').startsWith('kb_match_')).length));

    const hypothesisConfidence = hypotheses.hypotheses.length
      ? Math.max(...hypotheses.hypotheses.map((h) => h.posteriorProbability))
      : 0.25;

    const contradictionRatio = reasoning.contradictingEvidence.length / Math.max(1, reasoning.supportingEvidence.length + reasoning.contradictingEvidence.length + reasoning.neutralEvidence.length);
    const consistencyScore = Math.max(0, 1 - contradictionRatio);
    const uncertaintyPenalty = reasoning.conclusion.verdict === 'uncertain' ? 0.2 : 0;

    const finalConfidence = Math.min(0.99, Math.max(0.01, evidenceConfidence * 0.4 + hypothesisConfidence * 0.38 + consistencyScore * 0.22 - uncertaintyPenalty));
    const summary = `Confidence calibrated to ${(finalConfidence * 100).toFixed(0)}%.`;
    const durationMs = Date.now() - start;

    logs.push(createLogEntry('confidence-engine', 'info', 'Confidence calibrated.', { finalConfidence }));
    safeLog(logger, 'info', 'confidence-engine', 'Confidence calibrated.', { finalConfidence });

    if (durationMs > MAX_DURATION_MS) {
      warnings.push('Confidence calibration exceeded expected duration.');
      logs.push(createLogEntry('confidence-engine', 'warn', 'Confidence calibration exceeded expected duration.', { durationMs }));
    }

    return {
      success: true,
      breakdown: {
        evidenceConfidence,
        hypothesisConfidence,
        consistencyScore,
        uncertaintyPenalty,
        finalConfidence,
      },
      summary,
      warnings,
      errors,
      durationMs,
      logs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Confidence calibration failed.';
    errors.push(message);
    const entry = createLogEntry('confidence-engine', 'error', message, { error });
    logs.push(entry);
    safeLog(logger, 'error', 'confidence-engine', message);
    return {
      success: false,
      breakdown: {
        evidenceConfidence: 0,
        hypothesisConfidence: 0,
        consistencyScore: 0,
        uncertaintyPenalty: 0,
        finalConfidence: 0,
      },
      summary: 'Confidence calibration failed.',
      warnings,
      errors,
      durationMs,
      logs,
    };
  }
}
