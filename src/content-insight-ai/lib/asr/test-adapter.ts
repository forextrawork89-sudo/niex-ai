import type { ASRAdapter, ASRRequestOptions, TranscriptResult } from './types';

export class TestASRAdapter implements ASRAdapter {
  providerName = 'test-asr';

  isAvailable(): boolean {
    return true;
  }

  async transcribe(source: string | File | Blob, options?: ASRRequestOptions): Promise<TranscriptResult> {
    return {
      transcript: 'test transcript output',
      language: options?.languageHint || 'en',
      confidence: 0.99,
      segments: [{ text: 'test transcript output', startTime: 0, endTime: 2, confidence: 0.99 }],
      metadata: { provider: this.providerName },
    };
  }
}
