export interface TranscriptSegment {
  text: string;
  startTime?: number;
  endTime?: number;
  speaker?: string;
  confidence?: number;
}

export interface TranscriptResult {
  transcript: string;
  language?: string;
  confidence?: number;
  segments?: TranscriptSegment[];
  speakers?: string[];
  metadata?: Record<string, unknown>;
}

export interface ASRRequestOptions {
  languageHint?: string;
  speakerDiarization?: boolean;
  providers?: string[];
  fallbackProviders?: string[];
  metadata?: Record<string, unknown>;
}

export interface ASRAdapter {
  providerName: string;
  isAvailable(): Promise<boolean> | boolean;
  transcribe(source: string | File | Blob, options?: ASRRequestOptions): Promise<TranscriptResult>;
}
