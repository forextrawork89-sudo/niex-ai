import type { ASRAdapter, ASRRequestOptions, TranscriptResult } from './types';

export class OnnxWhisperAdapter implements ASRAdapter {
  providerName = 'onnx-whisper';

  isAvailable(): boolean {
    return false;
  }

  async transcribe(source: string | File | Blob, options?: ASRRequestOptions): Promise<TranscriptResult> {
    throw new Error('ONNX Whisper adapter not implemented in this environment.');
  }
}
