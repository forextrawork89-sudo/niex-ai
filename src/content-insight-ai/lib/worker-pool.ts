// ============================================================
// WORKER POOL — Og'ir tahlilni Web Worker'da bajaradi
//
// Muammo: analyzeContent() sinxron va og'ir.
//   Bir sahifada 100 ta matn tekshirilsa, UI muzlab qoladi.
//
// Yechim: Web Worker pool.
//   - Asosiy thread'dan alohida 2-4 worker
//   - Har bir tahlil worker'ga yuboriladi
//   - UI muzlamaydi, foydalanuvchi ishlay beradi
//
// Foydalanish:
//   const pool = getWorkerPool();
//   const result = await pool.analyze(text, 'text');
// ============================================================

import type { BrainAnalysis } from './brain';
import type { ContentType } from '../types/feedback';

interface WorkerTask {
  id: string;
  text?: string;
  contentType?: ContentType;
  imageSource?: string | File | Blob;
  videoSource?: string | File | Blob;
  audioSource?: string | File | Blob;
  transcript?: import('./ai-core/types').TranscriptionData;
  metadata?: Record<string, unknown>;
  resolve: (result: BrainAnalysis) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout> | null;
}

interface WorkerInstance {
  worker: Worker;
  busy: boolean;
  currentTaskId: string | null;
}

export class WorkerPool {
  private workers: WorkerInstance[] = [];
  private queue: WorkerTask[] = [];
  private pendingTasks: Map<string, WorkerTask> = new Map();
  private workerScript: string;
  private poolSize: number;
  private taskTimeout: number;
  private fallbackMode = false;
  private fallbackHandler: ((text: string, contentType: ContentType) => BrainAnalysis) | null = null;

  constructor(workerScript: string, options: { poolSize?: number; taskTimeout?: number } = {}) {
    this.workerScript = workerScript;
    this.poolSize = options.poolSize ?? Math.min(navigator.hardwareConcurrency || 2, 4);
    this.taskTimeout = options.taskTimeout ?? 10000;
  }

  // Set a fallback handler — runs on main thread if workers fail
  setFallback(handler: (text: string, contentType: ContentType) => BrainAnalysis): void {
    this.fallbackHandler = handler;
  }

  // Custom worker factory — set this if you bundle workers via Vite/Webpack
  private workerFactory: (() => Worker) | null = null;

  setWorkerFactory(factory: () => Worker): void {
    this.workerFactory = factory;
  }

  initialize(): void {
    if (this.workers.length > 0) return;
    if (typeof Worker === 'undefined') {
      this.fallbackMode = true;
      console.warn('[WorkerPool] Web Workers not available, falling back to main thread');
      return;
    }

    try {
      for (let i = 0; i < this.poolSize; i++) {
        const worker = this.workerFactory
          ? this.workerFactory()
          : new Worker(this.workerScript, { type: 'module' });
        worker.onmessage = (e) => this.handleWorkerMessage(i, e);
        worker.onerror = (e) => this.handleWorkerError(i, e);
        this.workers.push({ worker, busy: false, currentTaskId: null });
      }
    } catch (e) {
      console.warn('[WorkerPool] Failed to spawn workers, falling back:', e);
      this.fallbackMode = true;
    }
  }

  async analyze(
    textOrInput: string | { text?: string; imageSource?: string | File | Blob; videoSource?: string | File | Blob; audioSource?: string | File | Blob; metadata?: Record<string, unknown> },
    contentType: ContentType = 'text',
  ): Promise<BrainAnalysis> {
    if (!this.workers.length && !this.fallbackMode) this.initialize();

    if (this.fallbackMode) {
      if (this.fallbackHandler) {
        const textStr = typeof textOrInput === 'string' ? textOrInput : textOrInput.text || '';
        const cType = typeof textOrInput === 'string' ? contentType : (textOrInput as any).contentType || contentType;
        return this.fallbackHandler(textStr, cType);
      }
      throw new Error('Worker pool unavailable and no fallback handler set');
    }

    return new Promise<BrainAnalysis>((resolve, reject) => {
      const isString = typeof textOrInput === 'string';
      const task: WorkerTask = {
        id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        text: isString ? (textOrInput as string) : (textOrInput as any).text,
        contentType: isString ? contentType : (textOrInput as any).contentType || contentType,
        imageSource: isString ? undefined : (textOrInput as any).imageSource,
        videoSource: isString ? undefined : (textOrInput as any).videoSource,
        audioSource: isString ? undefined : (textOrInput as any).audioSource,
        transcript: isString ? undefined : (textOrInput as any).transcript,
        metadata: isString ? undefined : (textOrInput as any).metadata,
        resolve,
        reject,
        timeout: null,
      };

      // Set timeout
      task.timeout = setTimeout(() => {
        this.pendingTasks.delete(task.id);
        // Fallback to main thread if available
        if (this.fallbackHandler) {
          try {
            resolve(this.fallbackHandler(task.text, task.contentType));
          } catch (e) {
            reject(e as Error);
          }
        } else {
          reject(new Error(`Analysis timeout after ${this.taskTimeout}ms`));
        }
      }, this.taskTimeout);

      this.pendingTasks.set(task.id, task);

      // Try to dispatch immediately
      const freeWorker = this.workers.find((w) => !w.busy);
      if (freeWorker) {
        this.dispatchTask(freeWorker, task);
      } else {
        this.queue.push(task);
      }
    });
  }

  private dispatchTask(workerInstance: WorkerInstance, task: WorkerTask): void {
    workerInstance.busy = true;
    workerInstance.currentTaskId = task.id;
    workerInstance.worker.postMessage({
      type: 'analyze',
      taskId: task.id,
      text: task.text,
      contentType: task.contentType,
      imageSource: task.imageSource,
      videoSource: task.videoSource,
      audioSource: task.audioSource,
      transcript: task.transcript,
      metadata: task.metadata,
    });
  }

  private handleWorkerMessage(workerIdx: number, event: MessageEvent): void {
    const { taskId, type, payload, error } = event.data;
    const worker = this.workers[workerIdx];
    const task = this.pendingTasks.get(taskId);

    if (worker) {
      worker.busy = false;
      worker.currentTaskId = null;
    }

    if (task) {
      if (task.timeout) clearTimeout(task.timeout);
      this.pendingTasks.delete(taskId);

      if (type === 'result') {
        task.resolve(payload);
      } else if (type === 'error') {
        // Fallback to main thread on worker error
        if (this.fallbackHandler) {
          try {
            task.resolve(this.fallbackHandler(task.text, task.contentType));
          } catch (e) {
            task.reject(e as Error);
          }
        } else {
          task.reject(new Error(error || 'Worker error'));
        }
      }
    }

    // Dispatch next queued task
    const next = this.queue.shift();
    if (next && worker) {
      this.dispatchTask(worker, next);
    }
  }

  private handleWorkerError(workerIdx: number, event: ErrorEvent): void {
    const worker = this.workers[workerIdx];
    const taskId = worker?.currentTaskId;
    const task = taskId ? this.pendingTasks.get(taskId) : null;

    console.warn('[WorkerPool] worker error:', event.message);

    if (worker) {
      worker.busy = false;
      worker.currentTaskId = null;
    }

    if (task) {
      if (task.timeout) clearTimeout(task.timeout);
      this.pendingTasks.delete(task.id);

      if (this.fallbackHandler) {
        try {
          task.resolve(this.fallbackHandler(task.text, task.contentType));
        } catch (e) {
          task.reject(e as Error);
        }
      } else {
        task.reject(new Error(event.message));
      }
    }
  }

  getStats() {
    return {
      pool_size: this.poolSize,
      workers_busy: this.workers.filter((w) => w.busy).length,
      queue_length: this.queue.length,
      pending: this.pendingTasks.size,
      fallback_mode: this.fallbackMode,
    };
  }

  shutdown(): void {
    for (const w of this.workers) w.worker.terminate();
    this.workers = [];
    for (const task of this.pendingTasks.values()) {
      if (task.timeout) clearTimeout(task.timeout);
      task.reject(new Error('Worker pool shutdown'));
    }
    this.pendingTasks.clear();
    this.queue = [];
  }
}

// ============================================================
// SINGLETON
// ============================================================

let _pool: WorkerPool | null = null;

export function getWorkerPool(workerScript?: string): WorkerPool {
  if (!_pool) {
    const script = workerScript || '/ai.worker.js';
    _pool = new WorkerPool(script);
  }
  return _pool;
}

// Batch analyze — for monitor scenarios with many texts
export async function analyzeBatch(texts: string[], contentType: ContentType = 'text'): Promise<BrainAnalysis[]> {
  const pool = getWorkerPool();
  return Promise.all(texts.map((t) => pool.analyze(t, contentType)));
}
