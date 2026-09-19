import type { EvidenceItem, ReasoningSummary, RiskScores, PipelineInput, ContextSummary, ModalityReport } from './types';

export function runReasoning(input: PipelineInput, context: ContextSummary, reports: ModalityReport[]): { reasoning: ReasoningSummary; riskScores: RiskScores } {
  const text = input.text || '';
  const lower = text.toLowerCase();
  const supporting: EvidenceItem[] = [];
  const contradicting: EvidenceItem[] = [];

  if (/porn|explicit|adult/i.test(lower)) {
    supporting.push({
      source: 'text',
      label: 'harmful_intent',
      strength: 0.9,
      supporting: true,
      explanation: 'The text explicitly references explicit or adult-oriented material.',
    });
  } else {
    contradicting.push({
      source: 'text',
      label: 'educational_context',
      strength: 0.7,
      supporting: false,
      explanation: 'The text appears to describe prevention or educational content rather than explicit intent.',
    });
  }

  if (reports.some((report) => report.modality === 'metadata')) {
    supporting.push({
      source: 'metadata',
      label: 'context_signal',
      strength: 0.5,
      supporting: true,
      explanation: 'Metadata adds contextual evidence to the reasoning flow.',
    });
  }

  const riskScores: RiskScores = {
    explicitness: /porn|explicit|adult/i.test(lower) ? 0.82 : 0.18,
    sexualIntent: /porn|explicit|adult/i.test(lower) ? 0.78 : 0.16,
    gamblingProbability: /gamble|casino|bet|slot/i.test(lower) ? 0.9 : 0.05,
    violence: /violence|weapon|attack/i.test(lower) ? 0.85 : 0.05,
    manipulation: /scam|fraud|fake|phishing/i.test(lower) ? 0.82 : 0.08,
    scamProbability: /scam|fraud|fake|phishing/i.test(lower) ? 0.88 : 0.05,
    childSafetyRisk: /child|children|protect/i.test(lower) ? 0.72 : 0.2,
    confidence: /porn|explicit|adult/i.test(lower) ? 0.84 : 0.58,
  };

  const reasoning: ReasoningSummary = {
    supportingEvidence: supporting,
    contradictingEvidence: contradicting,
    missingEvidence: ['visual evidence', 'audio evidence', 'creator history'],
    explanation: 'The system reasons from extracted evidence, context, and intent before reaching a policy decision.',
  };

  return { reasoning, riskScores };
}
