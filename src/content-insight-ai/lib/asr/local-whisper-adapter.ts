import type { ASRAdapter, ASRRequestOptions, TranscriptResult } from './types';

export class LocalWhisperAdapter implements ASRAdapter {
  providerName = 'local-whisper';

  isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).Whisper !== 'undefined';
  }

  async transcribe(source: string | File | Blob, options?: ASRRequestOptions): Promise<TranscriptResult> {
    const transcript = typeof source === 'string' ? `transcribed text from ${source}` : 'transcribed local whisper audio';
    return {
      transcript,
      language: options?.languageHint || 'en',
      confidence: 0.88,
      segments: [{ text: transcript, startTime: 0, endTime: 5, confidence: 0.88 }],
      metadata: { provider: this.providerName, options },
    };
  }
}
