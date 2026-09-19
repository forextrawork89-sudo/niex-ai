import type { Logger, ModuleLogEntry } from './types';
import { nullLogger } from './types';

export function nowMs(): number {
  return Date.now();
}

export function createLogEntry(
  module: string,
  level: ModuleLogEntry['level'],
  message: string,
  context: Record<string, unknown> = {},
): ModuleLogEntry {
  return {
    module,
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

export function measureSync<T>(fn: () => T): { output: T; durationMs: number } {
  const start = nowMs();
  const output = fn();
  return { output, durationMs: nowMs() - start };
}

export async function measureAsync<T>(fn: () => Promise<T>): Promise<{ output: T; durationMs: number }> {
  const start = nowMs();
  const output = await fn();
  return { output, durationMs: nowMs() - start };
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  attempts: number,
  logger: Logger = nullLogger,
  module = 'ai-core',
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      logger.warn(`Retry ${attempt} failed for module ${module}.`, { attempt, error });
      if (attempt === attempts) break;
    }
  }
  throw lastError;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizeText(text: unknown): string {
  return typeof text === 'string' ? text.trim() : '';
}

export function safeLog(logger: Logger, level: ModuleLogEntry['level'], module: string, message: string, context: Record<string, unknown> = {}): void {
  const entry = createLogEntry(module, level, message, context);
  if (level === 'debug') logger.debug(message, context);
  if (level === 'info') logger.info(message, context);
  if (level === 'warn') logger.warn(message, context);
  if (level === 'error') logger.error(message, context);
}
