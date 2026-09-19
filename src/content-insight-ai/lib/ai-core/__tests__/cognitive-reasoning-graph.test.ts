import { describe, expect, it } from 'vitest';
import { buildCognitiveReasoningGraph, analyzeCognitiveReasoningGraph } from '../cognitive-reasoning-graph';
import type { CapturedContent, EvidenceItem, Hypothesis } from '../types';

function makeCaptured(text = 'Suspicious transfer and urgent request'):
  CapturedContent {
  return {
    text,
    textLength: text.length,
    hasText: true,
    hasImage: false,
    hasVideo: false,
    hasAudio: false,
    metadata: {
      entities: ['account', 'request'],
      actions: ['transfer'],
      intentions: ['urgent'],
      context: ['finance'],
      temporal: ['today'],
      source: 'test',
    },
    contentType: 'text',
    sourceSummary: 'text',
  };
}

describe('Cognitive reasoning graph', () => {
  it('builds a graph with nodes and edges for evidence and hypotheses', () => {
    const captured = makeCaptured();
    const evidence: EvidenceItem[] = [
      {
        id: 'e1',
        modality: 'text',
        label: 'urgent_request',
        description: 'Urgent request detected',
        confidence: 0.8,
        reliability: 0.9,
        importance: 0.8,
        direction: 'supports',
        source: 'text',
        affectedCategories: ['fraud'],
      },
    ];
    const hypotheses: Hypothesis[] = [
      { id: 'h1', category: 'fraud', statement: 'Fraud likely', priorProbability: 0.5, posteriorProbability: 0.5, evidenceFor: ['e1'], evidenceAgainst: [], status: 'active' },
    ];

    const graph = buildCognitiveReasoningGraph({ captured, evidenceItems: evidence, hypotheses });
    expect(graph.nodes.length).toBeGreaterThan(3);
    expect(graph.edges.some((edge) => edge.type === 'supports')).toBe(true);
    expect(graph.edges.some((edge) => edge.type === 'belongs_to')).toBe(true);
  });

  it('discovers contradictory evidence and reduces belief', () => {
    const captured = makeCaptured();
    const evidence: EvidenceItem[] = [
      { id: 'e1', modality: 'text', label: 'urgent_request', description: 'Urgent request detected', confidence: 0.8, reliability: 0.9, importance: 0.8, direction: 'supports', source: 'text', affectedCategories: ['fraud'] },
      { id: 'e2', modality: 'metadata', label: 'legitimate_transfer', description: 'Payment was verified', confidence: 0.9, reliability: 0.85, importance: 0.85, direction: 'contradicts', source: 'metadata', affectedCategories: ['fraud'] },
    ];
    const hypotheses: Hypothesis[] = [
      { id: 'h1', category: 'fraud', statement: 'Fraud likely', priorProbability: 0.7, posteriorProbability: 0.7, evidenceFor: ['e1'], evidenceAgainst: ['e2'], status: 'active' },
    ];

    const graph = buildCognitiveReasoningGraph({ captured, evidenceItems: evidence, hypotheses });
    const analysis = analyzeCognitiveReasoningGraph(graph, evidence, hypotheses);

    expect(analysis.contradictions.length).toBeGreaterThan(0);
    expect(analysis.revisedHypotheses[0].posteriorProbability).toBeLessThan(0.7);
  });

  it('generates alternative interpretations when multiple hypotheses compete', () => {
    const captured = makeCaptured('A suspicious request appears alongside a harmless help request');
    const evidence: EvidenceItem[] = [
      { id: 'e1', modality: 'text', label: 'suspicious_request', description: 'Suspicious request', confidence: 0.65, reliability: 0.8, importance: 0.75, direction: 'supports', source: 'text', affectedCategories: ['fraud'] },
      { id: 'e2', modality: 'text', label: 'help_request', description: 'Harmless help request', confidence: 0.6, reliability: 0.7, importance: 0.7, direction: 'supports', source: 'text', affectedCategories: ['education'] },
    ];
    const hypotheses: Hypothesis[] = [
      { id: 'h1', category: 'fraud', statement: 'Fraud likely', priorProbability: 0.45, posteriorProbability: 0.45, evidenceFor: ['e1'], evidenceAgainst: [], status: 'active' },
      { id: 'h2', category: 'education', statement: 'Educational/legitimate request', priorProbability: 0.4, posteriorProbability: 0.4, evidenceFor: ['e2'], evidenceAgainst: [], status: 'active' },
    ];

    const graph = buildCognitiveReasoningGraph({ captured, evidenceItems: evidence, hypotheses });
    const analysis = analyzeCognitiveReasoningGraph(graph, evidence, hypotheses);

    expect(analysis.alternativeExplanations.length).toBeGreaterThan(0);
    expect(analysis.revisedHypotheses.some((h) => h.status === 'uncertain')).toBe(true);
  });

  it('revise beliefs when context changes', () => {
    const base = makeCaptured('A medical note about treatment options');
    const evidence: EvidenceItem[] = [
      { id: 'e1', modality: 'text', label: 'medical_context', description: 'Medical context', confidence: 0.75, reliability: 0.8, importance: 0.8, direction: 'supports', source: 'text', affectedCategories: ['medical'] },
    ];
    const hypotheses: Hypothesis[] = [
      { id: 'h1', category: 'violence', statement: 'Violence likely', priorProbability: 0.6, posteriorProbability: 0.6, evidenceFor: ['e1'], evidenceAgainst: [], status: 'active' },
    ];

    const graphA = buildCognitiveReasoningGraph({ captured: base, evidenceItems: evidence, hypotheses, contextHints: ['medical'] });
    const analysisA = analyzeCognitiveReasoningGraph(graphA, evidence, hypotheses);

    const graphB = buildCognitiveReasoningGraph({ captured: base, evidenceItems: evidence, hypotheses, contextHints: ['threat'] });
    const analysisB = analyzeCognitiveReasoningGraph(graphB, evidence, hypotheses);

    expect(analysisA.revisedHypotheses[0].posteriorProbability).toBeLessThanOrEqual(analysisB.revisedHypotheses[0].posteriorProbability + 0.01);
  });
});
