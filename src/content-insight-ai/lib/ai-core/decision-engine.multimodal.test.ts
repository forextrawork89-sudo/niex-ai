import { describe, it, expect } from 'vitest';
import { makeDecision } from './decision-engine';
import type { EvidenceCollectionResult, ReasoningResult, ConfidenceResult, HypothesisResult } from './types';

function makeEvidenceItem(overrides: any) {
  const now = new Date().toISOString();
  return {
    id: `e-${Math.random().toString(36).slice(2, 8)}`,
    modality: overrides.modality || 'vision',
    label: overrides.label || 'test_signal',
    description: overrides.description || '',
    confidence: overrides.confidence ?? 0.5,
    reliability: overrides.reliability ?? 0.7,
    importance: overrides.importance ?? 0.6,
    direction: overrides.direction || 'supports',
    source: overrides.source || 'test',
    affectedCategories: overrides.affectedCategories || [],
    signal: overrides.signal || overrides.label || 'test_signal',
    language: 'en',
    context: overrides.context || [],
    provenance: overrides.provenance || 'test',
    createdAt: now,
  };
}

function baseInputs(evidenceItems: any[]): { reasoning: ReasoningResult; confidence: ConfidenceResult; hypotheses: HypothesisResult; evidence: EvidenceCollectionResult } {
  return {
    reasoning: { success: true, conclusion: { verdict: 'uncertain', answer: '', confidence: 0.4, alternativeInterpretations: [], uncertaintyReasons: [], hypothesisSummary: '' }, hypotheses: [], supportingEvidence: [], contradictingEvidence: [], neutralEvidence: [], reasoningSteps: [], summary: '', warnings: [], errors: [], durationMs: 0, logs: [] },
    confidence: { success: true, breakdown: { evidenceConfidence: 0.4, hypothesisConfidence: 0.4, consistencyScore: 0.8, uncertaintyPenalty: 0.1, finalConfidence: 0.5 }, summary: '', warnings: [], errors: [], durationMs: 0, logs: [] },
    hypotheses: { success: true, hypotheses: [], summary: '', warnings: [], errors: [], durationMs: 0, logs: [] },
    evidence: { success: true, evidenceItems, summary: '', warnings: [], errors: [], durationMs: 0, logs: [] },
  };
}

describe('Decision engine multimodal calibration', () => {
  it('does not block for a single weak visual signal', () => {
    const ev = [makeEvidenceItem({ confidence: 0.28, modality: 'vision', label: 'vision_nsfw_signal', signal: 'vision_nsfw', affectedCategories: ['pornography'] })];
    const { reasoning, confidence, hypotheses, evidence } = baseInputs(ev);
    confidence.breakdown.finalConfidence = 0.45;
    const result = makeDecision(reasoning, confidence, hypotheses, evidence as any);
    expect(result.verdict).not.toBe('harmful');
    expect(result.recommendedAction).not.toBe('block');
  });

  it('raises risk with two independent visual signals', () => {
    const ev = [
      makeEvidenceItem({ confidence: 0.5, modality: 'vision', label: 'vision_nsfw_signal', signal: 'vision_nsfw', affectedCategories: ['pornography'] }),
      makeEvidenceItem({ confidence: 0.52, modality: 'vision', label: 'vision_movement_movement_sustained_presentation', signal: 'movement_sustained_presentation', affectedCategories: ['pornography'] }),
    ];
    const { reasoning, confidence, hypotheses, evidence } = baseInputs(ev);
    confidence.breakdown.finalConfidence = 0.6;
    const result = makeDecision(reasoning, confidence, hypotheses, evidence as any);
    expect(result.verdict).toBe('harmful');
    expect(result.recommendedAction).toBe('block');
  });

  it('boosts confidence when visual and semantic corroborate', () => {
    const ev = [
      makeEvidenceItem({ confidence: 0.5, modality: 'vision', label: 'vision_clothing_clothing_transition_detected', signal: 'clothing_transition_detected', affectedCategories: ['pornography'] }),
      makeEvidenceItem({ confidence: 0.6, modality: 'text', label: 'semantic_signal_suggestive_bait', signal: 'suggestive_bait', affectedCategories: ['pornography'], direction: 'supports' }),
    ];
    const { reasoning, confidence, hypotheses, evidence } = baseInputs(ev);
    confidence.breakdown.finalConfidence = 0.55;
    const result = makeDecision(reasoning, confidence, hypotheses, evidence as any);
    expect(result.verdict).toBe('harmful');
  });

  it('requires temporal persistence to strengthen single-frame weak signals', () => {
    const ev = [
      makeEvidenceItem({ confidence: 0.4, modality: 'vision', label: 'vision_nsfw_signal', signal: 'vision_nsfw', affectedCategories: ['pornography'] }),
      makeEvidenceItem({ confidence: 0.45, modality: 'vision', label: 'vision_camera_focus_camera_focus_persistent_view', signal: 'camera_focus_persistent_view', affectedCategories: ['pornography'] }),
      makeEvidenceItem({ confidence: 0.6, modality: 'vision', label: 'temporal_video_risk', signal: 'temporal_video_risk', affectedCategories: ['pornography'] }),
    ];
    const { reasoning, confidence, hypotheses, evidence } = baseInputs(ev);
    confidence.breakdown.finalConfidence = 0.6;
    const result = makeDecision(reasoning, confidence, hypotheses, evidence as any);
    expect(result.verdict).toBe('harmful');
  });

  it('downgrades when safe educational context present', () => {
    const ev = [
      makeEvidenceItem({ confidence: 0.6, modality: 'vision', label: 'vision_movement_movement_sustained_presentation', signal: 'movement_sustained_presentation', affectedCategories: ['pornography'] }),
      makeEvidenceItem({ confidence: 0.7, modality: 'text', label: 'semantic_content_class_educational', signal: 'educational', direction: 'contradicts', affectedCategories: ['education'] }),
    ];
    const { reasoning, confidence, hypotheses, evidence } = baseInputs(ev);
    confidence.breakdown.finalConfidence = 0.62;
    const result = makeDecision(reasoning, confidence, hypotheses, evidence as any);
    expect(result.verdict).not.toBe('harmful');
  });

  it('requires corroborated multimodal evidence before blocking a fashion/editorial-like context', () => {
    const ev = [
      makeEvidenceItem({ confidence: 0.42, modality: 'vision', label: 'vision_pose_estimator_fashion_editorial', signal: 'pose_fashion/editorial', affectedCategories: ['social'] }),
      makeEvidenceItem({ confidence: 0.38, modality: 'vision', label: 'vision_clothing_fashion_editorial', signal: 'clothing_fashion_editorial', affectedCategories: ['fashion'] }),
      makeEvidenceItem({ confidence: 0.72, modality: 'text', label: 'semantic_content_class_safe', signal: 'safe', direction: 'contradicts', affectedCategories: ['education'] }),
    ];
    const { reasoning, confidence, hypotheses, evidence } = baseInputs(ev);
    confidence.breakdown.finalConfidence = 0.58;
    const result = makeDecision(reasoning, confidence, hypotheses, evidence as any);
    expect(result.verdict).not.toBe('harmful');
  });

  it('handles contradictory evidence without overblocking', () => {
    const ev = [
      makeEvidenceItem({ confidence: 0.7, modality: 'vision', label: 'vision_clothing_clothing_transition_detected', signal: 'clothing_transition_detected', affectedCategories: ['pornography'] }),
      makeEvidenceItem({ confidence: 0.7, modality: 'text', label: 'semantic_content_class_safe', signal: 'safe', direction: 'contradicts', affectedCategories: ['education'] }),
    ];
    const { reasoning, confidence, hypotheses, evidence } = baseInputs(ev);
    confidence.breakdown.finalConfidence = 0.7;
    const result = makeDecision(reasoning, confidence, hypotheses, evidence as any);
    expect(result.verdict).not.toBe('harmful');
  });

  it('classifies clearly harmful content', () => {
    const ev = [
      makeEvidenceItem({ confidence: 0.9, modality: 'text', label: 'semantic_intent_harmful_explicit', signal: 'intent_harmful_explicit', direction: 'supports', affectedCategories: ['pornography'] }),
      makeEvidenceItem({ confidence: 0.85, modality: 'vision', label: 'vision_nsfw_signal', signal: 'vision_nsfw', affectedCategories: ['pornography'] }),
    ];
    const { reasoning, confidence, hypotheses, evidence } = baseInputs(ev);
    confidence.breakdown.finalConfidence = 0.9;
    const result = makeDecision(reasoning, confidence, hypotheses, evidence as any);
    expect(result.verdict).toBe('harmful');
    expect(result.recommendedAction).toBe('block');
  });
});
