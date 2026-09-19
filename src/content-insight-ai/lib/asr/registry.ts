import type { ASRAdapter } from './types';

const adapters: Map<string, ASRAdapter> = new Map();

export function registerASRAdapter(adapter: ASRAdapter): void {
  adapters.set(adapter.providerName, adapter);
}

export function getASRAdapter(providerName: string): ASRAdapter | null {
  return adapters.get(providerName) || null;
}

export function listASRProviders(): string[] {
  return Array.from(adapters.keys());
}

export async function transcribeWithFallback(
  source: string | File | Blob,
  options: { providerOrder: string[]; fallbackOrder?: string[]; requestOptions?: import('./types').ASRRequestOptions },
): Promise<import('./types').TranscriptResult> {
  const tried: string[] = [];
  const providers = [...options.providerOrder, ...(options.fallbackOrder || [])];

  let lastError: unknown = null;
  for (const providerName of providers) {
    const adapter = getASRAdapter(providerName);
    if (!adapter) {
      lastError = new Error(`ASR provider not registered: ${providerName}`);
      continue;
    }

    try {
      if (!(await adapter.isAvailable())) {
        tried.push(`${providerName}: unavailable`);
        continue;
      }

      const result = await adapter.transcribe(source, options.requestOptions);
      return { ...result, metadata: { ...(result.metadata || {}), asr_provider: providerName, asr_tried: tried } };
    } catch (error) {
      tried.push(`${providerName}: ${error instanceof Error ? error.message : String(error)}`);
      lastError = error;
      continue;
    }
  }

  throw new Error(`ASR transcription failed for all providers: ${providers.join(', ')}. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}
