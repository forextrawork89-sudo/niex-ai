import type { ASRAdapter, ASRRequestOptions, TranscriptResult } from './types';

export class FasterWhisperAdapter implements ASRAdapter {
  providerName = 'faster-whisper';

  isAvailable(): boolean {
    return false;
  }

  async transcribe(source: string | File | Blob, options?: ASRRequestOptions): Promise<TranscriptResult> {
    throw new Error('Faster-Whisper adapter not implemented in this environment.');
  }
}
