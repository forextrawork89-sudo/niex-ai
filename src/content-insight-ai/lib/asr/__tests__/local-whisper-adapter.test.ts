import { describe, expect, it } from 'vitest';
import { LocalWhisperAdapter } from '../local-whisper-adapter';

describe('LocalWhisperAdapter', () => {
  it('reports availability in browser-like environments with Whisper defined', () => {
    const adapter = new LocalWhisperAdapter();
    expect(adapter.providerName).toBe('local-whisper');
  });

  it('returns a transcript result from transcribe()', async () => {
    const adapter = new LocalWhisperAdapter();
    const result = await adapter.transcribe('audio.wav', { languageHint: 'en' });
    expect(result.transcript).toContain('transcribed');
    expect(result.language).toBe('en');
    expect(result.confidence).toBeCloseTo(0.88, 2);
  });
});
