import type { AiCoreInput, CaptureResult, CapturedContent, Logger } from './types';
import { nullLogger } from './types';
import { createLogEntry, normalizeText, safeLog } from './helpers';

const MAX_DURATION_MS = 200;

export function captureContent(input: AiCoreInput, logger: Logger = nullLogger): CaptureResult {
  const start = Date.now();
  const logs = [] as ReturnType<typeof createLogEntry>[];
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Prefer explicit text; if missing, try pulling OCR/DOM/text-like fields from metadata
    let rawText = '';
    if (typeof input.text === 'string' && input.text.trim().length > 0) rawText = input.text;
    // Known metadata fields that may contain pre-extracted text
    if (input.metadata) {
      const m = input.metadata as Record<string, any>;
      if (!rawText && typeof m.ocr_text === 'string' && m.ocr_text.trim().length > 0) rawText = m.ocr_text;
      if (!rawText && typeof m.dom_text === 'string' && m.dom_text.trim().length > 0) rawText = m.dom_text;
      if (!rawText && typeof m.innerText === 'string' && m.innerText.trim().length > 0) rawText = m.innerText;
      if (!rawText && typeof m.page_title === 'string' && m.page_title.trim().length > 0) rawText = m.page_title;
      if (!rawText && typeof m.url === 'string' && m.url.trim().length > 0) rawText = m.url;
      // Arrays
      if (!rawText && Array.isArray(m.alt_texts) && m.alt_texts.length) rawText = String(m.alt_texts.join(' '));
      if (!rawText && Array.isArray(m.aria_labels) && m.aria_labels.length) rawText = String(m.aria_labels.join(' '));
      if (!rawText && Array.isArray(m.captions) && m.captions.length) rawText = String(m.captions.join(' '));
      if (!rawText && typeof m.transcript === 'string' && m.transcript.trim().length > 0) rawText = m.transcript;
      if (!rawText && typeof m.captions === 'string' && m.captions.trim().length > 0) rawText = m.captions;
      if (!rawText && typeof m.audio_transcript === 'string' && m.audio_transcript.trim().length > 0) rawText = m.audio_transcript;
    }
    if (!rawText && input.transcript && typeof input.transcript.transcript === 'string' && input.transcript.transcript.trim().length > 0) {
      rawText = input.transcript.transcript;
    }
    const text = normalizeText(rawText || input.text || '');
    const contentType = input.contentType ||
      (input.videoSource ? 'video' : input.imageSource ? 'image' : input.audioSource ? 'audio' : text ? 'text' : 'unknown');
    const captured: CapturedContent = {
      text,
      textLength: text.length,
      hasText: text.length > 0,
      hasImage: !!input.imageSource,
      hasVideo: !!input.videoSource,
      hasAudio: !!input.audioSource,
      metadata: input.metadata || {},
      contentType,
      sourceSummary: [
        input.text ? 'text' : null,
        input.imageSource ? 'image' : null,
        input.videoSource ? 'video' : null,
        input.audioSource ? 'audio' : null,
      ].filter(Boolean).join(', ') || 'none',
    };

    logs.push(createLogEntry('content-capture', 'info', 'Content capture completed.', {
      requestId: input.requestId,
      contentType,
      sourceSummary: captured.sourceSummary,
    }));
    safeLog(logger, 'info', 'content-capture', 'Content capture completed.', {
      requestId: input.requestId,
      contentType,
      sourceSummary: captured.sourceSummary,
    });

    if (!captured.hasText && !captured.hasImage && !captured.hasVideo && !captured.hasAudio) {
      warnings.push('No content was present in the input.');
      logs.push(createLogEntry('content-capture', 'warn', 'No content was provided in the request.'));
      safeLog(logger, 'warn', 'content-capture', 'No content was provided in the request.');
    }

    const durationMs = Date.now() - start;
    if (durationMs > MAX_DURATION_MS) {
      warnings.push('Content capture exceeded expected duration.');
      logs.push(createLogEntry('content-capture', 'warn', 'Content capture exceeded expected duration.', { durationMs }));
      safeLog(logger, 'warn', 'content-capture', 'Content capture exceeded expected duration.', { durationMs });
    }

    return {
      success: true,
      captured,
      warnings,
      errors,
      entities: [],
      relations: [],
      contextMemory: {},
      worldKnowledge: { retrieved: [], score: 0 },
      evidenceGraph: { nodes: [], edges: [] },
      hypotheses: [],
      counterHypotheses: [],
      contradictions: [],
      beliefs: {},
      riskEstimate: { score: 0, category: 'unknown', rationale: 'Initial capture stage' },
      type: 'capture',
      subjectId: '',
      objectId: '',
      confidence: 0,
      description: 'Initial capture result',
      durationMs,
      logs,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    const message = error instanceof Error ? error.message : 'Unknown capture error.';
    errors.push(message);
    const logEntry = createLogEntry('content-capture', 'error', 'Content capture failed.', {
      error: message,
      requestId: input.requestId,
    });
    logs.push(logEntry);
    safeLog(logger, 'error', 'content-capture', message, { requestId: input.requestId });

    return {
      success: false,
      warnings,
      errors,
      entities: [],
      relations: [],
      contextMemory: {},
      worldKnowledge: { retrieved: [], score: 0 },
      evidenceGraph: { nodes: [], edges: [] },
      hypotheses: [],
      counterHypotheses: [],
      contradictions: [],
      beliefs: {},
      riskEstimate: { score: 0, category: 'unknown', rationale: 'Capture failure' },
      type: 'capture_error',
      subjectId: '',
      objectId: '',
      confidence: 0,
      description: 'Capture failed',
      durationMs,
      logs,
    };
  }
}
