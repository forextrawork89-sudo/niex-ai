import { describe, expect, it } from 'vitest';
import { buildDiagnosticEvaluation } from './diagnostic-lab';
import type { AiCoreResult } from './ai-core/types';

describe('diagnostic lab', () => {
  it('surfaces why harmful content was blocked with evidence-derived reasons', () => {
    const aiCoreResult: AiCoreResult = {
      success: true,
      requestId: 'diag-1',
      evidenceResult: {
        success: true,
        evidenceItems: [
          {
            id: '1',
            modality: 'text',
            label: 'semantic_intent_harmful_explicit',
            description: 'Explicit harmful intent',
            confidence: 0.93,
            reliability: 0.9,
            importance: 0.95,
            direction: 'supports',
            source: 'semantic',
            affectedCategories: ['pornography'],
            signal: 'intent_harmful_explicit',
            language: 'en',
            context: ['harmful'],
            provenance: 'semantic_analyzer',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            modality: 'metadata',
            label: 'kb_match_pornography',
            description: 'KB match',
            confidence: 0.8,
            reliability: 0.75,
            importance: 0.8,
            direction: 'supports',
            source: 'knowledge_base',
            affectedCategories: ['pornography'],
            signal: 'kb_pornography',
            language: 'en',
            context: ['kb'],
            provenance: 'knowledge_base',
            createdAt: new Date().toISOString(),
          },
        ],
        summary: '',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      hypothesisResult: {
        success: true,
        hypotheses: [{ id: 'h1', category: 'pornography', statement: 'Pornography', priorProbability: 0.95, posteriorProbability: 0.99, evidenceFor: ['1'], evidenceAgainst: [], status: 'active' }],
        summary: '',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      reasoningResult: {
        success: true,
        conclusion: { verdict: 'harmful', answer: '', confidence: 0.95, alternativeInterpretations: [], uncertaintyReasons: [], hypothesisSummary: '' },
        hypotheses: [],
        supportingEvidence: [],
        contradictingEvidence: [],
        neutralEvidence: [],
        reasoningSteps: [{ id: 1, type: 'assess', description: 'Explicit harmful intent detected', confidence: 0.95, durationMs: 0, evidenceIds: ['1'] }],
        summary: '',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      confidenceResult: {
        success: true,
        breakdown: { evidenceConfidence: 0.9, hypothesisConfidence: 0.95, consistencyScore: 0.9, uncertaintyPenalty: 0.05, finalConfidence: 0.95 },
        summary: '',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      decisionResult: {
        success: true,
        verdict: 'harmful',
        recommendedAction: 'block',
        rationale: 'Explicit harmful intent was detected.',
        primaryHypothesis: undefined,
        confidence: 0.95,
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      policyResult: {
        success: true,
        action: 'block',
        policyTier: 'strict',
        requiresHumanReview: false,
        confidence: 0.95,
        explanation: 'Policy blocked harmful content.',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      browserActionResult: {
        success: true,
        payload: {
          action: 'block',
          title: 'Block',
          message: 'Policy blocked harmful content.',
          confidence: 0.95,
          trace: 'diag-1',
          details: {},
        },
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      metrics: { requestId: 'diag-1', totalDurationMs: 0, captureDurationMs: 0, evidenceDurationMs: 0, hypothesisDurationMs: 0, reasoningDurationMs: 0, confidenceDurationMs: 0, decisionDurationMs: 0, policyDurationMs: 0, browserActionDurationMs: 0, attempts: {}, errors: 0, warnings: 0 },
      logs: [],
    };

    const diagnostic = buildDiagnosticEvaluation({
      text: 'Explicit pornographic content',
      contentType: 'text',
      aiCoreResult,
      metadata: {},
    });

    expect(diagnostic.verdict).toBe('harmful');
    expect(diagnostic.whyBlocked).toContainEqual(expect.stringContaining('explicit harmful intent'));
    expect(diagnostic.detectedCategories).toContain('pornography');
    expect(diagnostic.signalTimeline.some((step) => step.stage === 'KB RETRIEVAL')).toBe(true);
  });

  it('explains why safe educational content was allowed', () => {
    const aiCoreResult: AiCoreResult = {
      success: true,
      requestId: 'diag-2',
      evidenceResult: {
        success: true,
        evidenceItems: [
          {
            id: '3',
            modality: 'text',
            label: 'semantic_content_class_educational',
            description: 'Educational context',
            confidence: 0.7,
            reliability: 0.8,
            importance: 0.75,
            direction: 'contradicts',
            source: 'semantic',
            affectedCategories: ['education'],
            signal: 'educational',
            language: 'en',
            context: ['safe'],
            provenance: 'semantic_analyzer',
            createdAt: new Date().toISOString(),
          },
        ],
        summary: '',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      hypothesisResult: {
        success: true,
        hypotheses: [],
        summary: '',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      reasoningResult: {
        success: true,
        conclusion: { verdict: 'safe', answer: '', confidence: 0.8, alternativeInterpretations: [], uncertaintyReasons: [], hypothesisSummary: '' },
        hypotheses: [],
        supportingEvidence: [],
        contradictingEvidence: [],
        neutralEvidence: [],
        reasoningSteps: [],
        summary: '',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      confidenceResult: {
        success: true,
        breakdown: { evidenceConfidence: 0.7, hypothesisConfidence: 0.5, consistencyScore: 0.9, uncertaintyPenalty: 0.05, finalConfidence: 0.8 },
        summary: '',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      decisionResult: {
        success: true,
        verdict: 'safe',
        recommendedAction: 'allow',
        rationale: 'Safe educational context.',
        primaryHypothesis: undefined,
        confidence: 0.8,
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      policyResult: {
        success: true,
        action: 'allow',
        policyTier: 'balanced',
        requiresHumanReview: false,
        confidence: 0.8,
        explanation: 'Policy allowed safe content.',
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      browserActionResult: {
        success: true,
        payload: {
          action: 'allow',
          title: 'Allow',
          message: 'Policy allowed safe content.',
          confidence: 0.8,
          trace: 'diag-2',
          details: {},
        },
        warnings: [],
        errors: [],
        durationMs: 0,
        logs: [],
      },
      metrics: { requestId: 'diag-2', totalDurationMs: 0, captureDurationMs: 0, evidenceDurationMs: 0, hypothesisDurationMs: 0, reasoningDurationMs: 0, confidenceDurationMs: 0, decisionDurationMs: 0, policyDurationMs: 0, browserActionDurationMs: 0, attempts: {}, errors: 0, warnings: 0 },
      logs: [],
    };

    const diagnostic = buildDiagnosticEvaluation({ text: 'This is an educational article about prevention.', contentType: 'text', aiCoreResult, metadata: {} });

    expect(diagnostic.verdict).toBe('safe');
    expect(diagnostic.whyAllowed.some((reason) => reason.toLowerCase().includes('educational'))).toBe(true);
    expect(diagnostic.detectedCategories).toContain('education');
  });
});
