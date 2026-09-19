// ============================================================
// AI WORKER — Web Worker entry point
//
// Vite buni avtomatik bundle qiladi (new Worker(new URL(...), {type:'module'}))
// Asosiy thread'dan alohida ishlaydi — UI muzlamaydi.
// ============================================================

import { processContent } from './content-insight-ai/lib/ai-core/orchestrator';
import { initializeDefaultKnowledge } from './content-insight-ai/lib/knowledge-graph';

let initialized = false;

self.onmessage = async (event: MessageEvent) => {
  const { type, taskId, text, contentType, imageSource, videoSource, audioSource, transcript, metadata } = event.data;

  if (type !== 'analyze') {
    (self as any).postMessage({ taskId, type: 'error', error: 'Unknown task type' });
    return;
  }

  try {
    if (!initialized) {
      initializeDefaultKnowledge();
      initialized = true;
    }

    // Forward all supported modalities and structured ASR transcript to AI Core
    const result = await processContent({
      requestId: `worker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text,
      imageSource,
      videoSource,
      audioSource,
      transcript,
      metadata,
      contentType: contentType || 'unknown',
    } as any);

    (self as any).postMessage({ taskId, type: 'result', payload: result });
  } catch (err) {
    (self as any).postMessage({
      taskId,
      type: 'error',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
