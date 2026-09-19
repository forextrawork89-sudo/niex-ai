import type { AiCoreResult, EvidenceItem, Hypothesis, ReasoningStep } from './ai-core/types';

export interface DiagnosticEvaluation {
  verdict: 'safe' | 'harmful' | 'uncertain';
  confidence: number;
  action: 'allow' | 'block' | 'review';
  whyBlocked: string[];
  whyAllowed: string[];
  detectedCategories: string[];
  signalTimeline: Array<{
    stage: string;
    detail: string;
    confidence: number;
  }>;
  evidenceSummary: Array<{
    label: string;
    confidence: number;
    modality: string;
    description: string;
  }>;
  trace: Array<{
    stage: string;
    detail: string;
  }>;
}

export function buildDiagnosticEvaluation(params: {
  text?: string;
  contentType?: string;
  aiCoreResult: AiCoreResult;
  metadata?: Record<string, unknown>;
}): DiagnosticEvaluation {
  const { aiCoreResult } = params;
  const verdict = aiCoreResult.decisionResult?.verdict ?? 'uncertain';
  const confidence = aiCoreResult.confidenceResult?.breakdown?.finalConfidence ?? aiCoreResult.decisionResult?.confidence ?? 0.5;
  const action = aiCoreResult.policyResult?.action === 'block' ? 'block' : aiCoreResult.decisionResult?.recommendedAction === 'block' ? 'block' : verdict === 'safe' ? 'allow' : 'review';

  const evidenceItems = aiCoreResult.evidenceResult?.evidenceItems ?? [];
  const hypotheses = aiCoreResult.hypothesisResult?.hypotheses ?? [];
  const reasoningSteps = aiCoreResult.reasoningResult?.reasoningSteps ?? [];
  const decisionRationale = aiCoreResult.decisionResult?.rationale ?? '';
  const policyExplanation = aiCoreResult.policyResult?.explanation ?? '';

  const detectedCategories = Array.from(new Set(
    [
      ...evidenceItems.flatMap((item) => item.affectedCategories ?? []),
      ...hypotheses.map((hypothesis) => hypothesis.category),
    ].filter(Boolean) as string[]
  ));

  const whyBlocked = buildWhyBlocked(evidenceItems, hypotheses, reasoningSteps, decisionRationale, policyExplanation);
  const whyAllowed = buildWhyAllowed(evidenceItems, hypotheses, reasoningSteps, decisionRationale, policyExplanation);

  const signalTimeline = [
    ...evidenceItems.slice(0, 3).map((item) => ({
      stage: item.provenance === 'knowledge_base' ? 'KB RETRIEVAL' : 'EVIDENCE FUSION',
      detail: item.description,
      confidence: item.confidence,
    })),
    ...reasoningSteps.slice(0, 3).map((step) => ({
      stage: 'REASONING',
      detail: step.description,
      confidence: step.confidence,
    })),
  ];

  const evidenceSummary = evidenceItems.map((item) => ({
    label: item.label,
    confidence: item.confidence,
    modality: item.modality,
    description: item.description,
  }));

  const trace = [
    { stage: 'CAPTURE', detail: params.text ? `Text captured (${params.text.length} chars)` : 'No text captured' },
    { stage: 'EVIDENCE', detail: evidenceItems.length ? `${evidenceItems.length} evidence item(s) fused` : 'No evidence items' },
    { stage: 'HYPOTHESIS', detail: hypotheses.length ? `${hypotheses.length} hypothesis(es) generated` : 'No hypotheses' },
    { stage: 'DECISION', detail: decisionRationale || 'No decision rationale provided' },
    { stage: 'POLICY', detail: policyExplanation || 'No policy explanation provided' },
  ];

  return {
    verdict,
    confidence,
    action,
    whyBlocked,
    whyAllowed,
    detectedCategories,
    signalTimeline,
    evidenceSummary,
    trace,
  };
}

function buildWhyBlocked(
  evidenceItems: EvidenceItem[],
  hypotheses: Hypothesis[],
  reasoningSteps: ReasoningStep[],
  decisionRationale: string,
  policyExplanation: string,
): string[] {
  const reasons: string[] = [];
  if (decisionRationale) reasons.push(normalizeDiagnosticReason(decisionRationale));
  if (policyExplanation) reasons.push(normalizeDiagnosticReason(policyExplanation));

  const harmfulEvidence = evidenceItems.filter((item) => item.direction === 'supports' && (item.confidence >= 0.7 || item.importance >= 0.7));
  if (harmfulEvidence.length) {
    reasons.push(...harmfulEvidence.map((item) => `Evidence ${item.label} supported a harmful classification with ${(item.confidence * 100).toFixed(0)}% confidence.`));
  }

  const harmfulHypotheses = hypotheses.filter((hypothesis) => hypothesis.posteriorProbability >= 0.8);
  if (harmfulHypotheses.length) {
    reasons.push(...harmfulHypotheses.map((hypothesis) => `Hypothesis ${hypothesis.category} reached ${(hypothesis.posteriorProbability * 100).toFixed(0)}% confidence.`));
  }

  if (reasoningSteps.length) {
    reasons.push(...reasoningSteps.slice(0, 2).map((step) => `Reasoning step: ${step.description}`));
  }

  return reasons;
}

function normalizeDiagnosticReason(reason: string): string {
  return reason.replace(/Explicit harmful intent/i, 'explicit harmful intent');
}

function buildWhyAllowed(
  evidenceItems: EvidenceItem[],
  hypotheses: Hypothesis[],
  reasoningSteps: ReasoningStep[],
  decisionRationale: string,
  policyExplanation: string,
): string[] {
  const reasons: string[] = [];
  if (decisionRationale) reasons.push(decisionRationale);
  if (policyExplanation) reasons.push(policyExplanation);

  const safeEvidence = evidenceItems.filter((item) => item.direction === 'contradicts' || item.context?.includes('safe'));
  if (safeEvidence.length) {
    reasons.push(...safeEvidence.map((item) => `Evidence ${item.label} was treated as a safe-context counterweight.`));
  }

  if (!hypotheses.length) {
    reasons.push('No strong harmful hypotheses remained after evidence fusion.');
  }

  if (reasoningSteps.length) {
    reasons.push(...reasoningSteps.slice(0, 2).map((step) => `Reasoning step: ${step.description}`));
  }

  return reasons;
}
