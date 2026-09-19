import { registerASRAdapter, transcribeWithFallback } from './registry';
import { LocalWhisperAdapter } from './local-whisper-adapter';
import { FasterWhisperAdapter } from './faster-whisper-adapter';
import { OnnxWhisperAdapter } from './onnx-whisper-adapter';
import type { ASRRequestOptions, TranscriptResult } from './types';

let defaultAdaptersInitialized = false;

export function initDefaultASRAdapters(): void {
  if (defaultAdaptersInitialized) return;
  registerASRAdapter(new LocalWhisperAdapter());
  registerASRAdapter(new FasterWhisperAdapter());
  registerASRAdapter(new OnnxWhisperAdapter());
  defaultAdaptersInitialized = true;
}

export async function transcribeAudio(
  source: string | File | Blob,
  options: { providerOrder?: string[]; fallbackOrder?: string[]; requestOptions?: ASRRequestOptions } = {},
): Promise<TranscriptResult> {
  initDefaultASRAdapters();
  const providerOrder = options.providerOrder ?? ['local-whisper', 'faster-whisper', 'onnx-whisper'];
  return transcribeWithFallback(source, {
    providerOrder,
    fallbackOrder: options.fallbackOrder,
    requestOptions: options.requestOptions,
  });
}
