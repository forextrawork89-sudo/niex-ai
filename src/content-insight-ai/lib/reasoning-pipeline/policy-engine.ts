import type { PolicyDecision, ReasoningSummary, RiskScores } from './types';

export function applyPolicy(riskScores: RiskScores, reasoning: ReasoningSummary): PolicyDecision {
  const strongHarmSignal = riskScores.explicitness > 0.6 || riskScores.sexualIntent > 0.6 || riskScores.gamblingProbability > 0.7 || riskScores.scamProbability > 0.7 || riskScores.violence > 0.7;
  const lowConfidence = riskScores.confidence < 0.6;

  if (strongHarmSignal && !lowConfidence) {
    return {
      action: 'block',
      reason: 'Strong harmful evidence and intent were detected.',
      explanation: 'The reasoning stage found strong supporting evidence and insufficient contradiction to justify allowing the content.',
    };
  }

  if (lowConfidence) {
    return {
      action: 'request_more_analysis',
      reason: 'Confidence is too low for a final policy decision.',
      explanation: 'The reasoning stage requires additional evidence before making a final decision.',
    };
  }

  if (reasoning.contradictingEvidence.length > 0) {
    return {
      action: 'warn',
      reason: 'The content has mixed evidence and should be reviewed.',
      explanation: 'The system found contradictory evidence and therefore does not block immediately.',
    };
  }

  return {
    action: 'allow',
    reason: 'No strong harmful intent was found.',
    explanation: 'The reasoning stage did not find sufficient evidence to block the content.',
  };
}
