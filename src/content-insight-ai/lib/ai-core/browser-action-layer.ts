import type { BrowserActionResult, BrowserActionPayload, DecisionResult, PolicyResult, Logger } from './types';
import { createLogEntry, safeLog } from './helpers';

const MAX_DURATION_MS = 100;

export function createBrowserAction(
  decision: DecisionResult,
  policy: PolicyResult,
  logger: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined },
): BrowserActionResult {
  const start = Date.now();
  const logs: ReturnType<typeof createLogEntry>[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    const payload: BrowserActionPayload = {
      action: policy.action,
      title: policy.action === 'block' ? 'Block Content' : policy.action === 'warn' ? 'Review Content' : policy.action === 'allow' ? 'Allow Content' : 'Review Content',
      message: policy.explanation,
      confidence: policy.confidence,
      trace: `Decision=${decision.verdict}; Policy=${policy.action}; Confidence=${policy.confidence.toFixed(2)}`,
      details: {
        decisionRationale: decision.rationale,
        primaryHypothesis: decision.primaryHypothesis?.category,
        policyTier: policy.policyTier,
      },
    };

    const durationMs = Date.now() - start;
    logs.push(createLogEntry('browser-action-layer', 'info', 'Browser action payload created.', { action: payload.action }));
    safeLog(logger, 'info', 'browser-action-layer', 'Browser action payload created.', { action: payload.action });

    if (durationMs > MAX_DURATION_MS) {
      warnings.push('Browser action creation exceeded expected duration.');
      logs.push(createLogEntry('browser-action-layer', 'warn', 'Browser action creation exceeded expected duration.', { durationMs }));
    }

    return {
      success: true,
      payload,
      warnings,
      errors,
      durationMs,
      logs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Browser action creation failed.';
    errors.push(message);
    const entry = createLogEntry('browser-action-layer', 'error', message, { error });
    logs.push(entry);
    safeLog(logger, 'error', 'browser-action-layer', message);

    return {
      success: false,
      payload: {
        action: 'inspect',
        title: 'Inspect Content',
        message,
        confidence: 0,
        trace: 'browser-action generation failed',
        details: {
          error: message,
        },
      },
      warnings,
      errors,
      durationMs,
      logs,
    };
  }
}
