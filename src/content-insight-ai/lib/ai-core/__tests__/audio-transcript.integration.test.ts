import { describe, expect, it } from 'vitest';
import { processContent } from '../orchestrator';

describe('AI Core audio transcript integration', () => {
  it('uses structured transcript data without transcribing itself', async () => {
    const result = await processContent({
      requestId: 'audio-test-1',
      audioSource: 'audio.wav',
      transcript: {
        transcript: 'This is the spoken text from ASR.',
        language: 'en',
        confidence: 0.92,
        segments: [{ text: 'This is the spoken text from ASR.', startTime: 0, endTime: 4, confidence: 0.92 }],
        speakers: ['speaker1'],
      },
      metadata: { source: 'test' },
      contentType: 'audio',
    });

    expect(result.success).toBe(true);
    expect(result.capturedContent?.text).toContain('This is the spoken text from ASR.');
    expect(result.capturedContent?.metadata?.transcript).toBeDefined();
    expect((result.capturedContent?.metadata?.transcript as any).language).toBe('en');
  });
});
