import type {
  CapturedContent,
  EvidenceCollectionResult,
  HypothesisResult,
  ReasoningResult,
  EvidenceItem,
  Hypothesis,
  Logger,
} from './types';
import { createLogEntry, safeLog } from './helpers';
import { buildCognitiveReasoningGraph, analyzeCognitiveReasoningGraph } from './cognitive-reasoning-graph';

const MAX_DURATION_MS = 500;

function updatePosterior(hypothesis: Hypothesis, evidenceItems: EvidenceItem[]): Hypothesis {
  const support = evidenceItems
    .filter((item) => hypothesis.evidenceFor.includes(item.id))
    .reduce((sum, item) => sum + item.confidence, 0);
  const oppose = evidenceItems
    .filter((item) => hypothesis.evidenceAgainst.includes(item.id))
    .reduce((sum, item) => sum + item.confidence, 0);
  const posterior = Math.min(0.99, Math.max(0.01, hypothesis.priorProbability + support * 0.15 - oppose * 0.15));
  const status: Hypothesis['status'] = posterior >= 0.7 ? 'confirmed' : posterior <= 0.3 ? 'rejected' : 'uncertain';
  return {
    ...hypothesis,
    posteriorProbability: posterior,
    status,
  };
}

function buildConclusion(hypotheses: Hypothesis[], graphAnalysis?: ReasoningResult['graphAnalysis']): ReasoningResult['conclusion'] {
  const categoryVerdict: Record<string, 'harmful' | 'safe'> = {
    pornography: 'harmful',
    gambling: 'harmful',
    fraud: 'harmful',
    violence: 'harmful',
    child_safety: 'safe',
    education: 'safe',
    other: 'safe',
  };

  const sorted = [...hypotheses].sort((a, b) => b.posteriorProbability - a.posteriorProbability);
  const top = sorted[0];
  const alternativeInterpretations = (graphAnalysis?.alternativeExplanations?.length ? graphAnalysis.alternativeExplanations : sorted.slice(1, 4).map((h) => `${h.category} (${(h.posteriorProbability * 100).toFixed(0)}%)`));
  const topVerdict = categoryVerdict[top.category] || 'uncertain';

  const verdict = topVerdict === 'harmful'
    ? top.posteriorProbability >= 0.65 ? 'harmful' : 'uncertain'
    : topVerdict === 'safe'
      ? top.posteriorProbability >= 0.35 ? 'safe' : 'uncertain'
      : 'uncertain';
  const uncertaintyReasons: string[] = [];
  if (top.posteriorProbability > 0.35 && top.posteriorProbability < 0.65) {
    uncertaintyReasons.push('Top hypothesis confidence is low.');
  }
  if ((graphAnalysis?.contradictions?.length || 0) > 0) {
    uncertaintyReasons.push('Contradictory evidence was detected and the graph revised belief strength.');
  }

  return {
    verdict,
    answer: top.statement,
    confidence: top.posteriorProbability,
    alternativeInterpretations,
    uncertaintyReasons,
    hypothesisSummary: `${top.category} selected with ${(top.posteriorProbability * 100).toFixed(0)}% confidence.`,
  };
}

export function performReasoning(
  captured: CapturedContent,
  evidence: EvidenceCollectionResult,
  hypothesisResult: HypothesisResult,
  logger: Logger = { debug: () => undefined, info: () => undefined, warn: () => undefined, error: () => undefined },
): ReasoningResult {
  const start = Date.now();
  const logs: ReturnType<typeof createLogEntry>[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    const evidenceItems = evidence.evidenceItems;
    const kbItems = Array.isArray(captured.metadata?.knowledgeBaseItems) ? captured.metadata.knowledgeBaseItems : [];
    const graph = buildCognitiveReasoningGraph({
      captured,
      evidenceItems,
      hypotheses: hypothesisResult.hypotheses,
      kbItems,
      contextHints: [String((captured.metadata?.context as string[])?.[0] || ''), String((captured.metadata?.intentions as string[])?.[0] || '')].filter(Boolean),
    });
    const graphAnalysis = analyzeCognitiveReasoningGraph(graph, evidenceItems, hypothesisResult.hypotheses, kbItems);
    const updatedHypotheses = graphAnalysis.revisedHypotheses;
    const supportingEvidence = evidenceItems.filter((item) => item.direction === 'supports');
    const contradictingEvidence = evidenceItems.filter((item) => item.direction === 'contradicts');
    const neutralEvidence = evidenceItems.filter((item) => item.direction === 'neutral');

    const reasoningSteps = [
      {
        id: 1,
        type: 'compare' as const,
        description: graphAnalysis.contradictions.length > 0
          ? `Graph reasoning discovered ${graphAnalysis.contradictions.length} contradiction(s) and ${graphAnalysis.alternativeExplanations.length} alternative explanation(s).`
          : 'Graph reasoning found no direct contradictions; hypotheses were compared structurally.',
        confidence: Math.min(0.99, 0.55 + graphAnalysis.contradictions.length * 0.1),
        durationMs: 0,
        evidenceIds: contradictingEvidence.map((item) => item.id),
      },
      ...updatedHypotheses.map((hypothesis, index) => ({
        id: index + 2,
        type: 'assess' as const,
        description: `Revised posterior for ${hypothesis.category} to ${(hypothesis.posteriorProbability * 100).toFixed(0)}%.`,
        confidence: hypothesis.posteriorProbability,
        durationMs: 0,
        evidenceIds: [...hypothesis.evidenceFor, ...hypothesis.evidenceAgainst],
      })),
    ];

    const conclusion = buildConclusion(updatedHypotheses, graphAnalysis);
    const summary = `Reasoning completed with ${updatedHypotheses.length} hypotheses and verdict ${conclusion.verdict}. ${graphAnalysis.beliefRevisionSummary}`;
    const durationMs = Date.now() - start;

    logs.push(createLogEntry('reasoning-engine', 'info', 'Reasoning completed.', {
      verdict: conclusion.verdict,
      confidence: conclusion.confidence,
      hypothesisCount: updatedHypotheses.length,
    }));
    safeLog(logger, 'info', 'reasoning-engine', 'Reasoning completed.', {
      verdict: conclusion.verdict,
      confidence: conclusion.confidence,
    });

    if (durationMs > MAX_DURATION_MS) {
      warnings.push('Reasoning duration exceeded expected threshold.');
      logs.push(createLogEntry('reasoning-engine', 'warn', 'Reasoning exceeded expected duration.', { durationMs }));
    }

    return {
      success: true,
      conclusion,
      hypotheses: updatedHypotheses,
      supportingEvidence,
      contradictingEvidence,
      neutralEvidence,
      reasoningSteps,
      graphAnalysis: {
        nodesCount: graph.nodes.length,
        edgesCount: graph.edges.length,
        contradictions: graphAnalysis.contradictions,
        alternativeExplanations: graphAnalysis.alternativeExplanations,
        beliefRevisionSummary: graphAnalysis.beliefRevisionSummary,
      },
      summary,
      warnings,
      errors,
      durationMs,
      logs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Reasoning failed.';
    errors.push(message);
    const entry = createLogEntry('reasoning-engine', 'error', message, { error });
    logs.push(entry);
    safeLog(logger, 'error', 'reasoning-engine', message);
    return {
      success: false,
      conclusion: {
        verdict: 'uncertain',
        answer: 'Unable to draw a conclusion.',
        confidence: 0,
        alternativeInterpretations: [],
        uncertaintyReasons: [message],
        hypothesisSummary: '',
      },
      hypotheses: hypothesisResult.hypotheses,
      supportingEvidence: [],
      contradictingEvidence: [],
      neutralEvidence: [],
      reasoningSteps: [],
      summary: 'Reasoning failed.',
      warnings,
      errors,
      durationMs,
      logs,
    };
  }
}
