import { describe, expect, it, beforeAll } from 'vitest';
import { registerASRAdapter, listASRProviders, getASRAdapter, transcribeWithFallback } from '../../asr/registry';
import { LocalWhisperAdapter } from '../../asr/local-whisper-adapter';
import { FasterWhisperAdapter } from '../../asr/faster-whisper-adapter';
import { OnnxWhisperAdapter } from '../../asr/onnx-whisper-adapter';
import { TestASRAdapter } from '../../asr/test-adapter';

const sampleAudio = 'sample-audio.wav';

describe('ASR adapter registry', () => {
  beforeAll(() => {
    registerASRAdapter(new LocalWhisperAdapter());
    registerASRAdapter(new FasterWhisperAdapter());
    registerASRAdapter(new OnnxWhisperAdapter());
    registerASRAdapter(new TestASRAdapter());
  });

  it('registers ASR providers and lists them', () => {
    const providers = listASRProviders();
    expect(providers).toContain('local-whisper');
    expect(providers).toContain('faster-whisper');
    expect(providers).toContain('onnx-whisper');
  });

  it('returns an adapter by name', () => {
    const adapter = getASRAdapter('local-whisper');
    expect(adapter).not.toBeNull();
    expect(adapter?.providerName).toBe('local-whisper');
  });

  it('transcribes with fallback to available provider', async () => {
    const result = await transcribeWithFallback(sampleAudio, {
      providerOrder: ['faster-whisper', 'onnx-whisper', 'local-whisper', 'test-asr'],
      requestOptions: { languageHint: 'en' },
    });

    expect(result.transcript).toContain('transcript output');
    expect(result.language).toBe('en');
    expect(result.metadata?.asr_provider).toBe('test-asr');
    expect(result.metadata?.asr_tried).toBeDefined();
  });
});
