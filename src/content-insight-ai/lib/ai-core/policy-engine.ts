import type { DecisionResult, PolicyResult, Logger } from './types';
import { createLogEntry, safeLog } from './helpers';

const MAX_DURATION_MS = 150;

export function applyPolicy(
  decision: DecisionResult,
  logger: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined },
): PolicyResult {
  const start = Date.now();
  const logs: ReturnType<typeof createLogEntry>[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    let action = decision.recommendedAction;
    let policyTier: PolicyResult['policyTier'] = 'balanced';
    let explanation = decision.rationale;
    let requiresHumanReview = false;
    const finalConfidence = decision.confidence;

    if (decision.verdict === 'harmful' && finalConfidence >= 0.9) {
      action = 'block';
      policyTier = 'strict';
      explanation = 'Strict policy: harmful content was clearly identified with high confidence.';
    }

    if (decision.verdict === 'harmful' && finalConfidence >= 0.65 && action === 'warn') {
      requiresHumanReview = true;
      explanation = 'Balanced policy: harmful content with moderate confidence awaits human review.';
    }

    if (decision.verdict === 'uncertain' && decision.recommendedAction === 'request_more_analysis') {
      action = 'request_more_analysis';
      policyTier = 'balanced';
      explanation = 'Policy requires additional analysis due to uncertainty.';
      requiresHumanReview = true;
    }

    if (decision.verdict === 'safe' && finalConfidence >= 0.8) {
      action = 'allow';
      policyTier = 'lenient';
      explanation = 'Safe content with strong confidence is allowed by policy.';
    }

    if (decision.verdict === 'safe' && finalConfidence < 0.5) {
      action = 'warn';
      policyTier = 'balanced';
      explanation = 'Safe conclusion is weak; review recommended before allowing.';
      requiresHumanReview = true;
    }

    const durationMs = Date.now() - start;
    logs.push(createLogEntry('policy-engine', 'info', 'Policy applied.', { action, finalConfidence, policyTier }));
    safeLog(logger, 'info', 'policy-engine', 'Policy applied.', { action, finalConfidence });

    if (durationMs > MAX_DURATION_MS) {
      warnings.push('Policy evaluation exceeded expected duration.');
      logs.push(createLogEntry('policy-engine', 'warn', 'Policy evaluation exceeded expected duration.', { durationMs }));
    }

    return {
      success: true,
      action,
      policyTier,
      explanation,
      requiresHumanReview,
      confidence: finalConfidence,
      warnings,
      errors,
      durationMs,
      logs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Policy application failed.';
    errors.push(message);
    const entry = createLogEntry('policy-engine', 'error', message, { error });
    logs.push(entry);
    safeLog(logger, 'error', 'policy-engine', message);

    return {
      success: false,
      action: 'request_more_analysis',
      policyTier: 'balanced',
      explanation: message,
      requiresHumanReview: true,
      confidence: 0,
      warnings,
      errors,
      durationMs,
      logs,
    };
  }
}
