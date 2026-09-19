import { describe, expect, it } from 'vitest';
import { collectEvidence } from '../evidence-collector';

describe('Temporal video evidence', () => {
  it('adds temporal video evidence for suspicious video sequences', () => {
    const result = collectEvidence({
      text: 'short video clip with suggestive challenge',
      textLength: 40,
      hasText: true,
      hasImage: false,
      hasVideo: true,
      hasAudio: false,
      metadata: {
        videoAnalysis: {
          temporal_evidence: {
            temporal_risk_score: 0.72,
            temporal_reasons: ['3 frames showed elevated suspicious evidence', 'scene changes detected'],
          },
        },
      },
      contentType: 'video',
      sourceSummary: 'video',
    });

    expect(result.success).toBe(true);
    expect(result.evidenceItems.some((item) => item.label === 'temporal_video_risk')).toBe(true);
    expect(result.evidenceItems.some((item) => item.label === 'temporal_video_context')).toBe(true);
  });
});
