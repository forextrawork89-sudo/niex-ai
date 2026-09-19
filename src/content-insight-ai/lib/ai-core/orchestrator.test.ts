import { describe, expect, it } from 'vitest';
import { processContent } from './orchestrator';
import { collectEvidence } from './evidence-collector';
import type { CapturedContent } from './types';
import type { NormalizedKnowledgeItem } from '../kb-builder/types';

describe('AI Core orchestrator', () => {
  it('produces a block decision for explicit harmful text', async () => {
    const result = await processContent({
      requestId: 'test-1',
      text: 'Download explicit pornographic videos and join the adult content community now.',
      contentType: 'text',
      metadata: { source: 'test' },
    });

    console.log('DEBUG_RESULT', JSON.stringify({
        verdict: result.decisionResult?.verdict,
        finalConfidence: result.confidenceResult?.breakdown.finalConfidence,
        reasoningVerdict: result.reasoningResult?.conclusion.verdict,
        reasoningConfidence: result.reasoningResult?.conclusion.confidence,
        topHypothesis: result.hypothesisResult?.hypotheses?.[0],
        hypotheses: result.hypothesisResult?.hypotheses?.slice(0, 4).map((h) => ({ id: h.id, category: h.category, posteriorProbability: h.posteriorProbability, status: h.status })),
        evidenceItems: result.evidenceResult?.evidenceItems.map((item) => ({ id: item.id, label: item.label, direction: item.direction, confidence: item.confidence, importance: item.importance, affectedCategories: item.affectedCategories }))
      }, null, 2));
    expect(result.success).toBe(true);
    expect(result.decisionResult?.verdict).toBe('harmful');
    expect(result.policyResult?.action).toBe('block');
    expect(result.confidenceResult?.breakdown.finalConfidence).toBeGreaterThan(0.75);
  });

  it('does not block ambiguous educational text', async () => {
    const result = await processContent({
      requestId: 'test-2',
      text: 'This article explains how to prevent sexual exploitation and protect children in a medical education context.',
      contentType: 'text',
      metadata: { source: 'test' },
    });

    console.log('DEBUG_AMBIGUOUS', JSON.stringify({
      verdict: result.decisionResult?.verdict,
      action: result.policyResult?.action,
      finalConfidence: result.confidenceResult?.breakdown.finalConfidence,
      reasoningVerdict: result.reasoningResult?.conclusion.verdict,
      reasoningConfidence: result.reasoningResult?.conclusion.confidence,
      topHypothesis: result.hypothesisResult?.hypotheses?.[0],
      evidenceItems: result.evidenceResult?.evidenceItems.map((item) => ({ label: item.label, direction: item.direction, confidence: item.confidence, affectedCategories: item.affectedCategories }))
    }, null, 2));

    expect(result.success).toBe(true);
    expect(result.policyResult?.action).not.toBe('block');
    expect(result.decisionResult?.verdict).not.toBe('harmful');
  });

  it('uses KB-derived gambling signals to raise risk before final policy', async () => {
    const kbSeed: NormalizedKnowledgeItem[] = [
      {
        id: 'kb-gambling-1',
        source: 'test-seed',
        category: 'gambling',
        subcategory: 'betting',
        concepts: ['casino', 'bet', 'jackpot'],
        entities: ['casino'],
        relationships: [],
        context: ['online gambling promotion'],
        intent: 'harmful',
        evidence: [{ source: 'test-seed', snippet: 'online casino promotions', confidence: 0.95 }],
        confidence: 0.95,
        language: 'en',
        risk: 'high',
        tags: ['gambling', 'risk'],
        timestamps: { createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        metadata: {},
      },
    ];

    const result = await processContent({
      requestId: 'test-3',
      text: 'This is a simple message about a casino bonus and betting tips.',
      contentType: 'text',
      metadata: { source: 'test' },
      knowledgeBaseItems: kbSeed,
    }, undefined as any);

    expect(result.success).toBe(true);
    expect(result.kbBuilderResult?.success).toBe(true);
    expect(result.decisionResult?.verdict).toBe('harmful');
    expect(result.policyResult?.action).toBe('block');
    expect(result.confidenceResult?.breakdown.finalConfidence).toBeGreaterThan(0.55);
  });

  it('ignores low-relevance KB noise from safe generic matches', () => {
    const captured: CapturedContent = {
      text: 'This article explains how to prevent sexual exploitation and protect children in a medical education context.',
      hasText: true,
      hasImage: false,
      hasVideo: false,
      hasAudio: false,
      textLength: 120,
      contentType: 'text',
      sourceSummary: 'text',
      metadata: {
        knowledgeBaseItems: [{
          id: 'kb-noise-1',
          source: 'test-seed',
          category: 'generic',
          subcategory: 'json',
          concepts: ['context', 'article', 'medical'],
          entities: ['medical'],
          relationships: [],
          context: ['general knowledge'],
          intent: 'safe',
          evidence: [{ source: 'test-seed', snippet: 'safe general knowledge', confidence: 0.35 }],
          confidence: 0.35,
          language: 'en',
          risk: 'low',
          tags: ['safe', 'generic'],
          timestamps: { createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
          metadata: {},
        } as NormalizedKnowledgeItem],
      },
    } as CapturedContent;

    const result = collectEvidence(captured);
    const kbEvidence = result.evidenceItems.filter((item) => String(item.label || '').startsWith('kb_match_'));

    expect(result.success).toBe(true);
    expect(kbEvidence).toHaveLength(0);
  });

  it('captures combined suggestive social trend evidence from Uzbek-style text', () => {
    const result = collectEvidence({
      text: "Yashirin video: maxsus taklif va hashtag challenge bilan ko'proq ko'ring.",
      textLength: 76,
      hasText: true,
      hasImage: false,
      hasVideo: false,
      hasAudio: false,
      metadata: { source: 'test' },
      contentType: 'text',
      sourceSummary: 'text',
    });

    expect(result.success).toBe(true);
    expect(result.evidenceItems.some((item) => item.label === 'combined_suggestive_trend')).toBe(true);
    expect(result.evidenceItems.some((item) => /sexual[_-]?suggestive/i.test(String(item.signal)) || /suggestive[_-]?bait/i.test(String(item.signal)))).toBe(true);
    expect(result.evidenceItems.some((item) => item.signal === 'social_media')).toBe(true);
  });

  it('creates a combined suspicious multimodal signal for suggestive Uzbek social content', () => {
    const result = collectEvidence({
      text: "Yashirin video: tiktok challenge, tight frame va sexy pose bilan ko'proq ko'ring.",
      textLength: 96,
      hasText: true,
      hasImage: false,
      hasVideo: false,
      hasAudio: false,
      metadata: { source: 'test' },
      contentType: 'text',
      sourceSummary: 'text',
    });

    expect(result.success).toBe(true);
    expect(result.evidenceItems.some((item) => item.label === 'combined_suspicious_multimodal')).toBe(true);
    expect(result.evidenceItems.some((item) => item.affectedCategories?.includes('pornography'))).toBe(true);
    expect(result.evidenceItems.some((item) => item.direction === 'supports' && item.label === 'combined_suspicious_multimodal')).toBe(true);
  });
});
