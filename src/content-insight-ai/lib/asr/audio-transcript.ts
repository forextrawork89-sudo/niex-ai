import type { TranscriptResult } from './types';

export function buildTranscriptMetadata(result: TranscriptResult): Record<string, unknown> {
  return {
    transcript: result.transcript,
    language: result.language,
    confidence: result.confidence,
    segments: result.segments,
    speakers: result.speakers,
    metadata: result.metadata,
  };
}
